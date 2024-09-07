import { IsOptional, IsUUID } from 'class-validator';

export class UpdateAnswerDto {
  @IsOptional()
  @IsUUID()
  optionId?: string;

  @IsOptional()
  marked?: boolean;
}
