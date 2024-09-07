import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    private readonly formService: FormService,
    private readonly storageService: StorageService,
    private readonly optionService: OptionService,
    private readonly keyService: KeyService,
  ) {}

  async create(
    formId: string,
    dto: CreateQuestionDto,
    audioFile?: Express.Multer.File,
  ): Promise<Question> {
    const form = await this.formService.findOneForm(formId);
    if (!form) throw new NotFoundException(`Form with id ${formId} not found`);

    const audio = await this.uploadAudioFile(audioFile);

    const question = this.questionRepo.create({
      ...dto,
      audio,
      form,
      reference: { id: dto.referenceId },
    });

    return this.questionRepo.save(question);
  }

  async createQuestionFull(
    formId: string,
    dto: CreateQuestionFullDto,
    audioFile?: Express.Multer.File,
  ) {
    const { options, key, explanation, ...questionData } = dto;

    // Create question
    const question = await this.create(formId, questionData, audioFile);

    // Create options
    const createdOptions = await this.optionService.createBulk(
      question.id,
      options,
    );

    // Create answer key
    const createdKey = await this.keyService.create(question.id, {
      optionId: createdOptions[key].id,
      explanation,
    });

    return {
      question,
      options: createdOptions,
      key: createdKey,
    };
  }

  async findAll(formId?: string): Promise<Question[]> {
    return this.questionRepo.find({
      where: { deletedAt: null, form: { id: formId } },
      relations: ['audio', 'reference', 'options'],
    });
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: ['audio', 'options', 'reference'],
    });
    if (!question)
      throw new NotFoundException(`Question with id ${id} not found`);
    return question;
  }

  async findOneWithAnswerKey(id: string): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: ['keys', 'options'],
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

    // Update options
    const updatedOptions = await this.optionService.updateBulk(options);

    // Update answer key
    const updatedKey = await this.keyService.update(questionId, {
      optionId: key,
      explanation,
    });

    return {
      question: updatedQuestion,
      options: updatedOptions,
      key: updatedKey,
    };
  }

  async remove(id: string): Promise<void> {
    const question = await this.findOne(id);
    await this.questionRepo.remove(question);
  }

  private async uploadAudioFile(
    file?: Express.Multer.File,
  ): Promise<FileEntity | undefined> {
    return file ? this.storageService.uploadFile(file) : undefined;
  }
}
