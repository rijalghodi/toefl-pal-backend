// part.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormModule } from '@/form/form.module';
import { KeyModule } from '@/key/key.module';
import { OptionModule } from '@/option/option.module';
import { Question } from '@/question/entity/question.entity';
import { QuestionController } from '@/question/question.controller';
import { QuestionService } from '@/question/question.service';
import { StorageModule } from '@/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    StorageModule,
    FormModule,
    forwardRef(() => OptionModule),
    forwardRef(() => KeyModule),
  ],
  providers: [QuestionService],
  controllers: [QuestionController],
  exports: [QuestionService],
})
export class QuestionModule {}
