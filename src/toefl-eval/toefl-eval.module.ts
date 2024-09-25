// part.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttemptModule } from '@/attempt/attempt.module';
import { Attempt } from '@/attempt/entity/attempt.entity';
import { EvalModule } from '@/eval/eval.module';
import { ToeflModule } from '@/toefl/toefl.module';
import { UserModule } from '@/user/user.module';

import { ToeflEval } from './entity/toefl-eval.entity';
import { ToeflEvalController } from './toefl-eval.controller';
import { ToeflEvalService } from './toefl-eval.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ToeflEval, Attempt]),
    ToeflModule,
    UserModule,
    AttemptModule,
    EvalModule,
  ],
  providers: [ToeflEvalService],
  exports: [ToeflEvalService],
  controllers: [ToeflEvalController],
})
export class ToeflEvalModule {}
