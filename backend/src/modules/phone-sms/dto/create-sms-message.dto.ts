import { IsString, IsOptional, IsUUID, IsEnum, IsArray } from 'class-validator';

export enum MessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export enum MessageStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  READ = 'READ',
}

export class CreateSmsMessageDto {
  @IsEnum(MessageDirection)
  direction: MessageDirection;

  @IsEnum(MessageStatus)
  status: MessageStatus;

  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsArray()
  mediaUrls?: string[];

  @IsUUID()
  phoneNumberId: string;

  @IsUUID()
  clientId: string;

  @IsUUID()
  conversationId: string;

  @IsOptional()
  @IsUUID()
  contactId?: string;

  @IsOptional()
  @IsUUID()
  dealId?: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;
} 