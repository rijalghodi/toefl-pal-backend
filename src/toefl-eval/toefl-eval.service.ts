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

    // Create attempts for each section
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

    // Create evaluations for each attempt with null values initially
    const readingEval = await this.evalService.createEval(readingAttempt.id);
    const listeningEval = await this.evalService.createEval(
      listeningAttempt.id,
    );
    const grammarEval = await this.evalService.createEval(grammarAttempt.id);

    // Create ToeflEval with created evaluations
    const newToeflEval = this.toeflEvalRepo.create({
      toefl,
      user,
      readingEval,
      listeningEval,
      grammarEval,
      totalScore: null, // This will be calculated later
      maxScore: null, // This will be calculated later
    });

    return await this.toeflEvalRepo.save(newToeflEval);
  }

  async findOne(toeflId: string, userId: string): Promise<ToeflEval> {
    /**
     * This will:
     * - Return the ToeflEval if it exists
     * - Otherwise, create a new ToeflEval with:
     *   - attempts
     *   - evaluations
     *   - If stale, recalculate the score
     */

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

    if (toeflEval) {
      // Check if the evaluation is stale
      if (toeflEval.stale) {
        return await this.calculateScore(toeflId, userId); // Recalculate score
      }
      return toeflEval;
    }

    return await this.createDefaultToeflEval(toeflId, userId); // Create new evaluation
  }

  // Calculate the score
  async calculateScore(toeflId: string, userId: string): Promise<ToeflEval> {
    // Find the Toefl evaluation
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

    // Get evaluations from the ToeflEval
    const { readingEval, listeningEval, grammarEval } = toeflEval;

    // Update the evaluations before calculating scores
    const updatedReadingEval = await this.evalService.calculateScore(
      readingEval?.attempt?.id,
    );
    const updatedGrammarEval = await this.evalService.calculateScore(
      grammarEval?.attempt?.id,
    );
    const updatedListeningEval = await this.evalService.calculateScore(
      listeningEval?.attempt?.id,
    );
    // Update the ToeflEval with the total score
    toeflEval.totalScore =
      updatedReadingEval.correctAnswerNum ||
      0 + updatedGrammarEval.correctAnswerNum ||
      0 + updatedListeningEval.correctAnswerNum ||
      0;
    toeflEval.maxScore =
      updatedReadingEval.questionNum ||
      0 + updatedGrammarEval.questionNum ||
      0 + updatedListeningEval.questionNum ||
      0;
    toeflEval.stale = false; // Reset stale state

    return await this.toeflEvalRepo.save(toeflEval);
  }

  // Update the stale state of the evaluation
  async staleScore(
    toeflId: string,
    userId: string,
    stale?: boolean,
  ): Promise<ToeflEval> {
    const toeflEval = await this.toeflEvalRepo.findOne({
      where: { toefl: { id: toeflId }, user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    toeflEval.stale = stale;
    return await this.toeflEvalRepo.save(toeflEval);
  }
}
