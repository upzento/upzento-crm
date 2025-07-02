import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ModuleType } from './create-module-settings.dto';

export class CreateNotificationSettingsDto {
  @ApiProperty({
    description: 'Module type',
    enum: ModuleType,
    example: ModuleType.APPOINTMENTS,
  })
  @IsEnum(ModuleType)
  moduleType: ModuleType;

  @ApiProperty({
    description: 'Whether email notifications are enabled',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @ApiProperty({
    description: 'Whether SMS notifications are enabled',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  smsEnabled?: boolean;

  @ApiProperty({
    description: 'Whether push notifications are enabled',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @ApiProperty({
    description: 'Whether in-app notifications are enabled',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  inAppEnabled?: boolean;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;
} 