import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { SkillType } from '../enum/skill-type.enum';

export class CreateFormDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  instruction?: string;

  @IsString()
  @IsOptional()
  closing?: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  autoPlay?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  allowReview?: boolean;

  @IsEnum(SkillType)
  @IsOptional()
  skillType?: SkillType;
}
