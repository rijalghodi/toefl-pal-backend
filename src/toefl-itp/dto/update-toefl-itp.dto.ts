import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { CreateToeflItpDto } from './create-toefl-itp.dto';

export class UpdateToeflItpDto extends PartialType(CreateToeflItpDto) {
  @IsBoolean()
  @IsOptional()
  allowReview?: boolean;

  @IsString()
  @IsOptional()
  instruction?: string;

  @IsString()
  @IsOptional()
  closing: string;

  @IsBoolean()
  @IsOptional()
  premium?: boolean;
}
