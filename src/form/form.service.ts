import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Part } from '@/part/entity/part.entity';
import { StorageService } from '@/storage/storage.service';

import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './entity/form.entity';
// import { FormVersion } from './entity/form-version.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepo: Repository<Form>,
    @InjectRepository(Part)
    private readonly partRepo: Repository<Part>,
    private readonly storageService: StorageService,
  ) {}

  async findOneForm(formId?: string): Promise<Form> {
    const form = await this.formRepo.findOne({
      where: { id: formId },
      relations: ['instructionAudio', 'closingAudio'],
    });
    if (!form) throw new NotFoundException(`Form with id ${formId} not found`);
    return form;
  }

  async findOneFormFull(formId?: string): Promise<
    Omit<Form, 'setId'> & {
      partLength: number;
      questionLength: number;
      questionLengthPerPart: number[];
    }
  > {
    const form = await this.formRepo.findOne({
      where: { id: formId },
      relations: [
        'instructionAudio',
        'closingAudio',
        'parts',
        'parts.questions',
        'parts.instructionAudio',
        'parts.closingAudio',
        'questions',
        'questions.reference',
        'questions.part',
        'questions.options',
      ],
    });
    if (!form) throw new NotFoundException(`Form with id ${formId} not found`);
    const partLength = form.parts?.length ?? 0;
    const questionLength = form.questions?.length ?? 0;

    const parts = await this.partRepo.find({
      where: { form: {id: formId} },
      relations: ['questions'],
      order: { order: 'ASC' },
    });
    const questionLengthPerPart = parts.map(
      ({ questions }) => questions?.length ?? 0,
    );

    return { ...form, partLength, questionLength, questionLengthPerPart };
  }

  async createForm(data: CreateFormDto): Promise<Form> {
    const form = await this.formRepo.save(this.formRepo.create(data));
    // await this.formVersionRepo.save(this.formVersionRepo.create({ form }));
    return form;
  }

  async updateForm(
    formId: string,
    data: Partial<UpdateFormDto>,
    instructionAudioFile?: Express.Multer.File,
    closingAudioFile?: Express.Multer.File,
  ): Promise<Form> {
    const form = await this.findOneForm(formId);

    if (!form) {
      throw new NotFoundException(`Form with id ${formId} not found`);
    }

    if (instructionAudioFile) {
      const instructionAudioUrl =
        await this.storageService.uploadFile(instructionAudioFile);
      form.instructionAudio = instructionAudioUrl;
    }

    if (closingAudioFile) {
      const closingAudioUrl =
        await this.storageService.uploadFile(closingAudioFile);
      form.closingAudio = closingAudioUrl;
    }

    Object.assign(form, data);
    return this.formRepo.save(form);
  }
}
