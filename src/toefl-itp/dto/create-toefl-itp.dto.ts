import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateToeflItpDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
