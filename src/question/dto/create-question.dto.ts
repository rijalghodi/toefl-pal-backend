// dto/create-part.dto.ts
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class CreateQuestionDto {
  // ---- Question ----
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  order: number;

  @IsOptional()
  text?: string;

  @IsOptional()
  referenceId?: string;
}
