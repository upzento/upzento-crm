import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



export enum TriggerType {
  CONTACT_CREATED = 'CONTACT_CREATED',
  CONTACT_UPDATED = 'CONTACT_UPDATED',
  DEAL_STAGE_CHANGED = 'DEAL_STAGE_CHANGED',
  FORM_SUBMITTED = 'FORM_SUBMITTED',
  WEBSITE_VISIT = 'WEBSITE_VISIT',
  EMAIL_OPENED = 'EMAIL_OPENED',
  EMAIL_CLICKED = 'EMAIL_CLICKED',
  MANUAL = 'MANUAL',
  SCHEDULED = 'SCHEDULED',
}

export enum StepType {
  SEND_EMAIL = 'SEND_EMAIL',
  SEND_SMS = 'SEND_SMS',
  UPDATE_CONTACT = 'UPDATE_CONTACT',
  CREATE_DEAL = 'CREATE_DEAL',
  UPDATE_DEAL = 'UPDATE_DEAL',
  WAIT = 'WAIT',
  CONDITION = 'CONDITION',
  WEBHOOK = 'WEBHOOK',
}

export class AutomationStepDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(StepType)
  type: StepType;

  @IsString()
  config: Record<string, any>;

  @IsOptional()
  condition?: Record<string, any>;

  @IsOptional()
  delay?: number;
}

export class CreateAutomationWorkflowDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TriggerType)
  trigger: TriggerType;

  @IsOptional()
  triggerCriteria?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsUUID()
  clientId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AutomationStepDto)
  steps: AutomationStepDto[];
} 