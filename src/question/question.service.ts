import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormService } from '@/form/form.service';
import { FileEntity } from '@/storage/entity/file.entity';
import { StorageService } from '@/storage/storage.service';

import { Question } from '../question/entity/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    private readonly formService: FormService,
    private readonly storageService: StorageService,
  ) {}

  async create(
    formId: string,
    createQuestionDto: CreateQuestionDto,
    audioFile?: Express.Multer.File,
  ): Promise<Question> {
    const form = await this.formService.findOneForm(formId);
    if (!form) throw new NotFoundException(`Form with id ${formId} not found`);

    const audio = await this.uploadAudioFile(audioFile);

    const question = this.questionRepo.create({
      ...createQuestionDto,
      audio,
      form,
      reference: { id: createQuestionDto.referenceId },
    });
    return this.questionRepo.save(question);
  }

  async findAll(formId?: string): Promise<Question[]> {
    return this.questionRepo.find({
      where: { deletedAt: null, form: { id: formId } },
      relations: ['audio'],
    });
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: ['audio'],
    });
    if (!question)
      throw new NotFoundException(`Question with id ${id} not found`);
    return question;
  }

  async update(
    questionId: string,
    updateQuestionDto: UpdateQuestionDto,
    audioFile?: Express.Multer.File,
  ): Promise<Question> {
    const question = await this.findOne(questionId);

    question.audio = audioFile
      ? await this.uploadAudioFile(audioFile)
      : question.audio;

    Object.assign(question, {
      ...updateQuestionDto,
      reference: { id: updateQuestionDto.referenceId },
    });
    return this.questionRepo.save(question);
  }

  async remove(id: string): Promise<void> {
    const question = await this.findOne(id);
    await this.questionRepo.remove(question);
  }

  private async uploadAudioFile(
    file?: Express.Multer.File,
  ): Promise<FileEntity | undefined> {
    return file ? await this.storageService.uploadFile(file) : undefined;
  }
}
