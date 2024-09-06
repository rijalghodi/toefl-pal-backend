// auth.controller.ts
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
} from '@nestjs/common';

import { ResponseDto } from '@/common/dto/response.dto';
import { Role } from '@/common/guard/role.enum';
import { Roles } from '@/common/guard/roles.decorator';

import { CreateToeflDto } from './dto/create-toefl.dto';
import { UpdateToeflDto } from './dto/update-toefl.dto';
import { ToeflService } from './toefl.service';
import { ToeflVersionService } from './toefl-version.service';

@Controller('toefl')
export class ToeflController {
  constructor(
    private readonly toeflService: ToeflService,
    private readonly toeflVersionService: ToeflVersionService,
  ) {}

  @Get()
  async findAll(@Query('published') published: boolean, @Req() req: Request) {
    const user = (req as any).user;

    if (!published && !user.roles.includes(Role.SuperAdmin)) {
      throw new ForbiddenException(
        'You do not have permission to access unpublished data.',
      );
    }
    const data = await this.toeflService.findAllToefl(published);
    return new ResponseDto('succeess', data);
  }

  @Post()
  @Roles(Role.SuperAdmin)
  async create(@Body() body: CreateToeflDto, @Req() req: Request) {
    const user = (req as any).user;
    const toefl = await this.toeflService.createToefl(user.id, body);
    return new ResponseDto('succeess', toefl);
  }

  @Get(':toeflId/version')
  @Roles(Role.SuperAdmin)
  async fidnAllVersion(@Param('toeflId') toeflId: string) {
    const toefl = await this.toeflVersionService.findAllToeflVersion(toeflId);
    return new ResponseDto('succeess', toefl);
  }

  @Post(':toeflId/version')
  @Roles(Role.SuperAdmin)
  async createVersion(@Param('toeflId') toeflId: string) {
    const toefl = await this.toeflVersionService.createToeflVersion(toeflId);
    return new ResponseDto('succeess', toefl);
  }

  @Get(':toeflId')
  async findOne(@Param('toeflId') toeflId: string, @Req() req: Request) {
    const user = (req as any).user;
    const data = await this.toeflService.findOneToefl(toeflId);

    if (!data.publishedAt && !user.roles.includes(Role.SuperAdmin)) {
      throw new ForbiddenException(
        'You do not have permission to access unpublished data.',
      );
    }

    return new ResponseDto('ok succeess', data);
  }

  @Patch(':toeflId')
  @Roles(Role.SuperAdmin)
  async update(
    @Param('toeflId') toeflId: string,
    @Body() body: UpdateToeflDto,
  ) {
    const toefl = await this.toeflService.updateToefl(toeflId, body);
    return new ResponseDto('success', toefl);
  }

  @Post(':toeflId')
  @Roles(Role.SuperAdmin)
  async publishToefl(
    @Param('toeflId') toeflId: string,
    @Body('publish') publish?: boolean,
  ) {
    const toefl = await this.toeflService.publishToefl(toeflId, publish);
    return new ResponseDto('success', toefl);
  }
}
