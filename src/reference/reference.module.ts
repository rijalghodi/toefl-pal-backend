// part.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StorageModule } from '@/storage/storage.module';

import { Reference } from './entity/reference.entity';
import { ReferenceController } from './reference.controller';
import { ReferenceService } from './reference.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reference]), StorageModule],
  providers: [ReferenceService],
  controllers: [ReferenceController],
})
export class ReferenceModule {}
