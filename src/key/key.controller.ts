import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ResponseDto } from '@/common/dto/response.dto';
import { Role } from '@/common/guard/role.enum';
import { Roles } from '@/common/guard/roles.decorator';

import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { KeyService } from './key.service';

@Controller('question/:questionId/key')
export class KeyController {
  constructor(private readonly keyService: KeyService) {}

  @Post()
  @Roles(Role.SuperAdmin)
  async create(
    @Param('questionId') questionId: string,
    @Body() createKeyDto: CreateKeyDto,
  ) {
    const key = await this.keyService.create(questionId, createKeyDto);
    return new ResponseDto('success', key);
  }

  @Get()
  async findAll(@Param('questionId') questionId: string) {
    const keys = await this.keyService.findAll(questionId);
    return new ResponseDto('success', keys);
  }

  @Get(':keyId')
  async findOne(@Param('keyId') keyId: string) {
    const key = await this.keyService.findOne(keyId);
    return new ResponseDto('success', key);
  }

  @Patch(':keyId')
  @Roles(Role.SuperAdmin)
  async update(
    @Param('questionId') questionId: string,
    @Param('keyId') keyId: string,
    @Body() updateKeyDto: UpdateKeyDto,
  ) {
    const key = await this.keyService.update(questionId, keyId, updateKeyDto);
    return new ResponseDto('success', key);
  }

  @Delete(':keyId')
  @Roles(Role.SuperAdmin)
  async remove(@Param('keyId') id: string) {
    await this.keyService.remove(id);
    return new ResponseDto('success', null);
  }
}
