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

@Controller()
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post('question/:questionId/option')
  async create(
    @Param('questionId') questionId: string,
    @Body() createOptionDto: CreateOptionDto,
  ) {
    const option = await this.optionService.create(questionId, createOptionDto);
    return new ResponseDto('success', option);
  }

  @Get('question/:questionId/option')
  async findAll(@Param('questionId') questionId: string) {
    const options = await this.optionService.findAllOption(questionId);
    return new ResponseDto('success', options);
  }

  @Get('option/:optionId')
  async findOne(@Param('optionId') optionId: string) {
    const option = await this.optionService.findOneOption(optionId);
    return new ResponseDto('success', option);
  }

  @Patch('option/:optionId')
  async update(
    @Param('optionId') optionId: string,
    @Body() updateOptionDto: UpdateOptionDto,
  ) {
    const option = await this.optionService.updateOption(
      optionId,
      updateOptionDto,
    );
    return new ResponseDto('success', option);
  }

  @Delete('option/:optionId')
  async remove(@Param('optionId') id: string) {
    await this.optionService.removeOption(id);
    return new ResponseDto('success', null);
  }
}
