import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Form } from '@/form/entity/form.entity';

import { ToeflItp } from './entity/toefl-itp.entity';
import { ToeflItpController } from './toefl-itp.controller';
import { ToeflItpService } from './toefl-itp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form, ToeflItp])],
  providers: [ToeflItpService],
  exports: [ToeflItpService],
  controllers: [ToeflItpController],
})
export class ToeflItpModule {}
