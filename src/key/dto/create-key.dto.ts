// dto/create-part.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateKeyDto {
  @IsNotEmpty()
  @IsString()
  optionId: string;

  @IsOptional()
  explanation?: string;
}
