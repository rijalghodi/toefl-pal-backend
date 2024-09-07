import { IsOptional, IsUUID } from 'class-validator';

export class CreateAnswerDto {
  @IsOptional()
  @IsUUID()
  optionId?: string;

  @IsOptional()
  marked?: boolean;
}
