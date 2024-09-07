import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Option } from '@/option/entity/option.entity';
import { OptionService } from '@/option/option.service';
import { QuestionService } from '@/question/question.service';

import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { Key } from './entity/key.entity';

@Injectable()
export class KeyService {
  constructor(
    @InjectRepository(Key)
    private readonly keyRepo: Repository<Key>,
    private readonly questionService: QuestionService,
    private readonly optioanService: OptionService,
  ) {}

  async create(questionId: string, data: CreateKeyDto): Promise<Key> {
    const question =
      await this.questionService.findOneWithAnswerKey(questionId);

    if (!question)
      throw new NotFoundException(`Question with id ${questionId} not found`);

    const option = await this.optioanService.findOne(data.optionId);

    if (!option)
      throw new NotFoundException(`Option with id ${data.optionId} not found`);

    if (!question.options?.some((v: Option) => v.id === data.optionId))
      throw new BadRequestException(`No option in question match your option`);

    // For now, we limit one question, one answer key
    if (!(question.keys && question.keys.length === 0))
      throw new BadRequestException(
        `Two answer key not allowed in one question`,
      );

    const key = this.keyRepo.create({
      ...data,
      question: {
        id: questionId,
      },
      option: {
        id: data.optionId,
      },
    });
    return this.keyRepo.save(key);
  }

  async findAll(questionId?: string): Promise<Key[]> {
    return this.keyRepo.find({
      where: { deletedAt: null, question: { id: questionId } },
    });
  }

  async findOne(id: string): Promise<Key> {
    const key = await this.keyRepo.findOne({
      where: { id },
    });
    if (!key) throw new NotFoundException(`Key with id ${id} not found`);
    return key;
  }

  async update(questionId: string, data: UpdateKeyDto): Promise<Key> {
    const key = await this.keyRepo.findOne({
      where: { question: { id: questionId } },
    });

    if (!key)
      throw new NotFoundException(`Key with id ${questionId} not found`);

    const question = await this.questionService.findOne(questionId);

    if (!question)
      throw new NotFoundException(`Question with id ${questionId} not found`);

    if (data.optionId) {
      const option = await this.optioanService.findOne(data.optionId);

      if (!option)
        throw new NotFoundException(
          `Option with id ${data.optionId} not found`,
        );

      if (!question.options.some((v: Option) => v.id === option.id))
        throw new NotFoundException(`No option in question match your option`);
      Object.assign(key, {
        option: {
          id: data.optionId,
        },
      });
    }

    Object.assign(key, data);
    return this.keyRepo.save(key);
  }

  async remove(id: string): Promise<void> {
    const key = await this.findOne(id);
    await this.keyRepo.remove(key);
  }
}
