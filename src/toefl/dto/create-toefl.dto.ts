import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateToeflDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  allowReview?: boolean;

  @IsString()
  @IsOptional()
  instruction?: string;

  @IsString()
  @IsOptional()
  closing: string;
}
