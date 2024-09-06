import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { FormService } from '@/form/form.service';

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
  ) {}

  async createDefaultToeflVersion(toefl: Toefl): Promise<ToeflVersion> {
    const listeningSection = await this.formService.createForm({
      name: 'Listening Section',
      duration: 35 * 60,
    });
    const readingSection = await this.formService.createForm({
      name: 'Reading Section',
      duration: 50 * 60,
    });
    const grammarSection = await this.formService.createForm({
      name: 'Structure & Written Section',
      duration: 25 * 60,
    });

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

  async findActiveToeflVersion(toeflId: string): Promise<ToeflVersion> {
    return this.toeflVersionRepo.findOne({
      where: { toefl: { id: toeflId }, active: true },
      order: { createdAt: 'DESC' },
      relations: ['readingSection', 'listeningSection', 'grammarSection'],
    });
  }

  async findLatestToeflVersion(toeflId: string): Promise<ToeflVersion> {
    return this.toeflVersionRepo.findOne({
      where: { toefl: { id: toeflId } },
      order: { createdAt: 'DESC' },
      relations: ['readingSection', 'listeningSection', 'grammarSection'],
    });
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
