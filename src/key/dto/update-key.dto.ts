// dto/update-part.dto.ts
import { IsOptional } from 'class-validator';

export class UpdateKeyDto {
  @IsOptional()
  optionId: string;

  @IsOptional()
  explanation?: string;
}
