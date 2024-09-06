import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { SectionService } from '@/section/section.service';

import { Toefl } from './entity/toefl.entity';
import { ToeflVersion } from './entity/toefl-version.entity';
import { ToeflService } from './toefl.service';
// import { SectionService } from './section.service';

@Injectable()
export class ToeflVersionService {
  constructor(
    @InjectRepository(ToeflVersion)
    private readonly toeflVersionRepo: Repository<ToeflVersion>,
    @Inject(forwardRef(() => ToeflService))
    private readonly toeflService: ToeflService,
    private readonly sectionService: SectionService,
  ) {}

  async createDefaultToeflVersion(toefl: Toefl): Promise<ToeflVersion> {
    const [listeningSection, listeningSectionVersion] =
      await this.sectionService.createSection('Listening Section', 35 * 60);

    const [readingSection, readingSectionVersion] =
      await this.sectionService.createSection('Reading Section', 50 * 60);

    const [grammarSection, grammarSectionVersion] =
      await this.sectionService.createSection(
        'Structure & Written Expression Section',
        25 * 60,
      );

    const toeflVersionInp: DeepPartial<ToeflVersion> = {
      listeningSection,
      listeningSectionVersion,
      readingSection,
      readingSectionVersion,
      grammarSection,
      grammarSectionVersion,
      toefl,
    };

    return this.toeflVersionRepo.save(
      this.toeflVersionRepo.create(toeflVersionInp),
    );
  }

  async findAllToeflVersion(toeflId: string): Promise<ToeflVersion[]> {
    return this.toeflVersionRepo.find({
      where: { toefl: { id: toeflId } },
      order: { createdAt: 'DESC' },
    });
  }

  async createToeflVersion(toeflId: string): Promise<ToeflVersion> {
    const toeflLatestVersion = await this.findLatestToeflVersion(toeflId);
    const toefl = await this.toeflService.findOneToefl(toeflId);

    const grammarSectionVersion =
      await this.sectionService.createSectionVersion(
        toeflLatestVersion.grammarSection.id,
      );
    const listeningSectionVersion =
      await this.sectionService.createSectionVersion(
        toeflLatestVersion.listeningSection.id,
      );
    const readingSectionVersion =
      await this.sectionService.createSectionVersion(
        toeflLatestVersion.readingSection.id,
      );

    const newVersion: DeepPartial<ToeflVersion> = {
      grammarSection: toeflLatestVersion.grammarSection,
      grammarSectionVersion,
      listeningSection: toeflLatestVersion.listeningSection,
      listeningSectionVersion,
      readingSection: toeflLatestVersion.readingSection,
      readingSectionVersion,
      toefl,
    };

    return this.toeflVersionRepo.save(this.toeflVersionRepo.create(newVersion));
  }

  async findLatestToeflVersion(toeflId: string): Promise<ToeflVersion> {
    return this.toeflVersionRepo.findOne({
      where: { toefl: { id: toeflId } },
      order: { createdAt: 'DESC' },
      relations: [
        'readingSection',
        'readingSectionVersion',
        'listeningSection',
        'listeningSectionVersion',
        'grammarSection',
        'grammarSectionVersion',
      ],
    });
  }
}
