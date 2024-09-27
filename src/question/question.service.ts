import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormService } from '@/form/form.service';
import { KeyService } from '@/key/key.service';
import { OptionService } from '@/option/option.service';
import { PartService } from '@/part/part.service';
import { FileEntity } from '@/storage/entity/file.entity';
import { StorageService } from '@/storage/storage.service';

import { Question } from '../question/entity/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateQuestionFullDto } from './dto/update-question-full.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    private readonly formService: FormService,
    private readonly partService: PartService,
    private readonly storageService: StorageService,
    @Inject(forwardRef(() => OptionService))
    private readonly optionService: OptionService,
    @Inject(forwardRef(() => KeyService))
    private readonly keyService: KeyService,
  ) {}

  async create(
    formId: string,
    partId: string,
    dto: CreateQuestionDto,
    audioFile?: Express.Multer.File,
  ): Promise<Question> {
    const [form, part, audio] = await Promise.all([
      this.formService.findOneForm(formId),
      this.partService.findOne(partId),
      this.uploadAudioFile(audioFile),
    ]);

    const highestOrder = await this.getHighestOrder(formId, partId);

    const question = this.questionRepo.create({
      ...dto,
      audio,
      form,
      part,
      reference: { id: dto.referenceId },
      order: (highestOrder?.maxOrder ?? 0) + 1,
    });

    return this.questionRepo.save(question);
  }

  async createQuestionAndDefault(
    formId: string,
    partId: string,
    dto: CreateQuestionDto,
    audioFile?: Express.Multer.File,
  ): Promise<Question> {
    const question = await this.create(formId, partId, dto, audioFile);
    await Promise.all([
      this.optionService.create(question.id, { text: '' }),
      this.keyService.create(question.id, {
        optionId: undefined,
        explanation: '',
      }),
    ]);
    return question;
  }

  async findAllQuestion(formId: string): Promise<Question[]> {
    return this.findQuestions(formId, false);
  }

  async findAllQuestionAndKey(formId: string): Promise<Question[]> {
    return this.findQuestions(formId, true);
  }

  async findAllQuestionAndKeyInPart(
    formId: string,
    partId: string,
  ): Promise<Question[]> {
    return this.findQuestionsInPart(formId, partId, true);
  }

  async findAllQuestionInPart(
    formId: string,
    partId: string,
  ): Promise<Question[]> {
    return this.findQuestionsInPart(formId, partId, false);
  }

  async findOneQuestion(questionId: string): Promise<Question> {
    const question = await this.getQuestionWithOptions(questionId);
    if (!question) {
      throw new NotFoundException(`Question with id ${questionId} not found`);
    }
    return question;
  }

  async findOneWithAnswerKey(questionId: string): Promise<Question> {
    const question = await this.getQuestionWithOptions(questionId, true);
    if (!question) {
      throw new NotFoundException(`Question with id ${questionId} not found`);
    }
    return question;
  }

  async update(
    questionId: string,
    dto: UpdateQuestionDto,
    audioFile?: Express.Multer.File,
  ): Promise<Question> {
    const question = await this.findOneQuestion(questionId);
    if (audioFile) {
      question.audio = await this.uploadAudioFile(audioFile);
    }

    Object.assign(question, { ...dto, reference: { id: dto.referenceId } });
    return this.questionRepo.save(question);
  }

  async updateFull(
    questionId: string,
    dto: UpdateQuestionFullDto,
    audioFile?: Express.Multer.File,
  ): Promise<Question> {
    const questionData = { ...dto };
    return this.update(questionId, questionData, audioFile);
  }

  async remove(questionId: string): Promise<void> {
    const question = await this.questionRepo.findOne({
      where: { id: questionId },
      relations: ['form', 'part'],
    });
    if (!question) {
      throw new NotFoundException(`Question with id ${questionId} not found`);
    }

    await this.questionRepo.delete(questionId);
    await this.updateQuestionOrderAfterRemoval(question);
  }

  private async uploadAudioFile(
    file?: Express.Multer.File,
  ): Promise<FileEntity | undefined> {
    return file ? this.storageService.uploadFile(file) : undefined;
  }

  private async getHighestOrder(formId: string, partId: string) {
    return this.questionRepo
      .createQueryBuilder('question')
      .where('question.form_id = :formId', { formId })
      .andWhere('question.part_id = :partId', { partId })
      .select('MAX(question.order)', 'maxOrder')
      .getRawOne();
  }

  private async findQuestions(
    formId: string,
    withKey: boolean,
  ): Promise<Question[]> {
    const relations = withKey
      ? ['audio', 'reference', 'options', 'part', 'key', 'key.option']
      : ['audio', 'reference', 'options', 'part'];
    return this.questionRepo.find({
      where: { form: { id: formId } },
      relations,
      order: {
        part: { order: 'ASC' },
        order: 'ASC',
        options: { order: 'ASC' },
      },
    });
  }

  private async findQuestionsInPart(
    formId: string,
    partId: string,
    withKey: boolean,
  ): Promise<Question[]> {
    const relations = withKey
      ? ['audio', 'reference', 'options', 'key', 'key.option']
      : ['audio', 'reference', 'options'];
    return this.questionRepo.find({
      where: { form: { id: formId }, part: { id: partId } },
      relations,
      order: {
        part: { order: 'ASC' },
        order: 'ASC',
        options: { order: 'ASC' },
      },
    });
  }

  private async getQuestionWithOptions(
    questionId: string,
    withKey: boolean = false,
  ): Promise<Question> {
    const relations = withKey
      ? ['key', 'key.option', 'audio', 'reference']
      : ['audio', 'reference'];
    const question = await this.questionRepo.findOne({
      where: { id: questionId },
      relations,
    });

    const options = await this.optionService.findAllOption(questionId);
    return { ...question, options };
  }

  private async updateQuestionOrderAfterRemoval(
    question: Question,
  ): Promise<void> {
    // Step 1: Temporarily set orders >= dto.order to their current value + 1000
    await this.questionRepo
      .createQueryBuilder()
      .update(Question)
      .set({ order: () => `order + 1000` }) // Increment the order by 1000
      .where('form_id = :formId', { formId: question.form.id })
      .andWhere('part_id = :partId', { partId: question.part.id })
      .andWhere('order >= :newOrder', { newOrder: question.order })
      .execute();

    // Step 2: Update the parts to reflect the new order
    await this.questionRepo
      .createQueryBuilder()
      .update(Question)
      .set({ order: () => `order - 1001` }) // Decrement back to the original range -1
      .where('form_id = :formId', { formId: question.form.id })
      .andWhere('order >= :newOrder', { newOrder: question.order + 1000 }) // Only update those that were incremented
      .execute();
  }
}
