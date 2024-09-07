import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuestionService } from '@/question/question.service';

import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option } from './entity/option.entity';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepo: Repository<Option>,
    private readonly questionService: QuestionService,
  ) {}

  async create(questionId: string, data: CreateOptionDto): Promise<Option> {
    const form = await this.questionService.findOne(questionId);
    if (!form)
      throw new NotFoundException(`Question with id ${questionId} not found`);

    const option = this.optionRepo.create({
      ...data,
      question: {
        id: questionId,
      },
    });
    return this.optionRepo.save(option);
  }

  async findAll(questionId?: string): Promise<Option[]> {
    return this.optionRepo.find({
      where: { deletedAt: null, question: { id: questionId } },
    });
  }

  async findOne(id: string): Promise<Option> {
    const option = await this.optionRepo.findOne({
      where: { id },
    });
    if (!option) throw new NotFoundException(`Option with id ${id} not found`);
    return option;
  }

  async update(optionId: string, data: UpdateOptionDto): Promise<Option> {
    const option = await this.findOne(optionId);

    Object.assign(option, data);
    return this.optionRepo.save(option);
  }

  async remove(id: string): Promise<void> {
    const option = await this.findOne(id);
    await this.optionRepo.remove(option);
  }
}
