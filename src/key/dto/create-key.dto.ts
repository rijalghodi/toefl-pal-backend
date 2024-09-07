// dto/create-part.dto.ts
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateKeyDto {
  @IsNotEmpty()
  @IsUUID()
  optionId: string;

  @IsOptional()
  explanation?: string;
}
