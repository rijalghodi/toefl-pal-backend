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
    dto: CreatePartDto,
    instructionAudioFile?: Express.Multer.File,
    closingAudioFile?: Express.Multer.File,
  ): Promise<Part> {
    // Fetch the form to ensure it exists
    const form = await this.formService.findOneForm(formId);
    if (!form) throw new NotFoundException(`Form with id ${formId} not found`);

    // Get the highest current order for the given formId
    const highestOrder = await this.partRepo
      .createQueryBuilder('part')
      .where('part.form_id = :formId', { formId })
      .select('MAX(part.order)', 'maxOrder')
      .getRawOne();

    // Determine the next order value (incremented from the highest current order)
    const nextOrder = (highestOrder?.maxOrder ?? 0) + 1;

    // Validate that the new part's order is within the valid range
    if (dto.order > nextOrder) {
      throw new Error(`New order must not be greater than ${nextOrder}`);
    }
    // If dto.order is less than the next order, proceed with the reordering
    if (dto.order < nextOrder) {
      // Step 1: Temporarily set orders >= dto.order to their current value + 1000
      await this.partRepo
        .createQueryBuilder()
        .update(Part)
        .set({ order: () => `order + 1000` }) // Increment the order by 1000
        .where('form_id = :formId', { formId })
        .andWhere('order >= :newOrder', { newOrder: dto.order })
        .execute();

      // Step 2: Update the parts to reflect the new order
      await this.partRepo
        .createQueryBuilder()
        .update(Part)
        .set({ order: () => `order - 999` }) // Decrement back to the original range
        .where('form_id = :formId', { formId })
        .andWhere('order >= :newOrder', { newOrder: dto.order + 1000 }) // Only update those that were incremented
        .execute();
    }

    // Upload instruction and closing audio files if provided
    const instructionAudio = instructionAudioFile
      ? await this.uploadAudioFile(instructionAudioFile)
      : undefined;
    const closingAudio = closingAudioFile
      ? await this.uploadAudioFile(closingAudioFile)
      : undefined;

    // Create the new part with the specified or adjusted order
    const part = this.partRepo.create({
      ...dto,
      instructionAudio,
      closingAudio,
      form: { id: formId },
      order: dto.order || nextOrder, // Use provided order or default to the next available one
    });

    // Save the new part and return it
    return this.partRepo.save(part);
  }

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

  async remove(formId: string, partId: string): Promise<void> {
    const part = await this.findOne(partId);

    await this.partRepo.remove(part);

    // Step 1: Temporarily set orders >= dto.order to their current value + 1000
    await this.partRepo
      .createQueryBuilder()
      .update(Part)
      .set({ order: () => `order + 1000` }) // Increment the order by 1000
      .where('form_id = :formId', { formId })
      .andWhere('order >= :newOrder', { newOrder: part.order })
      .execute();

    // Step 2: Update the parts to reflect the new order
    await this.partRepo
      .createQueryBuilder()
      .update(Part)
      .set({ order: () => `order - 1001` }) // Decrement back to the original range -1
      .where('form_id = :formId', { formId })
      .andWhere('order >= :newOrder', { newOrder: part.order + 1000 }) // Only update those that were incremented
      .execute();
  }

  async updateOrders(
    formId: string,
    orderUpdates: { id: string; order: number }[],
  ): Promise<void> {
    // Fetch the existing parts for the given formId
    const parts = await this.partRepo.find({
      where: { form: { id: formId } },
      order: { order: 'ASC' },
    });

    const totalParts = parts.length; // Get total number of parts

    // Validate the `order` values
    const updatedOrders = orderUpdates.map((update) => update.order);

    // Ensure all order values are unique and within the range [1, totalParts]
    const uniqueOrders = new Set(updatedOrders);
    const validOrderRange = [...Array(totalParts).keys()].map((i) => i + 1); // [1, 2, ..., totalParts]

    // Check for missing or duplicate orders
    if (
      uniqueOrders.size !== totalParts || // Check for duplicate orders
      !validOrderRange.every((num) => uniqueOrders.has(num)) // Check for missing orders
    ) {
      throw new Error(
        `Invalid order updates: Orders must be unique and between 1 and ${totalParts}`,
      );
    }

    // Step 1: Increment all current orders by 1000
    await this.partRepo
      .createQueryBuilder()
      .update(Part)
      .set({ order: () => `order + 1000` })
      .where('form_id = :formId', { formId })
      .execute();

    // Step 2: Create the update query
    const query = this.partRepo.createQueryBuilder();
    const updateCases = orderUpdates
      .map(({ id, order }) => `WHEN id = '${id}' THEN ${order + 1000}`) // Set new order with +1000
      .join(' ');

    // Step 3: Build and execute the SQL query to update the order
    await query
      .update(Part)
      .set({
        order: () => `CASE ${updateCases} ELSE "order" END`, // Construct the CASE statement
      })
      .where('id IN (:...ids)', { ids: orderUpdates.map(({ id }) => id) })
      .execute();
  }

  private async uploadAudioFile(
    file?: Express.Multer.File,
  ): Promise<FileEntity | undefined> {
    return file ? await this.storageService.uploadFile(file) : undefined;
  }
}
