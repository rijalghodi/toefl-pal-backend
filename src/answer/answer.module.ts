// part.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attempt } from '@/attempt/entity/attempt.entity';
import { OptionModule } from '@/option/option.module';
import { QuestionModule } from '@/question/question.module';

import { AnswerService } from './answer.service';
import { Answer } from './entity/answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer, Attempt]),
    QuestionModule,
    OptionModule,
  ],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
