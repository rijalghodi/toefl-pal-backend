// dto/update-part.dto.ts
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateQuestionDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  order?: number;

  @IsOptional()
  text?: string;

  @IsOptional()
  referenceId?: string;
}
