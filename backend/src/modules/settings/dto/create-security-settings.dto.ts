import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



export enum MFAType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  AUTHENTICATOR_APP = 'AUTHENTICATOR_APP',
}

export class CreateSecuritySettingsDto {
  @ApiProperty({
    description: 'Number of days until password expires (null for no expiry)',
    example: 90,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  passwordExpiryDays?: number;

  @ApiProperty({
    description: 'Whether multi-factor authentication is enabled',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  mfaEnabled?: boolean;

  @ApiProperty({
    description: 'Type of multi-factor authentication',
    enum: MFAType,
    example: MFAType.AUTHENTICATOR_APP,
    required: false,
  })
  @IsOptional()
  @IsEnum(MFAType)
  mfaType?: MFAType;

  @ApiProperty({
    description: 'IP restrictions (allowed IPs)',
    example: ['192.168.1.1', '10.0.0.1/24'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ipRestrictions?: string[];

  @ApiProperty({
    description: 'Session timeout in minutes',
    example: 60,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  sessionTimeoutMinutes?: number;

  @ApiProperty({
    description: 'Client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  clientId: string;
}
