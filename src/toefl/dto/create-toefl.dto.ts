import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateToeflDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
