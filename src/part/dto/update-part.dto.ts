import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePartDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  order?: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  instruction?: string;

  @IsOptional()
  closing?: string;
}
