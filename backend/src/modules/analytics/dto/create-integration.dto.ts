import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export enum IntegrationType {
  GOOGLE_ANALYTICS = 'google_analytics',
  META_ADS = 'meta_ads',
  LINKEDIN_ADS = 'linkedin_ads',
  GOOGLE_ADS = 'google_ads',
  TWITTER_ADS = 'twitter_ads',
  TIKTOK_ADS = 'tiktok_ads',
  CUSTOM = 'custom'
}

export enum IntegrationStatus {
  DISCONNECTED = 'disconnected',
  CONNECTED = 'connected',
  ERROR = 'error',
  SYNCING = 'syncing'
}

export enum SyncFrequency {
  MANUAL = 'manual',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly'
}

export class CreateIntegrationDto {
  @ApiProperty({ description: 'Integration name' })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Integration type',
    enum: IntegrationType
  })
  @IsEnum(IntegrationType)
  type: IntegrationType;

  @ApiProperty({ 
    description: 'Integration credentials (will be encrypted)',
    type: 'object'
  })
  @IsObject()
  credentials: Record<string, any>;

  @ApiProperty({ 
    description: 'Integration configuration',
    type: 'object',
    required: false
  })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiProperty({ 
    description: 'Sync frequency',
    enum: SyncFrequency,
    default: SyncFrequency.DAILY
  })
  @IsOptional()
  @IsEnum(SyncFrequency)
  syncFrequency?: SyncFrequency;

  @ApiProperty({ description: 'Client ID', required: false })
  @IsOptional()
  @IsString()
  clientId?: string; // Will be set from context if not provided
}

export class UpdateIntegrationDto {
  @ApiProperty({ description: 'Integration name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    description: 'Integration credentials (will be encrypted)',
    type: 'object',
    required: false
  })
  @IsOptional()
  @IsObject()
  credentials?: Record<string, any>;

  @ApiProperty({ 
    description: 'Integration configuration',
    type: 'object',
    required: false
  })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiProperty({ 
    description: 'Integration status',
    enum: IntegrationStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(IntegrationStatus)
  status?: IntegrationStatus;

  @ApiProperty({ 
    description: 'Sync frequency',
    enum: SyncFrequency,
    required: false
  })
  @IsOptional()
  @IsEnum(SyncFrequency)
  syncFrequency?: SyncFrequency;

  @ApiProperty({ description: 'Error message', required: false })
  @IsOptional()
  @IsString()
  errorMessage?: string;
}

// Google Analytics specific credentials
export class GoogleAnalyticsCredentials {
  @ApiProperty({ description: 'Google Analytics property ID' })
  @IsString()
  propertyId: string;

  @ApiProperty({ description: 'OAuth2 access token' })
  @IsString()
  accessToken: string;

  @ApiProperty({ description: 'OAuth2 refresh token' })
  @IsString()
  refreshToken: string;

  @ApiProperty({ description: 'Client ID' })
  @IsString()
  clientId: string;

  @ApiProperty({ description: 'Client secret' })
  @IsString()
  clientSecret: string;
}

// Meta Ads specific credentials
export class MetaAdsCredentials {
  @ApiProperty({ description: 'Meta Ads account ID' })
  @IsString()
  adAccountId: string;

  @ApiProperty({ description: 'Access token' })
  @IsString()
  accessToken: string;

  @ApiProperty({ description: 'App ID' })
  @IsString()
  appId: string;

  @ApiProperty({ description: 'App secret' })
  @IsString()
  appSecret: string;
}

// LinkedIn Ads specific credentials
export class LinkedInAdsCredentials {
  @ApiProperty({ description: 'LinkedIn Ads account ID' })
  @IsString()
  adAccountId: string;

  @ApiProperty({ description: 'Access token' })
  @IsString()
  accessToken: string;

  @ApiProperty({ description: 'Client ID' })
  @IsString()
  clientId: string;

  @ApiProperty({ description: 'Client secret' })
  @IsString()
  clientSecret: string;
} 
