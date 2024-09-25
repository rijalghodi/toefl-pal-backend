import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Part } from '@/part/entity/part.entity';
import { StorageModule } from '@/storage/storage.module';

import { Form } from './entity/form.entity';
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form, Part]), StorageModule],
  providers: [FormService],
  exports: [FormService],
  controllers: [FormController],
})
export class FormModule {}
