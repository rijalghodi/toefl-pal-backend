// dto/update-part.dto.ts
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateKeyDto {
  @IsOptional()
  @IsUUID()
  optionId: string;

  @IsOptional()
  explanation?: string;
}
