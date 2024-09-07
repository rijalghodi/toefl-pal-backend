// dto/create-part.dto.ts
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class OptionDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  order: number;
}

export class UpdateQuestionFullDto {
  // ---- Question ----
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  order: number;

  @IsOptional()
  text?: string;

  // audio is catched by other

  // ---- Reference

  @IsOptional()
  @IsUUID()
  referenceId?: string;

  // ---- Option ----
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options?: OptionDto[];

  // ---- Answer Key ----
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  explanation?: string;
}
