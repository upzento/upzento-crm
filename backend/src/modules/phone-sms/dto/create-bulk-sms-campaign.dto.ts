import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export class RecipientDto {
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsUUID()
  contactId?: string;
}

export class CreateBulkSmsCampaignDto {
  @IsString()
  name: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsUUID()
  clientId: string;

  @IsOptional()
  @IsUUID()
  createdById?: string;

  @IsArray()
  @Type(() => RecipientDto)
  recipients: RecipientDto[];
} 