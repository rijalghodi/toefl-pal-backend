// part.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnswerModule } from '@/answer/answer.module';
import { FormModule } from '@/form/form.module';
import { UserModule } from '@/user/user.module';

import { AttemptController } from './attempt.controller';
import { AttemptService } from './attempt.service';
import { Attempt } from './entity/attempt.entity';

@Module({
  imports: [
    forwardRef(() => AnswerModule),
    TypeOrmModule.forFeature([Attempt]),
    UserModule,
    FormModule,
  ],
  providers: [AttemptService],
  controllers: [AttemptController],
  exports: [AttemptService],
})
export class AttemptModule {}
