// dto/create-part.dto.ts
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateQuestionFullDto {
  // ---- Question ----
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
  @IsString({ each: true })
  options?: string[];

  // ---- Answer Key ----
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  key?: number;

  @IsOptional()
  @IsString()
  explanation?: string;
}
