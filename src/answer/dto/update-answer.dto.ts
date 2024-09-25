import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class UpdateAnswerDto {
  @IsOptional()
  @IsUUID()
  optionId?: string;

  @IsUUID()
  questionId: string;
}

export class UpdateAnswerBulkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnswerDto) // Transform plain objects into instances of UpdateAnswerDto
  answers?: UpdateAnswerDto[];
}
