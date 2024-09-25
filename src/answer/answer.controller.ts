// import {
//   Body,
//   Controller,
//   Delete,
//   ForbiddenException,
//   Get,
//   Param,
//   Patch,
//   Req,
// } from '@nestjs/common';

// import { ResponseDto } from '@/common/dto/response.dto';
// import { Role } from '@/common/guard/role.enum';
// import { Roles } from '@/common/guard/roles.decorator';

// import { AnswerService } from './answer.service';
// import { UpdateAnswerBulkDto, UpdateAnswerDto } from './dto/update-answer.dto';
// import { AttemptService } from '@/attempt/attempt.service';

// @Controller('attempt/:attemptId/answer')
// export class AnswerController {
//   constructor(
//     private readonly answerService: AnswerService,
//     private readonly attemptService: AttemptService,
//   ) {}

//   @Get()
//   async findAll(@Param('attemptId') attemptId: string, @Req() req: Request) {
//     const user = (req as any)?.user;

//     const attempt = await this.attemptService.findOneAttempt(attemptId);
//     if (!attempt || attempt.user.id !== user.id) {
//       throw new ForbiddenException();
//     }
//     const answers = await this.answerService.findAll(attemptId);
//     return new ResponseDto('success', answers);
//   }

//   @Patch()
//   async updateBulk(
//     @Param('attemptId') attemptId: string,
//     @Body() dto: UpdateAnswerBulkDto,
//     @Req() req: Request,
//   ) {
//     const user = (req as any)?.user;

//     const attempt = await this.attemptService.findOneAttempt(attemptId);
//     if (!attempt || attempt.user.id !== user.id) {
//       throw new ForbiddenException();
//     }
//     const answer = await this.answerService.updateAnswerBulk(
//       attemptId,
//       dto.answers,
//     );
//     return new ResponseDto('success', answer);
//   }
// }
