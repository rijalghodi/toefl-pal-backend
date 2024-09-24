import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { Form } from '@/form/entity/form.entity';
import { SkillType } from '@/form/enum/skill-type.enum';
import { FormService } from '@/form/form.service';
import { PartService } from '@/part/part.service';

import { Toefl } from './entity/toefl.entity';
import { ToeflVersion } from './entity/toefl-version.entity';
import { ToeflService } from './toefl.service';

@Injectable()
export class ToeflVersionService {
  constructor(
    @InjectRepository(ToeflVersion)
    private readonly toeflVersionRepo: Repository<ToeflVersion>,
    @Inject(forwardRef(() => ToeflService))
    private readonly toeflService: ToeflService,
    private readonly formService: FormService,
    private readonly partService: PartService,
  ) {}

  async createDefaultToeflVersion(toefl: Toefl): Promise<ToeflVersion> {
    /**
     * In this method, we create three things:
     * 1. TOEFL sections (listening, reading, grammar), which is forms
     * 2. TOEFL section part
     * 3. TOEFL version
     */

    // --- Create Sections ---

    const listeningSection = await this.formService.createForm({
      name: 'Listening Section',
      duration: 35,
      skillType: SkillType.Listening,
    });

    const readingSection = await this.formService.createForm({
      name: 'Reading Section',
      duration: 50,
      skillType: SkillType.Reading,
    });

    const grammarSection = await this.formService.createForm({
      name: 'Structure & Written Section',
      duration: 25,
      skillType: SkillType.Grammar,
    });

    // --- Create section parts ---
    await this.partService.create(listeningSection.id, {
      order: 1,
      name: 'Untitled',
    });

    await this.partService.create(readingSection.id, {
      order: 1,
      name: 'Untitled',
    });

    await this.partService.create(grammarSection.id, {
      order: 1,
      name: 'Untitled',
    });

    // --- Create TOEFL version ---

    const toeflVersionInp: DeepPartial<ToeflVersion> = {
      listeningSection,
      readingSection,
      grammarSection,
      toefl,
    };

    return this.toeflVersionRepo.save(
      this.toeflVersionRepo.create(toeflVersionInp),
    );
  }

  async findAllToeflVersion(toeflId: string): Promise<ToeflVersion[]> {
    return this.toeflVersionRepo.find({
      where: { toefl: { id: toeflId }, deletedAt: null },
      order: { createdAt: 'DESC' },
    });
  }

  async createToeflVersion(toeflId: string): Promise<ToeflVersion> {
    const toeflActiveVersion = await this.findActiveToeflVersion(toeflId);
    const toefl = await this.toeflService.findOneToefl(toeflId);

    if (!toeflActiveVersion) {
      throw new NotFoundException(
        'no active toefl version. try to activate latest version',
      );
    }

    const grammarSection = await this.formService.createForm(
      toeflActiveVersion.grammarSection,
    );

    const listeningSection = await this.formService.createForm(
      toeflActiveVersion.listeningSection,
    );
    const readingSection = await this.formService.createForm(
      toeflActiveVersion.readingSection,
    );

    const newVersion: DeepPartial<ToeflVersion> = {
      readingSection,
      listeningSection,
      grammarSection,
      toefl,
    };

    return this.toeflVersionRepo.save(this.toeflVersionRepo.create(newVersion));
  }

  async findToeflVersion(toeflId: string, active?: boolean): Promise<any> {
    const whereCondition =
      active !== undefined
        ? { toefl: { id: toeflId }, active }
        : { toefl: { id: toeflId } };

    const toefl = await this.toeflVersionRepo.findOne({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      relations: [
        'readingSection',
        'listeningSection',
        'grammarSection',
        'readingSection.questions',
        'listeningSection.questions',
        'grammarSection.questions',
      ],
    });

    const formatSection = (section: Form) => ({
      duration: section.duration,
      questionNum: section.questions?.length ?? 0,
      name: section.name,
      id: section.id,
    });

    const {
      readingSection,
      listeningSection,
      grammarSection,
      ...toeflWithoutSection
    } = toefl;

    return {
      ...toeflWithoutSection,
      readingSection: formatSection(readingSection),
      listeningSection: formatSection(listeningSection),
      grammarSection: formatSection(grammarSection),
    };
  }

  async findActiveToeflVersion(toeflId: string): Promise<any> {
    return this.findToeflVersion(toeflId, true);
  }

  async findLatestToeflVersion(toeflId: string): Promise<any> {
    return this.findToeflVersion(toeflId);
  }

  async activateLastToeflVersion(toeflId: string): Promise<ToeflVersion> {
    const versions = await this.findAllToeflVersion(toeflId);
    this.toeflVersionRepo.save(versions.map((v) => ({ ...v, active: false })));
    const latest = versions[0];
    return this.toeflVersionRepo.save({ ...latest, active: true });
  }

  async removeLastToeflVersion(toeflId: string): Promise<ToeflVersion> {
    const versions = await this.findAllToeflVersion(toeflId);
    if (!versions || versions.length <= 1) {
      throw new BadRequestException('Cannot remove version with only 1');
    }
    const latest = versions[0];
    await this.toeflVersionRepo.softRemove(latest);
    if (latest.active) {
      const nextLatest = await this.findLatestToeflVersion(toeflId);
      await this.toeflVersionRepo.save({ ...nextLatest, active: true });
    }
    return null;
  }
}
