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

import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { OptionService } from './option.service';

@Controller('question/:questionId/option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post()
  async create(
    @Param('questionId') questionId: string,
    @Body() createOptionDto: CreateOptionDto,
  ) {
    const option = await this.optionService.create(questionId, createOptionDto);
    return new ResponseDto('success', option);
  }

  @Get()
  async findAll(@Param('questionId') questionId: string) {
    const options = await this.optionService.findAll(questionId);
    return new ResponseDto('success', options);
  }

  @Get(':optionId')
  async findOne(@Param('optionId') optionId: string) {
    const option = await this.optionService.findOne(optionId);
    return new ResponseDto('success', option);
  }

  @Patch(':optionId')
  async update(
    @Param('optionId') optionId: string,
    @Body() updateOptionDto: UpdateOptionDto,
  ) {
    const option = await this.optionService.update(optionId, updateOptionDto);
    return new ResponseDto('success', option);
  }

  @Delete(':optionId')
  async remove(@Param('optionId') id: string) {
    await this.optionService.remove(id);
    return new ResponseDto('success', null);
  }
}
