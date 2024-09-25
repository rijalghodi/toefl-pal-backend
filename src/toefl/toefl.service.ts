import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, ILike, IsNull, Not, Repository } from 'typeorm';

import { FilterQueryDto } from '@/common/dto/filter-query.dto';
import { Pagination } from '@/common/dto/response.dto';
import { Form } from '@/form/entity/form.entity';
import { SkillType } from '@/form/enum/skill-type.enum';
import { FormService } from '@/form/form.service';
import { PartService } from '@/part/part.service';

import { CreateToeflDto } from './dto/create-toefl.dto';
import { UpdateToeflDto } from './dto/update-toefl.dto';
import { Toefl } from './entity/toefl.entity';

@Injectable()
export class ToeflService {
  constructor(
    @InjectRepository(Toefl)
    private readonly toeflRepo: Repository<Toefl>,
    private readonly formService: FormService,
    private readonly partService: PartService,
  ) {}

  async findAllToefl(
    filter?: FilterQueryDto,
    published?: boolean,
    premium?: boolean,
  ): Promise<{ data: Toefl[]; pagination: Pagination }> {
    const { search = '', limit = 100, page = 1 } = filter;

    const commonQuery = {
      take: limit,
      skip: (page - 1) * limit,
      // order: { [order]: sort },
    };

    const publishedCondition =
      published === undefined || published === null
        ? {}
        : published
          ? { publishedAt: Not(IsNull()) }
          : { publishedAt: IsNull() };

    const premiumCondition =
      premium === undefined || premium === null ? {} : { premium: premium };

    const whereCondition = [
      {
        name: ILike(`%${search}%`),
        deletedAt: IsNull(),
        ...publishedCondition,
        ...premiumCondition,
      },
      {
        description: ILike(`%${search}%`),
        deletedAt: IsNull(),
        ...publishedCondition,
        ...premiumCondition,
      },
    ];

    const [dataFromDb, countFromDb] = await this.toeflRepo.findAndCount({
      ...commonQuery,
      where: whereCondition,
      order: { premium: 'ASC', createdAt: 'DESC' },
    });

    const pagination = {
      page,
      pageSize: dataFromDb.length,
      totalPage: Math.ceil(countFromDb / limit),
      totalData: countFromDb,
    };

    return { data: dataFromDb, pagination };
  }

  async   findOneToefl(toeflId?: string): Promise<any> {
    const toefl = await this.toeflRepo.findOne({
      where: { id: toeflId },
      relations: [
        'readingSection',
        'listeningSection',
        'grammarSection',
        'readingSection.questions',
        'listeningSection.questions',
        'grammarSection.questions',
      ],
    });

    const formatSection = (section?: Form) => ({
      duration: section?.duration,
      questionNum: section?.questions?.length ?? 0,
      name: section?.name,
      id: section?.id,
    });

    const {
      readingSection,
      listeningSection,
      grammarSection,
      ...toeflWithoutSection
    } = toefl ?? {};

    return {
      ...toeflWithoutSection,
      readingSection: formatSection(readingSection),
      listeningSection: formatSection(listeningSection),
      grammarSection: formatSection(grammarSection),
    };
  }

  async createToefl(userId: string, data: CreateToeflDto): Promise<Toefl> {
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

    // --- Create TOEFL  ---

    const toeflInp: DeepPartial<Toefl> = {
      ...data,
      listeningSection,
      readingSection,
      grammarSection,
      createdBy: { id: userId },
    };
    const toefl = await this.toeflRepo.save(this.toeflRepo.create(toeflInp));

    return toefl;
  }

  async updateToefl(
    toeflId: string,
    data: Partial<UpdateToeflDto>,
  ): Promise<Toefl> {
    const toefl = await this.findOneToefl(toeflId);
    if (!toefl) {
      throw new NotFoundException(`Toefl with ID ${toeflId} not found`);
    }

    const newToefl = Object.assign(toefl, data);
    return this.toeflRepo.save(newToefl);
  }

  async publishToefl(id: string, published?: boolean): Promise<Toefl> {
    const toefl = await this.findOneToefl(id);
    if (!toefl) {
      throw new NotFoundException(`Toefl with ID ${id} not found`);
    }

    toefl.publishedAt =
      published || published === undefined ? new Date() : null;
    return this.toeflRepo.save(toefl);
  }

  async premiumToefl(id: string, premium: boolean): Promise<Toefl> {
    const toefl = await this.findOneToefl(id);
    if (!toefl) {
      throw new NotFoundException(`Toefl with ID ${id} not found`);
    }
    toefl.premium = premium;
    return this.toeflRepo.save(toefl);
  }
}
