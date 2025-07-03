import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export enum WidgetType {
  FULL_SHOP = 'FULL_SHOP',
  PRODUCT_GRID = 'PRODUCT_GRID',
  SINGLE_PRODUCT = 'SINGLE_PRODUCT',
}

export class ThemeSettingsDto {
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @IsOptional()
  @IsString()
  textColor?: string;

  @IsOptional()
  @IsString()
  fontFamily?: string;

  @IsOptional()
  @IsString()
  borderRadius?: string;

  @IsOptional()
  @IsString()
  buttonColor?: string;

  @IsOptional()
  @IsString()
  accentColor?: string;
}

export class WidgetSettingsDto {
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  productIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsString()
  sortBy?: string; // e.g., 'price', 'name', 'newest'

  @IsOptional()
  @IsString()
  sortOrder?: string; // 'asc' or 'desc'

  @IsOptional()
  @IsString()
  layout?: string; // e.g., 'grid', 'list'

  @IsOptional()
  @IsString()
  currency?: string; // e.g., 'USD', 'EUR'

  @IsOptional()
  @IsString()
  language?: string; // e.g., 'en', 'es'
}

export class CreateShopWidgetDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(WidgetType)
  type: WidgetType;

  @IsObject()
  @ValidateNested()
  @Type(() => ThemeSettingsDto)
  theme: ThemeSettingsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => WidgetSettingsDto)
  settings: WidgetSettingsDto;

  @IsArray()
  @IsString({ each: true })
  allowedDomains: string[];

  @IsUUID()
  clientId: string;
} 