// dto/create-part.dto.ts
import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

export class CreateBulkOptionDto {
  // ---- Option ----
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  options?: string[];
}
