// dto/update-part.dto.ts
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateOptionDto {
  @IsOptional()
  text?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  order?: number;
}
