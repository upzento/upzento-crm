import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';

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