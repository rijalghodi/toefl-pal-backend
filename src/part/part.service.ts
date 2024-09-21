import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormService } from '@/form/form.service';
import { FileEntity } from '@/storage/entity/file.entity';
import { StorageService } from '@/storage/storage.service';

import { Part } from '../part/entity/part.entity';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';

@Injectable()
export class PartService {
  constructor(
    @InjectRepository(Part)
    private readonly partRepo: Repository<Part>,
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

    // Get the highest order for the given formId
    const highestOrder = await this.partRepo
      .createQueryBuilder('part')
      .where('part.form_id = :formId', { formId })
      .select('MAX(part.order)', 'maxOrder')
      .getRawOne();

    // Set the new part's order to the next number
    const nextOrder = (highestOrder?.maxOrder ?? 0) + 1;

    const instructionAudio = await this.uploadAudioFile(instructionAudioFile);
    const closingAudio = await this.uploadAudioFile(closingAudioFile);

    const part = this.partRepo.create({
      ...createPartDto,
      instructionAudio,
      closingAudio,
      form: { id: formId },
      order: nextOrder,
    });
    return this.partRepo.save(part);
  }

  // async create(
  //   formId: string,
  //   createPartDto: CreatePartDto,
  //   instructionAudioFile?: Express.Multer.File,
  //   closingAudioFile?: Express.Multer.File,
  // ): Promise<Part> {
  //   const form = await this.formService.findOneForm(formId);
  //   if (!form) throw new NotFoundException(`Form with id ${formId} not found`);

  //   const instructionAudio = await this.uploadAudioFile(instructionAudioFile);
  //   const closingAudio = await this.uploadAudioFile(closingAudioFile);

  //   const part = this.partRepo.create({
  //     ...createPartDto,
  //     instructionAudio,
  //     closingAudio,
  //     form,
  //   });
  //   return this.partRepo.save(part);
  // }

  async findAll(formId?: string): Promise<Part[]> {
    return this.partRepo.find({
      where: { deletedAt: null, form: { id: formId } },
      order: { order: 'ASC' }, 
      relations: ['closingAudio', 'instructionAudio'],
    });
  }

  async findOne(id: string): Promise<Part> {
    const part = await this.partRepo.findOne({
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
    return this.partRepo.save(part);
  }

  async updateOrders(
    formId: string,
    orderUpdates: { id: string; order: number }[],
  ): Promise<void> {
    // -- Fetch the existing parts for the given formId
    const parts = await this.partRepo.find({
      where: { form: { id: formId } },
      order: { order: 'ASC' },
    });

    const totalParts = parts.length; // Get total number of parts

    // -- Validate the `order` values
    const updatedOrders = orderUpdates.map((update) => update.order);

    // ---- Ensure all order values are unique and within the range [1, totalParts]
    const uniqueOrders = new Set(updatedOrders);
    const validOrderRange = [...Array(totalParts).keys()].map((i) => i + 1); // [1, 2, ..., totalParts]

    // ---- Check for missing or duplicate orders
    if (
      uniqueOrders.size !== totalParts || // Check for duplicate orders
      !validOrderRange.every((num) => uniqueOrders.has(num)) // Check for missing orders
    ) {
      throw new Error(
        `Invalid order updates: Orders must be unique and between 1 and ${totalParts}`,
      );
    }

    // Step 3: Create the update query
    const query = this.partRepo.createQueryBuilder();
    const updateCases = orderUpdates
      .map(({ id, order }) => `WHEN id = '${id}' THEN ${order}`)
      .join(' ');

    // Step 4: Build and execute the SQL query to update the order
    await query
      .update(Part)
      .set({
        order: () => `CASE ${updateCases} ELSE "order" END`, // Construct the CASE statement
      })
      .where('id IN (:...ids)', { ids: orderUpdates.map(({ id }) => id) })
      .execute();
  }

  async remove(id: string): Promise<void> {
    const part = await this.findOne(id);
    await this.partRepo.remove(part);
  }

  private async uploadAudioFile(
    file?: Express.Multer.File,
  ): Promise<FileEntity | undefined> {
    return file ? await this.storageService.uploadFile(file) : undefined;
  }
}
