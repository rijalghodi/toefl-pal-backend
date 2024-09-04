// auth.controller.ts
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Request,
} from '@nestjs/common';

import { ResponseDto } from '@/common/dto/response.dto';
import { Role } from '@/common/guard/role.enum';
import { Roles } from '@/common/guard/roles.decorator';

import { CreateToeflItpDto } from './dto/create-toefl-itp.dto';
import { UpdateToeflItpDto } from './dto/update-toefl-itp.dto';
import { ToeflItpService } from './toefl-itp.service';

@Controller('toefl-itp')
export class ToeflItpController {
  constructor(private readonly toeflItpService: ToeflItpService) {}

  @Get()
  async findAll(@Query('published') published: boolean, @Req() req: Request) {
    const user = (req as any).user;

    if (!published && !user.roles.includes(Role.SuperAdmin)) {
      throw new ForbiddenException(
        'You do not have permission to access unpublished data.',
      );
    }
    const data = await this.toeflItpService.findAllToeflItp(published);
    return new ResponseDto('succeed', data);
  }

  @Post()
  @Roles(Role.SuperAdmin)
  async create(@Body() body: CreateToeflItpDto) {
    const toeflItps = await this.toeflItpService.createToeflItp(body);
    return new ResponseDto('create toefl-itp succeed', toeflItps);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateToeflItpDto,
  ) {
    const toeflItps = await this.toeflItpService.updateToeflItp(id, body);
    return new ResponseDto('update toefl-itp succeed', toeflItps);
  }

  @Post(':id')
  @Roles(Role.SuperAdmin)
  async publish(
    @Param('id', ParseIntPipe) id: number,
    @Body('published') published?: boolean,
  ) {
    const toeflItps = await this.toeflItpService.publishToeflItp(id, published);
    return new ResponseDto('update toefl-itp succeed', toeflItps);
  }
}
