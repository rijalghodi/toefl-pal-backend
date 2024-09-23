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
import { FileEntity } from '@/storage/entity/file.entity';
import { StorageService } from '@/storage/storage.service';

import { Question } from '../question/entity/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateQuestionFullDto } from './dto/create-question-full.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateQuestionFullDto } from './dto/update-question-full.dto';
import { PartService } from '@/part/part.service';

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
    const form = await this.formService.findOneForm(formId);
    const part = await this.partService.findOne(partId);
    const audio = await this.uploadAudioFile(audioFile);

    // Order
    // Get the highest current order for the given formId
    const highestOrder = await this.questionRepo
      .createQueryBuilder('question')
      .where('question.form_id = :formId', { formId })
      .where('question.part_id = :partId', { partId })
      .select('MAX(question.order)', 'maxOrder')
      .getRawOne();

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
    // Create question
    const question = await this.create(formId, partId, dto, audioFile);

    // Create default option
    await this.optionService.create(question.id, {
      text: '',
    });

    // Create default answer key
    await this.keyService.create(question.id, {
      optionId: undefined,
      explanation: '',
    });

    return question;
  }

  async findAll(formId: string): Promise<Question[]> {
    return this.questionRepo.find({
      where: { form: { id: formId } },
      relations: ['audio', 'reference', 'options'],
      order: { order: 'ASC' },
    });
  }
  async findAllInPart(formId: string, partId: string): Promise<Question[]> {
    return this.questionRepo.find({
      where: { form: { id: formId }, part: { id: partId } },
      relations: ['audio', 'reference', 'options'],
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: ['audio', 'options', 'reference'],
    });
    if (!question)
      throw new NotFoundException(`Question with id ${id} not found 123`);
    return question;
  }

  async findOneWithAnswerKey(id: string): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: ['key', 'audio', 'options', 'reference'],
    });
    if (!question)
      throw new NotFoundException(`Question with id ${id} not found`);
    return question;
  }

  async update(
    questionId: string,
    dto: UpdateQuestionDto,
    audioFile?: Express.Multer.File,
  ): Promise<Question> {
    const question = await this.findOne(questionId);

    if (audioFile) {
      question.audio = await this.uploadAudioFile(audioFile);
    }

    Object.assign(question, {
      ...dto,
      reference: { id: dto.referenceId },
    });

    return this.questionRepo.save(question);
  }

  async updateFull(
    questionId: string,
    dto: UpdateQuestionFullDto,
    audioFile?: Express.Multer.File,
  ) {
    const { options, key, explanation, ...questionData } = dto;

    const updatedQuestion = await this.update(
      questionId,
      questionData,
      audioFile,
    );

    // // Update options
    // const updatedOptions = await this.optionService.updateBulk(options);

    // // Update answer key
    // const updatedKey = await this.keyService.update(questionId, {
    //   optionId: key,
    //   explanation,
    // });

    return updatedQuestion;
    // return {
    //   question: updatedQuestion,
    //   options: updatedOptions,
    //   key: updatedKey,
    // };
  }

  async remove(questionId: string): Promise<void> {
    const question = await this.questionRepo.findOne({
      where: { id: questionId },
      relations: ['form', 'part'],
    });
    if (!question)
      throw new NotFoundException(`Question with id ${questionId} not found`);

    console.log('Sampai sini');
    await this.questionRepo.delete(questionId);

    // Step 1: Temporarily set orders >= dto.order to their current value + 1000
    await this.questionRepo
      .createQueryBuilder()
      .update(Question)
      .set({ order: () => `order + 1000` }) // Increment the order by 1000
      .where('form_id = :formId', { formId: question.form.id })
      .where('part_id = :partId', { partId: question.part.id })
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

  private async uploadAudioFile(
    file?: Express.Multer.File,
  ): Promise<FileEntity | undefined> {
    return file ? this.storageService.uploadFile(file) : undefined;
  }
}
