import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';

import { ResponseDto } from '@/common/dto/response.dto';
import { Role } from '@/common/guard/role.enum';
import { Roles } from '@/common/guard/roles.decorator';

import { AnswerService } from './answer.service';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Controller('attempt/:attemptId/answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Get()
  async findAll(@Param('attemptId') attemptId: string) {
    const answers = await this.answerService.findAll(attemptId);
    return new ResponseDto('success', answers);
  }

  @Get(':answerId')
  async findOne(@Param('answerId') answerId: string) {
    const answer = await this.answerService.findOne(answerId);
    return new ResponseDto('success', answer);
  }

  @Patch(':answerId')
  @Roles(Role.SuperAdmin)
  async update(
    @Param('answerId') answerId: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    const answer = await this.answerService.update(answerId, updateAnswerDto);
    return new ResponseDto('success', answer);
  }

  @Delete(':answerId')
  @Roles(Role.SuperAdmin)
  async remove(@Param('answerId') answerId: string) {
    await this.answerService.remove(answerId);
    return new ResponseDto('success', null);
  }
}
