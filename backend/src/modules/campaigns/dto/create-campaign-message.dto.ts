import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsDate, 
  IsUUID,
  IsArray,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MessageType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  SOCIAL = 'SOCIAL',
}

export enum MessageStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export class RecipientDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID()
  contactId?: string;

  @IsOptional()
  customFields?: Record<string, any>;
}

export class CreateCampaignMessageDto {
  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  template?: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  sendAt?: Date;

  @IsEnum(MessageType)
  type: MessageType;

  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;

  @IsUUID()
  campaignId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  recipients?: RecipientDto[];
} 