// dto/create-part.dto.ts
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class CreateOptionDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  order: number;

  @IsOptional()
  text?: string;
}
