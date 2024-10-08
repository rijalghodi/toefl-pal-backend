// part.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OptionModule } from '@/option/option.module';
import { QuestionModule } from '@/question/question.module';

import { Key } from './entity/key.entity';
import { KeyController } from './key.controller';
import { KeyService } from './key.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Key]),
    forwardRef(() => QuestionModule),
    forwardRef(() => OptionModule),
  ],
  providers: [KeyService],
  controllers: [KeyController],
  exports: [KeyService],
})
export class KeyModule {}
