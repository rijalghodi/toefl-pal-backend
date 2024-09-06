import { IsOptional, MaxLength } from 'class-validator';

export class UpdateReferenceDto {
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  text?: string;
}
