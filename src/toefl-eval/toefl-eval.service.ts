import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AttemptService } from '@/attempt/attempt.service';
import { EvalService } from '@/eval/eval.service';
import { ToeflService } from '@/toefl/toefl.service';
import { UserService } from '@/user/user.service';

import { ToeflEval } from './entity/toefl-eval.entity';

@Injectable()
export class ToeflEvalService {
  constructor(
    @InjectRepository(ToeflEval)
    private readonly toeflEvalRepo: Repository<ToeflEval>,
    private readonly toeflService: ToeflService,
    private readonly userService: UserService,
    private readonly attemptService: AttemptService,
    private readonly evalService: EvalService,
  ) {}

  async createDefaultToeflEval(
    toeflId: string,
    userId: string,
  ): Promise<ToeflEval> {
    const toefl = await this.toeflService.findOneToefl(toeflId);
    const user = await this.userService.findOne({ id: userId });

    const readingAttempt = await this.attemptService.createAttempt(
      userId,
      toefl.readingSection.id,
      {},
    );
    const listeningAttempt = await this.attemptService.createAttempt(
      userId,
      toefl.listeningSection.id,
      {},
    );
    const grammarAttempt = await this.attemptService.createAttempt(
      userId,
      toefl.grammarSection.id,
      {},
    );

    const readingEval = await this.evalService.createEval(readingAttempt.id);
    const listeningEval = await this.evalService.createEval(
      listeningAttempt.id,
    );
    const grammarEval = await this.evalService.createEval(grammarAttempt.id);

    const newToeflEval = this.toeflEvalRepo.create({
      toefl,
      user,
      readingEval,
      listeningEval,
      grammarEval,
      totalScore: null,
      maxScore: null,
    });

    return this.toeflEvalRepo.save(newToeflEval);
  }

  async findAllMetaOnly(userId: string): Promise<ToeflEval[]> {
    return this.toeflEvalRepo.find({
      where: { user: { id: userId } },
      relations: ['readingEval', 'grammarEval', 'listeningEval', 'toefl'],
    });
  }

  async findOne(toeflId: string, userId: string): Promise<ToeflEval> {
    const toeflEval = await this.toeflEvalRepo.findOne({
      where: { toefl: { id: toeflId }, user: { id: userId } },
      relations: [
        'readingEval',
        'grammarEval',
        'listeningEval',
        'readingEval.attempt',
        'listeningEval.attempt',
        'grammarEval.attempt',
      ],
    });

    if (!toeflEval) return this.createDefaultToeflEval(toeflId, userId);

    return toeflEval.stale ? this.calculateScore(toeflId, userId) : toeflEval;
  }

  async calculateScore(toeflId: string, userId: string): Promise<ToeflEval> {
    const toeflEval = await this.toeflEvalRepo.findOne({
      where: { toefl: { id: toeflId }, user: { id: userId } },
      relations: [
        'readingEval',
        'grammarEval',
        'listeningEval',
        'readingEval.attempt',
        'grammarEval.attempt',
        'listeningEval.attempt',
        'toefl',
      ],
    });

    if (!toeflEval) throw new NotFoundException('Toefl Eval not found');

    const { readingEval, listeningEval, grammarEval } = toeflEval;

    const updatedReadingEval = await this.evalService.calculateScore(
      readingEval?.attempt?.id,
    );
    const updatedGrammarEval = await this.evalService.calculateScore(
      grammarEval?.attempt?.id,
    );
    const updatedListeningEval = await this.evalService.calculateScore(
      listeningEval?.attempt?.id,
    );

    toeflEval.totalScore =
      (updatedReadingEval.correctAnswerNum || 0) +
      (updatedGrammarEval.correctAnswerNum || 0) +
      (updatedListeningEval.correctAnswerNum || 0);

    toeflEval.maxScore =
      (updatedReadingEval.questionNum || 0) +
      (updatedGrammarEval.questionNum || 0) +
      (updatedListeningEval.questionNum || 0);

    toeflEval.stale = false;
    await this.toeflEvalRepo.save(toeflEval);

    return this.findOne(toeflId, userId);
  }

  async staleScore(
    toeflId: string,
    userId: string,
    stale = true,
  ): Promise<ToeflEval> {
    const toeflEval = await this.toeflEvalRepo.findOne({
      where: { toefl: { id: toeflId }, user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    toeflEval.stale = stale;
    return this.toeflEvalRepo.save(toeflEval);
  }
}
