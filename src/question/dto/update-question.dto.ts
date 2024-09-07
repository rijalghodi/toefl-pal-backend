// dto/create-part.dto.ts
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class UpdateQuestionDto {
  // ---- Question ----
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  order?: number;

  @IsOptional()
  text?: string;

  // audio is catched by other

  // ---- Reference

  @IsOptional()
  @IsUUID()
  referenceId?: string;
}
