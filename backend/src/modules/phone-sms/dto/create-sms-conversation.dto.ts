import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';

export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  SPAM = 'SPAM',
}

export class CreateSmsConversationDto {
  @IsOptional()
  @IsEnum(ConversationStatus)
  status?: ConversationStatus;

  @IsOptional()
  @IsUUID()
  contactId?: string;

  @IsUUID()
  clientId: string;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;
} 