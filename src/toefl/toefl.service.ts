import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, ILike, IsNull, Not, Repository } from 'typeorm';

import { FilterQueryDto } from '@/common/dto/filter-query.dto';
import { Pagination } from '@/common/dto/response.dto';

import { CreateToeflDto } from './dto/create-toefl.dto';
import { UpdateToeflDto } from './dto/update-toefl.dto';
import { Toefl } from './entity/toefl.entity';
import { ToeflVersionService } from './toefl-version.service';

@Injectable()
export class ToeflService {
  constructor(
    @InjectRepository(Toefl)
    private readonly toeflRepo: Repository<Toefl>,
    @Inject(forwardRef(() => ToeflVersionService))
    private readonly toeflVersionService: ToeflVersionService,
  ) {}

  async findAllToefl(
    filter?: FilterQueryDto,
    published?: boolean,
    premium?: boolean,
  ): Promise<{ data: Toefl[]; pagination: Pagination }> {
    const { search, limit, page, order, sort } = filter;

    const commonQuery = {
      take: limit,
      skip: (page - 1) * limit,
      order: { [order]: sort },
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
    });

    const pagination = {
      page,
      pageSize: dataFromDb.length,
      totalPage: Math.ceil(countFromDb / limit),
      totalData: countFromDb,
    };

    return { data: dataFromDb, pagination };
  }

  async findOneToefl(toeflId?: string): Promise<Omit<Toefl, 'setId'>> {
    const toefl = await this.toeflRepo.findOne({
      where: { id: toeflId },
    });
    return { ...toefl };
  }

  async createToefl(userId: string, data: CreateToeflDto): Promise<Toefl> {
    const toeflInp: DeepPartial<Toefl> = { ...data, createdBy: { id: userId } };
    const toefl = await this.toeflRepo.save(this.toeflRepo.create(toeflInp));
    await this.toeflVersionService.createDefaultToeflVersion(toefl);
    // const versions = await this.toeflVersionService.findAllToeflVersion(
    //   toefl.id,
    // );
    // if (versions.length <= 1) {
    await this.toeflVersionService.activateLastToeflVersion(toefl.id);
    // }
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
