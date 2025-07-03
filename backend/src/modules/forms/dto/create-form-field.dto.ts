import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';
import { FormFieldType } from '@prisma/client';

export class CreateFormFieldDto {
  @IsString()
  label: string;

  @IsEnum(FormFieldType)
  type: FormFieldType;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsString()
  helpText?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsNumber()
  order: number;

  @IsOptional()
  @IsObject()
  options?: Record<string, any>;

  @IsOptional()
  @IsObject()
  validation?: Record<string, any>;

  @IsOptional()
  @IsString()
  defaultValue?: string;

  @IsUUID()
  formId: string;

  @IsOptional()
  @IsUUID()
  stepId?: string;
} 