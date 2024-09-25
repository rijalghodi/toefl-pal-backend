import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';

import { UpdateAnswerBulkDto } from '@/answer/dto/update-answer.dto';
import { ResponseDto } from '@/common/dto/response.dto';

import { AttemptService } from './attempt.service';

@Controller()
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Post('form/:formId/attempt/start')
  async startAttempt(@Param('formId') formId: string, @Request() req: Request) {
    const user = (req as any).user;
    const newAttempt = await this.attemptService.startAttempt(user.id, formId);
    return new ResponseDto('Success', newAttempt);
  }

  @Get('form/:formId/attempt')
  async GetOneAttempt(
    @Param('formId') formId: string,
    @Request() req: Request,
  ) {
    const user = (req as any).user;
    const newAttempt = await this.attemptService.findOneAttemptWithServerTime(
      user.id,
      formId,
    );
    return new ResponseDto('Success', newAttempt);
  }

  @Post('form/:formId/attempt/finish')
  async finishAttempt(
    @Param('formId') formId: string,
    @Body() dto: UpdateAnswerBulkDto,
    @Request() req: Request,
  ) {
    const user = (req as any).user;

    const attempt = await this.attemptService.finishAttempt(
      user.id,
      formId,
      dto,
    );

    return new ResponseDto('success', attempt);
  }
}
