import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';

export enum ModuleType {
  DEALS = 'DEALS',
  APPOINTMENTS = 'APPOINTMENTS',
  PHONE_SMS = 'PHONE_SMS',
  REVIEWS = 'REVIEWS',
  SHOP = 'SHOP',
  FORMS = 'FORMS',
  MARKETING = 'MARKETING',
  CHAT = 'CHAT',
  CONTACTS = 'CONTACTS',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS',
  PAYMENT = 'PAYMENT',
}

export class CreateModuleSettingsDto {
  @ApiProperty({
    description: 'Module type',
    enum: ModuleType,
    example: ModuleType.APPOINTMENTS,
  })
  @IsEnum(ModuleType)
  moduleType: ModuleType;

  @ApiProperty({
    description: 'Whether the module is enabled',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiProperty({
    description: 'Module-specific settings',
    example: { defaultView: 'calendar', reminderEnabled: true },
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