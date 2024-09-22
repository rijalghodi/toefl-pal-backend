// dto/create-part.dto.ts
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  // ---- Question ----
  @IsOptional()
  text?: string;

  @IsOptional()
  referenceId?: string;
}
