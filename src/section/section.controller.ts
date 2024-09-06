// auth.controller.ts
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

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
  @Roles(Role.SuperAdmin)
  async update(
    @Param('sectionId') sectionId: string,
    @Body() body: UpdateFormDto,
  ) {
    const section = await this.formService.updateForm(sectionId, body);
    return new ResponseDto('success update section', section);
  }

  @Post(':sectionId/version')
  @Roles(Role.SuperAdmin)
  async createVersion(@Param('sectionId') sectionId: string) {
    const section = await this.formService.createFormVersion(sectionId);
    return new ResponseDto('success create section version', section);
  }
}
