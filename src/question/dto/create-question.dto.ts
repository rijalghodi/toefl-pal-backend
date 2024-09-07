// dto/create-part.dto.ts
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateQuestionDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  order: number;

  @IsOptional()
  text?: string;

  @IsOptional()
  @IsUUID()
  referenceId?: string;
}
