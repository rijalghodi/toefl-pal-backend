// dto/create-part.dto.ts
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CreatePartDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  order?: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  instruction?: string;

  @IsOptional()
  closing?: string;
}
