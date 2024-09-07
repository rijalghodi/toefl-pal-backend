import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  Request,
} from '@nestjs/common';

import { ResponseDto } from '@/common/dto/response.dto';
import { Role } from '@/common/guard/role.enum';
import { Roles } from '@/common/guard/roles.decorator';

import { AttemptService } from './atempt.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';

@Controller('form/:formId/attempt')
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Post()
  @Roles(Role.SuperAdmin)
  async create(
    @Param('formId') formId: string,
    @Body() createAttemptDto: CreateAttemptDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;
    const attempt = await this.attemptService.create(
      userId,
      formId,
      createAttemptDto,
    );
    return new ResponseDto('success', attempt);
  }

  @Get()
  async findAll(@Param('formId') formId: string, @Request() req: Request) {
    const userId = (req as any).user.id;
    const attempts = await this.attemptService.findAllRestrict(formId, userId);
    return new ResponseDto('success', attempts);
  }

  @Get(':attemptId')
  async findOne(
    @Param('attemptId') attemptId: string,
    @Request() req: Request,
  ) {
    const userId = (req as any).user.id;
    const attempt = await this.attemptService.findOne(attemptId);

    if (attempt.user.id !== userId) {
      throw new ForbiddenException();
    }

    return new ResponseDto('success', attempt);
  }
}
