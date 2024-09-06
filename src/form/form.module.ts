import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StorageModule } from '@/storage/storage.module';

import { Form } from './entity/form.entity';
import { FormVersion } from './entity/form-version.entity';
import { FormService } from './form.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormVersion]), StorageModule],
  providers: [FormService],
  exports: [FormService],
})
export class FormModule {}
