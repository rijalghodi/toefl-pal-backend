// part.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormModule } from '@/form/form.module';

import { AttemptService } from './atempt.service';
import { AttemptController } from './attempt.controller';
import { Attempt } from './entity/attempt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attempt]), FormModule],
  providers: [AttemptService],
  controllers: [AttemptController],
  exports: [AttemptService],
})
export class AttemptModule {}
