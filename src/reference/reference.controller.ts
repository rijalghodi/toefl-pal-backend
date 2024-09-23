import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { FilterQueryDto } from '@/common/dto/filter-query.dto';
import { ResponseDto } from '@/common/dto/response.dto';

import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { ReferenceService } from './reference.service';

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
@Controller('reference')
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Post()
  async create(
    @Body() createReferenceDto: CreateReferenceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { audio } = this.extractAudioFiles(files);
    const reference = await this.referenceService.create(
      createReferenceDto,
      audio,
    );
    return new ResponseDto('success', reference);
  }

  @Get()
  async findAll(@Query() filter: FilterQueryDto) {
    const references = await this.referenceService.findAll(filter);
    return new ResponseDto('success', references.data, references.pagination);
  }

  @Get(':referenceId')
  async findOne(@Param('referenceId') referenceId: string) {
    const reference = await this.referenceService.findOne(referenceId);
    return new ResponseDto('success', reference);
  }

  @Patch(':referenceId')
  async update(
    @Param('referenceId') referenceId: string,
    @Body() updateReferenceDto: UpdateReferenceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { audio } = this.extractAudioFiles(files);
    const reference = await this.referenceService.update(
      referenceId,
      updateReferenceDto,
      audio,
    );
    return new ResponseDto('success', reference);
  }

  @Delete(':referenceId')
  async remove(@Param('referenceId') id: string) {
    await this.referenceService.remove(id);
    return new ResponseDto('success', null);
  }

  private extractAudioFiles(files: Express.Multer.File[]) {
    const audio = files.find((file) => file.fieldname === 'audio');
    return { audio };
  }
}
