import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
} from '@nestjs/common';

import { ResponseDto } from '@/common/dto/response.dto';

import { ToeflEvalService } from './toefl-eval.service';

@Controller()
export class ToeflEvalController {
  constructor(private readonly toeflEvalService: ToeflEvalService) {}

  @Get('toefl/:toeflId/eval')
  async findOne(@Param('toeflId') toeflId: string, @Req() req: Request) {
    const userId = (req as any).user.id;
    const toeflEval = await this.toeflEvalService.findOne(toeflId, userId);
    return new ResponseDto('success', toeflEval);
  }

  @Get('toefl/:toeflId/eval/fresh')
  async recalculateScore(
    @Param('toeflId') toeflId: string,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;
    const toeflEval = await this.toeflEvalService.calculateScore(
      toeflId,
      userId,
    );
    return new ResponseDto('success', toeflEval);
  }

  @Post('toefl/:toeflId/eval/stale')
  async staleScore(
    @Param('toeflId') toeflId: string,
    @Body() body: { stale?: boolean },
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;
    const toeflEval = await this.toeflEvalService.staleScore(
      toeflId,
      userId,
      body.stale,
    );
    return new ResponseDto('success', toeflEval);
  }
}
