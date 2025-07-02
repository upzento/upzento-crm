import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  IsEnum, 
  IsBoolean, 
  IsArray, 
  IsUUID, 
  IsDateString,
  Min
} from 'class-validator';

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsEnum(CouponType)
  type: CouponType;

  @IsNumber()
  @Min(0)
  value: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUsage?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  productIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  categoryIds?: string[];

  @IsUUID()
  clientId: string;
} 