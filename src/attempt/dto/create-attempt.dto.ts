// dto/create-part.dto.ts
import { IsOptional } from 'class-validator';

export class CreateAttemptDto {
  @IsOptional()
  isPractice?: boolean;
}
