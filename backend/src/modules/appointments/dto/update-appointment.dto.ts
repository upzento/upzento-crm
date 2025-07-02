import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentDto {
  @ApiProperty({
    description: 'Start time of the appointment',
    example: '2023-07-15T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Start time must be a valid date string' })
  startTime?: string;

  @ApiProperty({
    description: 'End time of the appointment',
    example: '2023-07-15T11:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'End time must be a valid date string' })
  endTime?: string;

  @ApiProperty({
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'Invalid appointment status' })
  status?: AppointmentStatus;

  @ApiProperty({
    description: 'Notes for the appointment',
    example: 'Client requested a follow-up discussion about the project',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @ApiProperty({
    description: 'ID of the service',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Service ID must be a valid UUID' })
  serviceId?: string;

  @ApiProperty({
    description: 'ID of the staff member',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Staff ID must be a valid UUID' })
  staffId?: string;

  @ApiProperty({
    description: 'ID of the contact',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Contact ID must be a valid UUID' })
  contactId?: string;

  @ApiProperty({
    description: 'ID of the location',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Location ID must be a valid UUID' })
  locationId?: string;

  @ApiProperty({
    description: 'Virtual meeting URL (for online appointments)',
    example: 'https://zoom.us/j/123456789',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Virtual meeting URL must be a string' })
  virtualMeetingUrl?: string;
} 