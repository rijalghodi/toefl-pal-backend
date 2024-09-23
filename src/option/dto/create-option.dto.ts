// dto/create-part.dto.ts
import { IsOptional } from 'class-validator';

export class CreateOptionDto {
  @IsOptional()
  text?: string;
}
