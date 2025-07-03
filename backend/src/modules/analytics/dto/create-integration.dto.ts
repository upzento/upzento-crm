import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';


export enum IntegrationType {
  GOOGLE_ANALYTICS = 'GOOGLE_ANALYTICS',
  GOOGLE_ADS = 'GOOGLE_ADS',
  META = 'META',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  LINKEDIN = 'LINKEDIN',
  TWITTER = 'TWITTER',
  TIKTOK = 'TIKTOK',
  CUSTOM = 'CUSTOM',
}

export class CreateIntegrationDto {
  @IsString()
  name: string;

  @IsEnum(IntegrationType)
  type: IntegrationType;

  @IsOptional()
  @IsObject()
  credentials?: Record<string, any>;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsUUID()
  clientId: string;
} 
