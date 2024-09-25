import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attempt } from '@/attempt/entity/attempt.entity';
import { OptionService } from '@/option/option.service';
import { QuestionService } from '@/question/question.service';

import { Answer } from './entity/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Attempt)
    private readonly attemptRepo: Repository<Attempt>,
    private readonly questionService: QuestionService,
    private readonly optionService: OptionService,
  ) {}

  // Update multiple answers in bulk
  async updateAnswerBulk(
    attemptId: string,
    answers: { optionId?: string; questionId: string }[],
  ) {
    const updatedAnswers = [];

    for (const { optionId, questionId } of answers) {
      const updatedAnswer = await this.updateAnswer(
        attemptId,
        optionId,
        questionId,
      );
      updatedAnswers.push(updatedAnswer);
    }

    return updatedAnswers;
  }

  // Create an answer for a specific question in an attempt
  async createAnswer(attemptId: string, questionId: string): Promise<Answer> {
    // Check if an answer already exists for this question and attempt
    const oldAnswer = await this.answerRepo.findOne({
      where: { question: { id: questionId }, attempt: { id: attemptId } },
    });

    if (oldAnswer) {
      throw new BadRequestException(
        `Answer with questionId ${questionId} and attemptId ${attemptId} has already been created`,
      );
    }

    // Fetch the associated attempt
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId },
    });

    if (!attempt) throw new NotFoundException(`Attempt ${attemptId} not found`);

    // Fetch the question details
    const question = await this.questionService.findOneQuestion(questionId);

    // Create a new answer entity
    const answer = this.answerRepo.create({ attempt, question });

    const saved = await this.answerRepo.save(answer);
    return saved;
  }

  // Update an existing answer or create it if it doesn't exist
  async updateAnswer(
    attemptId: string,
    optionId: string,
    questionId: string,
  ): Promise<Answer> {
    // Fetch the attempt based on ID
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId },
    });

    if (!attempt) throw new NotFoundException(`Attempt ${attemptId} not found`);

    // Fetch the question based on ID
    const question = await this.questionService.findOneQuestion(questionId);
    if (!question)
      throw new NotFoundException(`Question with id ${questionId} not found`);

    // Check if the answer already exists
    let answer: Answer = await this.answerRepo.findOne({
      where: { question: { id: questionId }, attempt: { id: attemptId } },
      relations: ['attempt'],
    });

    // If no existing answer, create a new one
    if (!answer) {
      answer = await this.createAnswer(attemptId, questionId);
      const newAnswer = await this.answerRepo.findOne({
        where: { id: answer.id },
        relations: ['attempt'],
      });

      // Fetch the selected option
      const option = await this.optionService.findOneOption(optionId);

      // Update the answer with the new option
      newAnswer.option = option;
      return await this.answerRepo.save(newAnswer);
    }

    // Fetch the selected option
    const option = await this.optionService.findOneOption(optionId);

    // Update the answer with the new option
    answer.option = option;

    // Save the updated answer
    return await this.answerRepo.save(answer);
 
  }
}
