import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';
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