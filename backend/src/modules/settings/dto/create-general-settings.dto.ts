import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';

export class CreateGeneralSettingsDto {
  @ApiProperty({
    description: 'Company name',
    example: 'Acme Inc.',
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    description: 'Logo URL',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    description: 'Contact email',
    example: 'contact@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiProperty({
    description: 'Contact phone',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({
    description: 'Company address',
    example: '123 Main St, City, Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Timezone',
    example: 'America/New_York',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({
    description: 'Date format',
    example: 'MM/DD/YYYY',
    required: false,
  })
  @IsOptional()
  @IsString()
  dateFormat?: string;

  @ApiProperty({
    description: 'Time format (12h or 24h)',
    example: '12h',
    required: false,
  })
  @IsOptional()
  @IsString()
  timeFormat?: string;

  @ApiProperty({
    description: 'Client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  clientId: string;
} 