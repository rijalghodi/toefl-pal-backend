import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormModule } from '@/form/form.module';
import { PartModule } from '@/part/part.module';

import { Toefl } from './entity/toefl.entity';
import { ToeflController } from './toefl.controller';
import { ToeflService } from './toefl.service';

@Module({
  imports: [
    FormModule,
    PartModule,
    TypeOrmModule.forFeature([Toefl]),
  ],
  providers: [ToeflService],
  controllers: [ToeflController],
  exports: [ToeflService],
})
export class ToeflModule {}
