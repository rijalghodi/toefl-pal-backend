import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

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
    await this.questionService.findOneQuestion(questionId);

    // Order
    // Get the highest current order for the given formId
    const highestOrder = await this.optionRepo
      .createQueryBuilder('option')
      .where('option.question_id = :questionId', { questionId })
      .select('MAX(option.order)', 'maxOrder')
      .getRawOne();

    const option = this.optionRepo.create({
      ...data,
      question: { id: questionId },
      order: (highestOrder?.maxOrder ?? 0) + 1,
    });

    return this.optionRepo.save(option);
  }

  async createBulk(
    questionId: string,
    options: string[],
  ): Promise<DeepPartial<Option>[]> {
    const optionsToInsert: DeepPartial<Option>[] = options.map(
      (text, index) => ({
        text,
        order: index + 1,
        question: { id: questionId },
      }),
    );

    const result = await this.optionRepo.insert(optionsToInsert);
    return result.identifiers.map((identifier, index) => ({
      ...optionsToInsert[index],
      id: identifier.id,
    }));
  }

  async updateBulk(
    updates: { id: string; text?: string; order?: number }[],
  ): Promise<Option[]> {
    const updatedOptions: Option[] = [];

    for (const update of updates) {
      const updatedOption = await this.updateOption(update.id, {
        text: update.text,
        order: update.order,
      });

      updatedOptions.push(updatedOption);
    }

    return updatedOptions;
  }

  async findAllOption(questionId?: string): Promise<Option[]> {
    return this.optionRepo.find({
      where: { deletedAt: null, question: { id: questionId } },
      order: { order: 'ASC' },
    });
  }

  async findOneOption(id: string): Promise<Option> {
    const option = await this.optionRepo.findOne({
      where: { id },
    });

    if (!option) {
      throw new NotFoundException(`Option with id ${id} not found`);
    }

    return option;
  }

  async updateOption(optionId: string, data: UpdateOptionDto): Promise<Option> {
    const option = await this.findOneOption(optionId);

    Object.assign(option, data);
    return this.optionRepo.save(option);
  }

  async removeOption(id: string): Promise<void> {
    const option = await this.findOneOption(id);
    await this.optionRepo.remove(option);
  }
}
