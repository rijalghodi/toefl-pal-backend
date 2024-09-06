import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { CreateToeflDto } from './create-toefl.dto';

export class UpdateToeflDto extends PartialType(CreateToeflDto) {
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
