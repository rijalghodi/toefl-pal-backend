import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormModule } from '@/form/form.module';
import { SectionModule } from '@/section/section.module';

import { Toefl } from './entity/toefl.entity';
import { ToeflVersion } from './entity/toefl-version.entity';
import { ToeflController } from './toefl.controller';
import { ToeflService } from './toefl.service';
import { ToeflVersionService } from './toefl-version.service';

@Module({
  imports: [
    FormModule,
    forwardRef(() => SectionModule),
    TypeOrmModule.forFeature([Toefl, ToeflVersion]),
  ],
  providers: [ToeflService, ToeflVersionService],
  controllers: [ToeflController],
  exports: [ToeflVersionService],
})
export class ToeflModule {}
