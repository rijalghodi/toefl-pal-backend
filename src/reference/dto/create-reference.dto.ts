import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReferenceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  text?: string;
}
