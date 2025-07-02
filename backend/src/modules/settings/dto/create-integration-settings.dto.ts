import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsNotEmpty, IsEnum, IsObject, IsDateString } from 'class-validator';

export enum IntegrationType {
  GOOGLE_CALENDAR = 'GOOGLE_CALENDAR',
  OUTLOOK_CALENDAR = 'OUTLOOK_CALENDAR',
  ZOOM = 'ZOOM',
  TEAMS = 'TEAMS',
  TWILIO = 'TWILIO',
  VONAGE = 'VONAGE',
  WHATSAPP = 'WHATSAPP',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  GOOGLE_ANALYTICS = 'GOOGLE_ANALYTICS',
  MAILCHIMP = 'MAILCHIMP',
  SENDGRID = 'SENDGRID',
  CUSTOM = 'CUSTOM',
}

export enum IntegrationStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
}

export class CreateIntegrationSettingsDto {
  @ApiProperty({
    description: 'Integration name',
    example: 'Google Calendar',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Integration type',
    enum: IntegrationType,
    example: IntegrationType.GOOGLE_CALENDAR,
  })
  @IsEnum(IntegrationType)
  type: IntegrationType;

  @ApiProperty({
    description: 'API key',
    example: 'abc123def456',
    required: false,
  })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @ApiProperty({
    description: 'API secret',
    example: 'xyz789secret',
    required: false,
  })
  @IsOptional()
  @IsString()
  apiSecret?: string;

  @ApiProperty({
    description: 'Refresh token',
    example: 'refresh_token_123',
    required: false,
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiProperty({
    description: 'Access token',
    example: 'access_token_456',
    required: false,
  })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiProperty({
    description: 'Token expiry date',
    example: '2023-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  tokenExpiry?: string;

  @ApiProperty({
    description: 'Webhook URL',
    example: 'https://example.com/webhook',
    required: false,
  })
  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @ApiProperty({
    description: 'Integration status',
    enum: IntegrationStatus,
    example: IntegrationStatus.CONNECTED,
    required: false,
  })
  @IsOptional()
  @IsEnum(IntegrationStatus)
  status?: IntegrationStatus;

  @ApiProperty({
    description: 'Additional settings',
    example: { enableNotifications: true },
    required: false,
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @ApiProperty({
    description: 'Client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  clientId: string;
} 