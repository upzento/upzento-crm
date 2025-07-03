import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



export class CreateStaffDto {
  @ApiProperty({
    description: 'Staff member name',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Staff member email',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Staff member phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @ApiProperty({
    description: 'Staff member bio or description',
    example: 'John is a senior consultant with over 10 years of experience.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  bio?: string;

  @ApiProperty({
    description: 'Staff member profile image URL',
    example: 'https://example.com/staff/john-doe.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  imageUrl?: string;

  @ApiProperty({
    description: 'Staff member position or title',
    example: 'Senior Consultant',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Position must be a string' })
  position?: string;

  @ApiProperty({
    description: 'Calendar integration type',
    example: 'google',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Calendar type must be a string' })
  calendarType?: string;

  @ApiProperty({
    description: 'Calendar integration ID or email',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Calendar ID must be a string' })
  calendarId?: string;

  @ApiProperty({
    description: 'Service IDs this staff member can provide',
    example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Service IDs must be an array' })
  serviceIds?: string[];
} 