// dto/create-part.dto.ts
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class CreateOptionDto {
  @IsOptional()
  text?: string;
}
