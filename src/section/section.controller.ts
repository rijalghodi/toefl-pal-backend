// auth.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { ResponseDto } from '@/common/dto/response.dto';
import { Role } from '@/common/guard/role.enum';
import { Roles } from '@/common/guard/roles.decorator';
import { UpdateFormDto } from '@/form/dto/update-form.dto';
import { FormService } from '@/form/form.service';
import { ToeflVersionService } from '@/toefl/toefl-version.service';

@Controller('toefl/:toeflId/section')
export class SectionController {
  constructor(
    // private readonly sectionService: SectionService,
    private readonly toeflVersionService: ToeflVersionService,
    private readonly formService: FormService,
  ) {}

  @Get('/version/latest')
  @Roles(Role.SuperAdmin)
  async findLatestSection(@Param('toeflId') toeflId: string) {
    const section =
      await this.toeflVersionService.findLatestToeflVersion(toeflId);
    return new ResponseDto('success get latest section', section);
  }

  @Get(':sectionId')
  async findOne(@Param('sectionId') sectionId: string) {
    const section = await this.formService.findOneForm(sectionId);
    return new ResponseDto('success get one section', section);
  }
  @Patch(':sectionId')
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
  async updateSection(
    @Param('sectionId') sectionId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateSectionDto: UpdateFormDto,
  ) {
    const instructionAudio = files.find(
      (file) => file.fieldname === 'instruction_audio',
    );
    const closingAudio = files.find(
      (file) => file.fieldname === 'closing_audio',
    );

    return this.formService.updateForm(
      sectionId,
      updateSectionDto,
      instructionAudio,
      closingAudio,
    );
  }

  @Post(':sectionId/version')
  @Roles(Role.SuperAdmin)
  async createVersion(@Param('sectionId') sectionId: string) {
    const section = await this.formService.createFormVersion(sectionId);
    return new ResponseDto('success create section version', section);
  }
}
