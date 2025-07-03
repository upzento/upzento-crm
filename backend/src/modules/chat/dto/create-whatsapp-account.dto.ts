import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



export class CreateWhatsAppAccountDto {
  @ApiProperty({
    description: 'Phone number with country code',
    example: '+1234567890',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  phoneNumber: string;

  @ApiProperty({
    description: 'Display name for the WhatsApp account',
    example: 'Customer Support',
  })
  @IsNotEmpty({ message: 'Display name is required' })
  @IsString({ message: 'Display name must be a string' })
  displayName: string;

  @ApiProperty({
    description: 'API key for WhatsApp Business API',
    example: 'your-api-key-here',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'API key must be a string' })
  apiKey?: string;
} 