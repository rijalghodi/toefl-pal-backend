import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AttemptService } from '@/attempt/attempt.service';
import { Option } from '@/option/entity/option.entity';
import { OptionService } from '@/option/option.service';
import { QuestionService } from '@/question/question.service';

import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answer } from './entity/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,

    // @InjectRepository(Question)
    // private readonly questionRepo: Repository<Question>,

    @Inject(forwardRef(() => AttemptService))
    private readonly attemptService: AttemptService,
    private readonly questionService: QuestionService,
    private readonly optionService: OptionService,
  ) {}

  async create(attemptId: string, data: CreateAnswerDto) {
    const attempt = await this.attemptService.findOne(attemptId);

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    const answer = this.answerRepo.create({ ...data, attempt: attempt });
    return this.answerRepo.save(answer);
  }

  async createDefaultAnswersForAttempt(attemptId: string): Promise<Answer[]> {
    const attempt = await this.attemptService.findOne(attemptId);

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    const questions = await this.questionService.findAll(attempt.form.id);

    if (!questions || questions.length === 0)
      throw new NotFoundException(`Questions not found`);

    const answers = await this.answerRepo.insert(
      questions.map((question) => ({
        attempt,
        marked: false,
        question: { id: question.id },
      })),
    );

    return answers.raw;
  }

  async findAll(attemptId: string): Promise<Answer[]> {
    return this.answerRepo.find({
      where: { attempt: { id: attemptId } },
      relations: ['option', 'question'],
    });
  }

  async findOne(id: string): Promise<Answer> {
    const answer = await this.answerRepo.findOne({
      where: { id },
      relations: ['option', 'question'],
    });
    if (!answer) throw new NotFoundException(`Answer with id ${id} not found`);
    return answer;
  }

  async update(
    answerId: string,
    { optionId, ...data }: UpdateAnswerDto,
  ): Promise<Answer> {
    const answer = await this.findOne(answerId);

    if (!answer)
      throw new NotFoundException(`Answer with id ${answerId} not found`);

    const possibleOptions = await this.optionService.findAll(
      answer.question.id,
    );

    if (optionId) {
      const option = await this.optionService.findOne(optionId);

      if (!option)
        throw new NotFoundException(`Option with id ${optionId} not found`);

      if (!possibleOptions.some((v: Option) => v.id === option.id))
        throw new NotFoundException(`No option in question match your option`);

      Object.assign(answer, {
        option: {
          id: optionId,
        },
      });
    }

    Object.assign(answer, data);
    return this.answerRepo.save(answer);
  }

  async remove(id: string): Promise<void> {
    const answer = await this.findOne(id);
    await this.answerRepo.remove(answer);
  }
}
