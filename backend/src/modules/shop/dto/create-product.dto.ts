import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  IsBoolean, 
  IsEnum, 
  IsArray, 
  IsUUID,
  Min,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

export class ProductVariantOptionDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class CreateProductVariantDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  inventory?: number;

  @IsOptional()
  @IsBoolean()
  allowBackorder?: boolean;

  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantOptionDto)
  options: ProductVariantOptionDto[];
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  inventory?: number;

  @IsOptional()
  @IsBoolean()
  allowBackorder?: boolean;

  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsUUID()
  clientId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
} 