import { IsOptional } from 'class-validator';

export class UpdatePartDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  instruction?: string;

  @IsOptional()
  closing?: string;
}
