import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AnswerService } from '@/answer/answer.service';
import { UpdateAnswerBulkDto } from '@/answer/dto/update-answer.dto';
import { FormService } from '@/form/form.service';
import { UserService } from '@/user/user.service';

import { CreateAttemptDto } from './dto/create-attempt.dto';
import { Attempt } from './entity/attempt.entity';

@Injectable()
export class AttemptService {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptRepo: Repository<Attempt>,
    private readonly formService: FormService,
    private readonly answerService: AnswerService,
    private readonly userService: UserService,
  ) {}

  async startAttempt(userId: string, formId: string) {
    // ubah endTime
    // ubah startedAt jadi now
    // ubah finishedAt jadi null

    // Status:
    // Not taken: startedAt null
    // In progress: startedAt not null, finishedAt null && endtime < server time
    // Finished: startedAt not null, finishedAt not null || endtime > server time

    // --- find attempt ---
    let attempt: Attempt = null;
    attempt = await this.findOneAttempt(userId, formId);

    // Lazy create attempt
    if (!attempt) {
      attempt = await this.createAttempt(userId, formId, {});
    }

    // Set startedAt to now
    attempt.startedAt = new Date();

    // Set endTime based on form duration in minutes
    const now = new Date();
    attempt.endTime = new Date(
      now.getTime() + attempt.form.duration * 60 * 1000,
    ); // duration assumed to be in minutes

    // Reset finishedAt to null
    attempt.finishedAt = null;

    return await this.attemptRepo.save(attempt);
  }

  async finishAttempt(
    userId: string,
    formId: string,
    dto: UpdateAnswerBulkDto,
  ) {
    // --- find attempt ---
    const attempt = await this.findOneAttempt(userId, formId);

    await this.answerService.updateAnswerBulk(attempt.id, dto.answers);

    // -- get attempt with updated answer ---
    const newAttempt = await this.findOneAttempt(userId, formId);

    // Set finishedAt to nowp
    newAttempt.finishedAt = new Date();

    // Update answers

    return await this.attemptRepo.save(newAttempt);
  }

  async createAttempt(
    userId: string,
    formId: string,
    data: CreateAttemptDto,
  ): Promise<Attempt> {
    const form = await this.formService.findOneForm(formId);
    const user = await this.userService.findOne({ id: userId });

    const attemptInp = this.attemptRepo.create({
      ...data,
      form,
      user,
    });

    const attempt = await this.attemptRepo.save(attemptInp);

    // Create default answers
    // await this.answerService.createDefaultAnswersForAttempt(attempt.id);
    return attempt;
  }

  async findOneAttempt(userId: string, formId: string): Promise<Attempt> {
    const attempt = await this.attemptRepo.findOne({
      where: { form: { id: formId }, user: { id: userId } },
      relations: ['user', 'form', 'answers', 'answers.option', 'answers.question'],
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    // if (attempt.user.id !== userId) {
    //   throw new ForbiddenException('Unauthorized attempt');
    // }

    return attempt;
  }

  async findOneAttemptWithServerTime(
    userId: string,
    formId: string,
  ): Promise<Attempt & { remainingTime: number }> {
    const attempt = await this.findOneAttempt(userId, formId);

    const serverTime = new Date();

    let remainingTime = null;

    if (attempt.endTime) {
      const endTime = new Date(attempt.endTime);
      const serverCurrentTime = new Date(serverTime);

      // Calculate time difference between server's time and client time
      const timeDifference = Date.now() - serverCurrentTime.getTime();

      remainingTime = endTime.getTime() - (Date.now() - timeDifference); // in milliseconds
    }

    return { ...attempt, remainingTime };
  }
}
