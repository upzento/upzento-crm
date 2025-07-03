import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



export class UpdateContactDto {
  @ApiProperty({
    description: 'Contact first name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @ApiProperty({
    description: 'Contact last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @ApiProperty({
    description: 'Contact email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @ApiProperty({
    description: 'Contact company',
    example: 'Acme Inc.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Company must be a string' })
  company?: string;

  @ApiProperty({
    description: 'Contact job title',
    example: 'Marketing Manager',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Job title must be a string' })
  jobTitle?: string;

  @ApiProperty({
    description: 'Contact notes',
    example: 'Met at conference',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @ApiProperty({
    description: 'Contact address',
    example: '123 Main St, City',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @ApiProperty({
    description: 'Whether this contact is a lead',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isLead must be a boolean' })
  isLead?: boolean;

  @ApiProperty({
    description: 'Lead status',
    example: 'New',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Lead status must be a string' })
  leadStatus?: string;

  @ApiProperty({
    description: 'Lead source',
    example: 'Website',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Lead source must be a string' })
  leadSource?: string;

  @ApiProperty({
    description: 'ID of the user this contact is assigned to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Assigned user ID must be a valid UUID' })
  assignedToId?: string;

  @ApiProperty({
    description: 'Custom fields for the contact',
    example: { birthday: '1990-01-01', preferredContact: 'email' },
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'Custom fields must be an object' })
  customFields?: Record<string, any>;
} 