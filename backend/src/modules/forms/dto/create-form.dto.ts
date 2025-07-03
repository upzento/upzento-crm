import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';
import { FormStatus } from '@prisma/client';

export class CreateFormDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(FormStatus)
  status?: FormStatus;

  @IsObject()
  settings: Record<string, any>;

  @IsUUID()
  clientId: string;
} 