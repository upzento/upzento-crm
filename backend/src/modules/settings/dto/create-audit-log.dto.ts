import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAuditLogDto {
  @ApiProperty({
    description: 'Action performed',
    example: 'UPDATE_SETTINGS',
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    description: 'Entity type',
    example: 'GENERAL_SETTINGS',
  })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({
    description: 'Entity ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({
    description: 'Additional details',
    example: { oldValue: { companyName: 'Old Name' }, newValue: { companyName: 'New Name' } },
    required: false,
  })
  @IsOptional()
  @IsObject()
  details?: Record<string, any>;

  @ApiProperty({
    description: 'IP address',
    example: '192.168.1.1',
    required: false,
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    description: 'User agent',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: 'Client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  clientId: string;
} 