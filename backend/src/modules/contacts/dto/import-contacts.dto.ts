import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



export class ImportContactsDto {
  @ApiProperty({
    description: 'CSV data as string',
    example: 'firstName,lastName,email\nJohn,Doe,john@example.com\nJane,Smith,jane@example.com',
  })
  @IsNotEmpty({ message: 'CSV data is required' })
  @IsString({ message: 'CSV data must be a string' })
  csvData: string;

  @ApiProperty({
    description: 'Field mapping for CSV columns',
    example: {
      0: 'firstName',
      1: 'lastName',
      2: 'email',
      3: 'phone',
      4: 'customFields.birthday'
    },
    required: true
  })
  @IsNotEmpty({ message: 'Field mapping is required' })
  @IsObject({ message: 'Field mapping must be an object' })
  fieldMapping: Record<string, string>;

  @ApiProperty({
    description: 'Whether to skip the first row (header)',
    example: true,
    required: false
  })
  @IsOptional()
  skipHeader?: boolean;

  @ApiProperty({
    description: 'Default lead status for imported contacts',
    example: 'Imported',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Default lead status must be a string' })
  defaultLeadStatus?: string;

  @ApiProperty({
    description: 'Default lead source for imported contacts',
    example: 'CSV Import',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Default lead source must be a string' })
  defaultLeadSource?: string;

  @ApiProperty({
    description: 'Tag IDs to apply to all imported contacts',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false
  })
  @IsOptional()
  tagIds?: string[];
}
