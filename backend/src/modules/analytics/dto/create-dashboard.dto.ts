import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDashboardDto {
  @ApiProperty({ description: 'Dashboard name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Dashboard description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Dashboard layout configuration',
    type: 'object',
    required: false
  })
  @IsOptional()
  @IsObject()
  layout?: Record<string, any>;

  @ApiProperty({ description: 'Is template dashboard', default: false })
  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;

  @ApiProperty({ description: 'Is default dashboard', default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ description: 'Is public dashboard', default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ description: 'Client ID', required: false })
  @IsOptional()
  @IsString()
  clientId?: string; // Will be set from context if not provided
}

export class UpdateDashboardDto extends PartialType(CreateDashboardDto) {} 
