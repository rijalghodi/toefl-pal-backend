// dto/create-part.dto.ts
import { IsOptional } from 'class-validator';

export class CreateQuestionDto {
  // ---- Question ----
  @IsOptional()
  text?: string;

  @IsOptional()
  referenceId?: string;

  @IsOptional()
  readingReferenceDetail?: string;
}
