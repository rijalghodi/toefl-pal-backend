// part.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Answer } from '@/answer/entity/answer.entity';
import { Attempt } from '@/attempt/entity/attempt.entity';
import { QuestionModule } from '@/question/question.module';

import { Eval } from './entity/eval.entity';
import { EvalService } from './eval.service';

@Module({
  imports: [TypeOrmModule.forFeature([Eval, Attempt, Answer]), QuestionModule],
  exports: [EvalService],
  providers: [EvalService]
})
export class EvalModule {}
