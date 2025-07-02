import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

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