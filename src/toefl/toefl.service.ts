import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, IsNull, Not, Repository } from 'typeorm';

import { CreateToeflDto } from './dto/create-toefl.dto';
import { UpdateToeflDto } from './dto/update-toefl.dto';
import { Toefl } from './entity/toefl.entity';
import { ToeflVersion } from './entity/toefl-version.entity';
import { ToeflVersionService } from './toefl-version.service';

@Injectable()
export class ToeflService {
  constructor(
    @InjectRepository(Toefl)
    private readonly toeflRepo: Repository<Toefl>,
    @Inject(forwardRef(() => ToeflVersionService))
    private readonly toeflVersionService: ToeflVersionService,
  ) {}

  async findAllToefl(published?: boolean): Promise<Toefl[]> {
    if (published === undefined || published === null) {
      return this.toeflRepo.find();
    }

    return this.toeflRepo.find({
      where: published
        ? { publishedAt: Not(IsNull()), deletedAt: null }
        : { publishedAt: null, deletedAt: null },
    });
  }

  async findOneToefl(
    toeflId?: string,
  ): Promise<Omit<Toefl, 'setId'> & { version: ToeflVersion[] }> {
    const toefl = await this.toeflRepo.findOne({ where: { id: toeflId } });
    const toeflVersion =
      await this.toeflVersionService.findAllToeflVersion(toeflId);
    return { ...toefl, version: toeflVersion };
  }

  async createToefl(userId: string, data: CreateToeflDto): Promise<Toefl> {
    const toeflInp: DeepPartial<Toefl> = { ...data, createdBy: { id: userId } };
    const toefl = await this.toeflRepo.save(this.toeflRepo.create(toeflInp));
    await this.toeflVersionService.createDefaultToeflVersion(toefl);
    const versions = await this.toeflVersionService.findAllToeflVersion(
      toefl.id,
    );
    if (versions.length <= 1) {
      await this.toeflVersionService.activateLastToeflVersion(toefl.id);
    }
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
}
