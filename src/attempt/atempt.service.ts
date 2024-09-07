import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormService } from '@/form/form.service';

import { CreateAttemptDto } from './dto/create-attempt.dto';
import { Attempt } from './entity/attempt.entity';

@Injectable()
export class AttemptService {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptRepo: Repository<Attempt>,
    private readonly formService: FormService,
  ) {}

  async create(
    userId: string,
    formId: string,
    data: CreateAttemptDto,
  ): Promise<Attempt> {
    const form = await this.formService.findOneForm(formId);
    if (!form) throw new NotFoundException(`Form with id ${formId} not found`);

    const attempt = this.attemptRepo.create({
      ...data,
      form,
      user: {
        id: userId,
      },
    });
    return this.attemptRepo.save(attempt);
  }

  async findAllRestrict(formId: string, userId: string): Promise<Attempt[]> {
    return this.attemptRepo.find({
      where: { form: { id: formId }, user: { id: userId } },
    });
  }

  async findOne(attemptId: string): Promise<Attempt> {
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId },
      relations: ['user'],
    });
    if (!attempt)
      throw new NotFoundException(`Attempt with id ${attemptId} not found`);
    return attempt;
  }
}
