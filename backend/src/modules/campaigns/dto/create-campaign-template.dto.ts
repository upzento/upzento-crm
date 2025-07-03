import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { MessageType } from './create-campaign-message.dto';

export class CreateCampaignTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  body: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsUUID()
  clientId: string;
} 