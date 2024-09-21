// part.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormModule } from '@/form/form.module';
import { StorageModule } from '@/storage/storage.module';

import { Part } from './entity/part.entity';
import { PartController } from './part.controller';
import { PartService } from './part.service';

@Module({
  imports: [TypeOrmModule.forFeature([Part]), FormModule, StorageModule],
  providers: [PartService],
  controllers: [PartController],
  exports: [PartService],
})
export class PartModule {}
