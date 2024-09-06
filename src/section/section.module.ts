import { forwardRef, Module } from '@nestjs/common';

import { FormModule } from '@/form/form.module';
import { ToeflModule } from '@/toefl/toefl.module';

import { SectionController } from './section.controller';
import { SectionService } from './section.service';

@Module({
  imports: [forwardRef(() => FormModule), forwardRef(() => ToeflModule)],
  providers: [SectionService],
  exports: [SectionService],
  controllers: [SectionController],
})
export class SectionModule {}
