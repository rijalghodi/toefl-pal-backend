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

import { FilterQueryDto } from '@/common/dto/filter-query.dto';
import { ResponseDto } from '@/common/dto/response.dto';
import { Role } from '@/common/guard/role.enum';
import { Roles } from '@/common/guard/roles.decorator';
import { ParseBooleanPipe } from '@/common/pipe/parse-boolean.pipe';

import { CreateToeflDto } from './dto/create-toefl.dto';
import { UpdateToeflDto } from './dto/update-toefl.dto';
import { ToeflService } from './toefl.service';
// import { ToeflVersionService } from './toefl-version.service';

@Controller('toefl')
export class ToeflController {
  constructor(
    private readonly toeflService: ToeflService,
    // private readonly toeflVersionService: ToeflVersionService,
  ) {}

  @Get()
  async findAll(
    @Query('published', ParseBooleanPipe) published: boolean,
    @Query('premium', ParseBooleanPipe) premium: boolean,
    @Query() filter: FilterQueryDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user;

    if (!published && !user?.roles?.includes(Role.SuperAdmin)) {
      throw new ForbiddenException(
        'You do not have permission to access unpublished data.',
      );
    }

    const toefl = await this.toeflService.findAllToefl(
      filter,
      published,
      premium,
    );
    return new ResponseDto('succeess', toefl.data, toefl.pagination);
  }

  @Post()
  @Roles(Role.SuperAdmin)
  async create(@Body() body: CreateToeflDto, @Req() req: Request) {
    const user = (req as any).user;
    const toefl = await this.toeflService.createToefl(user.id, body);
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

  // ---- Publish TOEFL -----

  @Post(':toeflId/publish')
  @Roles(Role.SuperAdmin)
  async publishToefl(
    @Param('toeflId') toeflId: string,
    @Body('publish') publish?: boolean,
  ) {
    const toefl = await this.toeflService.publishToefl(toeflId, publish);
    return new ResponseDto('success', toefl);
  }

  @Post(':toeflId/premium')
  @Roles(Role.SuperAdmin)
  async premiumToefl(
    @Param('toeflId') toeflId: string,
    @Body('premium') premium?: boolean,
  ) {
    const toefl = await this.toeflService.premiumToefl(toeflId, premium);
    return new ResponseDto('success', toefl);
  }

}
