// dto/create-part.dto.ts
import { IsOptional, IsUUID } from 'class-validator';

export class CreateKeyDto {
  @IsOptional()
  @IsUUID()
  optionId?: string;

  @IsOptional()
  explanation?: string;
}
