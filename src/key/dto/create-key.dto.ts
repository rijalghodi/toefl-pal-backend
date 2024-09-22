// dto/create-part.dto.ts
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateKeyDto {
  @IsOptional()
  @IsUUID()
  optionId?: string;

  @IsOptional()
  explanation?: string;
}
