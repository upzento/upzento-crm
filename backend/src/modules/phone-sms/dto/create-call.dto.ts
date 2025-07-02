import { IsString, IsOptional, IsUUID, IsEnum, IsInt, IsDate, IsDateString } from 'class-validator';

export enum CallDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export enum CallStatus {
  INITIATED = 'INITIATED',
  RINGING = 'RINGING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  NO_ANSWER = 'NO_ANSWER',
  BUSY = 'BUSY',
  CANCELED = 'CANCELED',
}

export class CreateCallDto {
  @IsEnum(CallDirection)
  direction: CallDirection;

  @IsEnum(CallStatus)
  status: CallStatus;

  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsString()
  recordingUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsUUID()
  phoneNumberId: string;

  @IsUUID()
  clientId: string;

  @IsOptional()
  @IsUUID()
  contactId?: string;

  @IsOptional()
  @IsUUID()
  dealId?: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;
} 