// part.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttemptModule } from '@/attempt/attempt.module';
import { OptionModule } from '@/option/option.module';
import { Question } from '@/question/entity/question.entity';
import { QuestionModule } from '@/question/question.module';

import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { Answer } from './entity/answer.entity';

@Module({
  imports: [
    forwardRef(() => AttemptModule),
    TypeOrmModule.forFeature([Answer, Question]),
    QuestionModule,
    OptionModule,
  ],
  providers: [AnswerService],
  controllers: [AnswerController],
  exports: [AnswerService],
})
export class AnswerModule {}
