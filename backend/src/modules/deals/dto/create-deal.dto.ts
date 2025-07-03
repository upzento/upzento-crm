import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



export class CreateDealDto {
  @ApiProperty({
    description: 'Deal title',
    example: 'Website redesign for XYZ Corp',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({
    description: 'Deal value',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Value must be a number' })
  @Min(0, { message: 'Value cannot be negative' })
  value?: number;

  @ApiProperty({
    description: 'Stage ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'Stage ID is required' })
  @IsUUID('4', { message: 'Stage ID must be a valid UUID' })
  stageId: string;

  @ApiProperty({
    description: 'Pipeline ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'Pipeline ID is required' })
  @IsUUID('4', { message: 'Pipeline ID must be a valid UUID' })
  pipelineId: string;

  @ApiProperty({
    description: 'Contact ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Contact ID must be a valid UUID' })
  contactId?: string;

  @ApiProperty({
    description: 'User ID of the person assigned to the deal',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Assigned to ID must be a valid UUID' })
  assignedToId?: string;

  @ApiProperty({
    description: 'Expected close date',
    example: '2023-12-31',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Expected close date must be a string' })
  expectedCloseDate?: string;

  @ApiProperty({
    description: 'Deal source',
    example: 'Website',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Source must be a string' })
  source?: string;

  @ApiProperty({
    description: 'Deal description',
    example: 'Complete website redesign including new logo and branding',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
} 