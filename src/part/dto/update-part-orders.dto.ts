import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @IsString()
  id: string;

  @IsInt()
  @Min(1) // Ensure order is a positive integer (or you can use @IsPositive if no zero is allowed)
  order: number;
}

export class UpdatePartOrdersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto) // Transform the array to validate each item
  orders: OrderItemDto[];
}
