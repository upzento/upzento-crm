import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



export class UpdateContactCustomFieldDto {
  @ApiProperty({
    description: 'Custom field name',
    example: 'Birthday',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiProperty({
    description: 'Custom field type',
    example: 'date',
    enum: ['text', 'number', 'date', 'select', 'checkbox', 'url', 'email', 'phone'],
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Type must be a string' })
  type?: string;

  @ApiProperty({
    description: 'Options for select fields',
    example: ['Option 1', 'Option 2', 'Option 3'],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Options must be an array' })
  options?: string[];

  @ApiProperty({
    description: 'Whether this field is required',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isRequired must be a boolean' })
  isRequired?: boolean;
} 