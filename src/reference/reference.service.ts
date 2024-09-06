import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FileEntity } from '@/storage/entity/file.entity';
import { StorageService } from '@/storage/storage.service';

import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { Reference } from './entity/reference.entity';

@Injectable()
export class ReferenceService {
  constructor(
    @InjectRepository(Reference)
    private readonly referenceRepo: Repository<Reference>,
    private readonly storageService: StorageService,
  ) {}

  async create(
    createReferenceDto: CreateReferenceDto,
    audioFile?: Express.Multer.File,
  ): Promise<Reference> {
    const audio = await this.uploadAudioFile(audioFile);

    const reference = this.referenceRepo.create({
      ...createReferenceDto,
      audio,
    });
    return this.referenceRepo.save(reference);
  }

  async findAll(): Promise<Reference[]> {
    return this.referenceRepo.find({
      relations: ['audio'],
      where: { deletedAt: null },
    });
  }

  async findOne(id: string): Promise<Reference> {
    const reference = await this.referenceRepo.findOne({
      where: { id },
      relations: ['audio'],
    });
    if (!reference)
      throw new NotFoundException(`Reference with id ${id} not found`);
    return reference;
  }

  async update(
    referenceId: string,
    updateReferenceDto: UpdateReferenceDto,
    audioFile?: Express.Multer.File,
  ): Promise<Reference> {
    const reference = await this.findOne(referenceId);

    if (!reference) {
      throw new NotFoundException('reference not found');
    }

    reference.audio = audioFile
      ? await this.uploadAudioFile(audioFile)
      : reference.audio;

    Object.assign(reference, updateReferenceDto);
    return this.referenceRepo.save(reference);
  }

  async remove(id: string): Promise<void> {
    const reference = await this.findOne(id);
    await this.referenceRepo.softRemove(reference);
  }

  private async uploadAudioFile(
    file?: Express.Multer.File,
  ): Promise<FileEntity | undefined> {
    return file ? await this.storageService.uploadFile(file) : undefined;
  }
}
