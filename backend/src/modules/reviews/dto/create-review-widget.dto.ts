import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsBoolean()
  showShadow?: boolean;
}

export class FilterSettingsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  minRating?: number;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  serviceIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  locationIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  tagIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sources?: string[];
}

export class CreateReviewWidgetDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  displayType?: string; // CAROUSEL, GRID, LIST

  @IsObject()
  @Type(() => ThemeSettingsDto)
  theme: ThemeSettingsDto;

  @IsOptional()
  @IsObject()
  @Type(() => FilterSettingsDto)
  filters?: FilterSettingsDto;

  @IsOptional()
  @IsBoolean()
  showRating?: boolean;

  @IsOptional()
  @IsBoolean()
  showDate?: boolean;

  @IsOptional()
  @IsBoolean()
  showSource?: boolean;

  @IsOptional()
  @IsBoolean()
  showResponse?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxReviews?: number;

  @IsArray()
  @IsString({ each: true })
  allowedDomains: string[];

  @IsUUID()
  clientId: string;
} 