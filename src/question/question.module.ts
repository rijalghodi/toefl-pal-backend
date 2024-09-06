// part.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormModule } from '@/form/form.module';
import { Question } from '@/question/entity/question.entity';
import { QuestionController } from '@/question/question.controller';
import { QuestionService } from '@/question/question.service';
import { StorageModule } from '@/storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), StorageModule, FormModule],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
