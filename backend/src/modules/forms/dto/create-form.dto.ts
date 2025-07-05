import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { FormStatus } from '@prisma/client';

export class FormFieldDto {
  @ApiProperty({ description: 'Field label' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'Field type (text, email, number, select, etc.)' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Whether the field is required' })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean = false;

  @ApiProperty({ description: 'Field order in the form' })
  @IsOptional()
  order?: number;

  @ApiProperty({ description: 'Default value for the field' })
  @IsString()
  @IsOptional()
  defaultValue?: string;

  @ApiProperty({ description: 'Placeholder text' })
  @IsString()
  @IsOptional()
  placeholder?: string;

  @ApiProperty({ description: 'Options for select, radio, checkbox fields' })
  @IsObject()
  @IsOptional()
  options?: Record<string, any>;

  @ApiProperty({ description: 'Validation rules for the field' })
  @IsObject()
  @IsOptional()
  validation?: Record<string, any>;
}

export class FormWebhookDto {
  @ApiProperty({ description: 'Webhook URL' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'HTTP method for webhook' })
  @IsString()
  @IsOptional()
  method?: string = 'POST';

  @ApiProperty({ description: 'Custom headers for webhook' })
  @IsObject()
  @IsOptional()
  headers?: Record<string, string>;

  @ApiProperty({ description: 'Whether the webhook is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export class CreateFormDto {
  @ApiProperty({ description: 'Form name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Form description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Whether the form is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ description: 'Whether the form is public' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = false;

  @ApiProperty({ description: 'Form settings' })
  @IsObject()
  @IsOptional()
  settings?: {
    successMessage?: string;
    redirectUrl?: string;
    notificationEmail?: string;
    customCss?: string;
  };

  @ApiProperty({ description: 'Form fields' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields: FormFieldDto[];

  @ApiProperty({ description: 'Form webhooks' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormWebhookDto)
  @IsOptional()
  webhooks?: FormWebhookDto[];

  @IsUUID()
  clientId: string;
} 