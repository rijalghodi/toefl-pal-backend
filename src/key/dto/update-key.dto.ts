// dto/update-part.dto.ts
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateKeyDto {
  @IsOptional()
  explanation?: string;

  @IsOptional()
  @IsUUID()
  optionId?: string;
}
