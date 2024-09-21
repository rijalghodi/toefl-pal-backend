import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { ResponseDto } from '@/common/dto/response.dto';

import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { UpdatePartOrdersDto } from './dto/update-part-orders.dto';
import { PartService } from './part.service';

@UseInterceptors(
  AnyFilesInterceptor({
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.startsWith('audio/')) {
        return callback(
          new BadRequestException('Only audio files are allowed'),
          false,
        );
      }
      callback(null, true);
    },
  }),
)
@Controller('form/:formId/part')
export class PartController {
  constructor(private readonly partService: PartService) {}

  @Post()
  async create(
    @Param('formId') formId: string,
    @Body() createPartDto: CreatePartDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { instructionAudio, closingAudio } = this.extractAudioFiles(files);
    const part = await this.partService.create(
      formId,
      createPartDto,
      instructionAudio,
      closingAudio,
    );
    return new ResponseDto('success', part);
  }

  @Get()
  async findAll(@Param('formId') formId: string) {
    const parts = await this.partService.findAll(formId);
    return new ResponseDto('success', parts);
  }

  @Get(':partId')
  async findOne(@Param('partId') partId: string) {
    const part = await this.partService.findOne(partId);
    return new ResponseDto('success', part);
  }

  @Patch(':partId')
  async update(
    @Param('partId') partId: string,
    @Body() updatePartDto: UpdatePartDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { instructionAudio, closingAudio } = this.extractAudioFiles(files);
    const part = await this.partService.update(
      partId,
      updatePartDto,
      instructionAudio,
      closingAudio,
    );
    return new ResponseDto('success', part);
  }

  @Delete(':partId')
  async remove(@Param('partId') id: string) {
    await this.partService.remove(id);
    return new ResponseDto('success', null);
  }

  @Put(':formId/order')
  async updatePartOrders(
    @Param('formId') formId: string,
    // must attach all ids and order
    @Body() dto: UpdatePartOrdersDto,
  ) {
    const part = await this.partService.updateOrders(formId, dto.orders);
    return new ResponseDto('success', part);
  }

  private extractAudioFiles(files: Express.Multer.File[]) {
    const instructionAudio = files.find(
      (file) => file.fieldname === 'instructionAudio',
    );
    const closingAudio = files.find(
      (file) => file.fieldname === 'closingAudio',
    );
    return { instructionAudio, closingAudio };
  }
}
