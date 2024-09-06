import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSectionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
