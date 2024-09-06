import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormService } from '@/form/form.service';
import { FileEntity } from '@/storage/entity/file.entity';
import { StorageService } from '@/storage/storage.service';

import { Part } from '../part/entity/part.entity';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part-dto';

@Injectable()
export class PartService {
  constructor(
    @InjectRepository(Part)
    private readonly partRepository: Repository<Part>,
    private readonly formService: FormService,
    private readonly storageService: StorageService,
  ) {}

  async create(
    formId: string,
    createPartDto: CreatePartDto,
    instructionAudioFile?: Express.Multer.File,
    closingAudioFile?: Express.Multer.File,
  ): Promise<Part> {
    const form = await this.formService.findOneForm(formId);
    if (!form) throw new NotFoundException(`Form with id ${formId} not found`);

    const instructionAudio = await this.uploadAudioFile(instructionAudioFile);
    const closingAudio = await this.uploadAudioFile(closingAudioFile);

    const part = this.partRepository.create({
      ...createPartDto,
      instructionAudio,
      closingAudio,
      form,
    });
    return this.partRepository.save(part);
  }

  async findAll(formId?: string): Promise<Part[]> {
    return this.partRepository.find({
      where: { deletedAt: null, form: { id: formId } },
      relations: ['closingAudio', 'instructionAudio'],
    });
  }

  async findOne(id: string): Promise<Part> {
    const part = await this.partRepository.findOne({
      where: { id },
      relations: ['closingAudio', 'instructionAudio'],
    });
    if (!part) throw new NotFoundException(`Part with id ${id} not found`);
    return part;
  }

  async update(
    partId: string,
    updatePartDto: UpdatePartDto,
    instructionAudioFile?: Express.Multer.File,
    closingAudioFile?: Express.Multer.File,
  ): Promise<Part> {
    const part = await this.findOne(partId);

    part.instructionAudio = instructionAudioFile
      ? await this.uploadAudioFile(instructionAudioFile)
      : part.instructionAudio;

    part.closingAudio = closingAudioFile
      ? await this.uploadAudioFile(closingAudioFile)
      : part.closingAudio;

    Object.assign(part, updatePartDto);
    return this.partRepository.save(part);
  }

  async remove(id: string): Promise<void> {
    const part = await this.findOne(id);
    await this.partRepository.remove(part);
  }

  private async uploadAudioFile(
    file?: Express.Multer.File,
  ): Promise<FileEntity | undefined> {
    return file ? await this.storageService.uploadFile(file) : undefined;
  }
}
