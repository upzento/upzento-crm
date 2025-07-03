import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { WebhookMethod } from '@prisma/client';

export class CreateFormWebhookDto {
  @IsUUID()
  formId: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsEnum(WebhookMethod)
  method?: WebhookMethod;

  @IsOptional()
  @IsObject()
  headers?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
} 