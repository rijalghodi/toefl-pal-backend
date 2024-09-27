import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Answer } from '@/answer/entity/answer.entity';
import { Attempt } from '@/attempt/entity/attempt.entity';
import { QuestionService } from '@/question/question.service';

import { Eval } from './entity/eval.entity';

@Injectable()
export class EvalService {
  constructor(
    @InjectRepository(Eval)
    private readonly evalRepo: Repository<Eval>,
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Attempt)
    private readonly attemptRepo: Repository<Attempt>,
    private readonly questionService: QuestionService,
  ) {}

  async createEval(attemptId: string): Promise<Eval> {
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId },
    });

    // Create a new evaluation with default values
    const evaluation = this.evalRepo.create({ attempt });
    return this.evalRepo.save(evaluation);
  }

  async calculateScore(attemptId: string): Promise<Eval> {
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId },
      relations: [
        'form',
        'form.questions',
        'form.questions.key',
        'answers',
        'answers.option',
        'answers.question',
      ],
    });

    const questions = await this.questionService.findAllQuestionAndKey(
      attempt.form.id,
    );

    const answerKeys = questions?.map((v) => ({
      optionId: v?.key?.option?.id,
      questionId: v?.id,
    }));

    const answers = attempt.answers?.map((v) => ({
      optionId: v?.option?.id,
      questionId: v?.question?.id,
    }));

    // Calculate the scorejjjjj
    let correctAnswerNum = 0;

    for (const key of answerKeys) {
      const answer = answers.find((v) => v.questionId === key.questionId);
      if (answer && answer.optionId === key.optionId) {
        correctAnswerNum++;
      }
    }

    // Find the existing evaluation by attemptId
    const evaluation = await this.evalRepo.findOne({
      where: { attempt: { id: attemptId } },
    });

    if (!evaluation) {
      throw new Error('Evaluation not found');
    }

    // Update the evaluation with correct answers and total questions
    evaluation.correctAnswerNum = correctAnswerNum;
    evaluation.questionNum = questions.length;

    return this.evalRepo.save(evaluation);
  }
}
