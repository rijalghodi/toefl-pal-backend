import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { CreateToeflItpDto } from './dto/create-toefl-itp.dto';
import { UpdateToeflItpDto } from './dto/update-toefl-itp.dto';
import { ToeflItp } from './entity/toefl-itp.entity';

@Injectable()
export class ToeflItpService {
  constructor(
    @InjectRepository(ToeflItp)
    private readonly toeflItpRepository: Repository<ToeflItp>,
  ) {}

  async findAllToeflItp(published?: boolean): Promise<ToeflItp[]> {
    if (published === undefined || published === null) {
      return this.toeflItpRepository.find();
    }

    if (published === false) {
      return this.toeflItpRepository.find({
        where: { publishedAt: null },
      });
    }

    if (published === true) {
      return this.toeflItpRepository.find({
        where: { publishedAt: Not(IsNull()) },
      });
    }
    return [];
  }

  async createToeflItp(data: CreateToeflItpDto): Promise<ToeflItp> {
    const toeflItpInp = { ...data, version: 1 };
    const toeflItp = this.toeflItpRepository.create(toeflItpInp);
    return this.toeflItpRepository.save(toeflItp);
  }

  async updateToeflItp(
    id: number,
    data: Partial<UpdateToeflItpDto>,
  ): Promise<ToeflItp> {
    const toeflItp = await this.findLatestToeflItpVersion(id);

    if (!toeflItp) {
      throw new NotFoundException(`ToeflItp with ID ${id} not found`);
    }

    this.toeflItpRepository.merge(toeflItp, data);
    return this.toeflItpRepository.save(toeflItp);
  }

  async publishToeflItp(id: number, published?: boolean): Promise<ToeflItp> {
    const toeflItp = await this.toeflItpRepository.findOne({ where: { id } });

    if (!toeflItp) {
      throw new NotFoundException(`ToeflItp with ID ${id} not found`);
    }

    if (published || published === undefined) {
      toeflItp.publishedAt = new Date();
    } else {
      toeflItp.publishedAt = null;
    }

    return this.toeflItpRepository.save(toeflItp);
  }

  async findLatestToeflItpVersion(id: number): Promise<ToeflItp> {
    return this.toeflItpRepository.findOne({
      where: { id },
      order: { createdAt: 'DESC' },
    });
  }
}
