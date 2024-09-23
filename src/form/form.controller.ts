// auth.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { ResponseDto } from '@/common/dto/response.dto';
import { UpdateFormDto } from '@/form/dto/update-form.dto';
import { FormService } from '@/form/form.service';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get(':formId')
  async findOne(@Param('formId') formId: string) {
    const form = await this.formService.findOneForm(formId);
    return new ResponseDto('success get one form', form);
  }

  @Get(':formId/full')
  async findOneFull(@Param('formId') formId: string) {
    const form = await this.formService.findOneFormFull(formId);
    return new ResponseDto('success get one form', form);
  }

  @Patch(':formId')
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
  async updateForm(
    @Param('formId') formId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateFormDto: UpdateFormDto,
  ) {
    const instructionAudio = files.find(
      (file) => file.fieldname === 'instructionAudio',
    );
    const closingAudio = files.find(
      (file) => file.fieldname === 'closingAudio',
    );

    return this.formService.updateForm(
      formId,
      updateFormDto,
      instructionAudio,
      closingAudio,
    );
  }
}
