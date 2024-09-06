// dto/update-part.dto.ts
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePartDto {
  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  instruction?: string;

  @IsOptional()
  closing?: string;
}
