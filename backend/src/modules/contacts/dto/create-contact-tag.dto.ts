import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



export class CreateContactTagDto {
  @ApiProperty({
    description: 'Tag name',
    example: 'Customer',
  })
  @IsString({ message: 'Tag name must be a string' })
  @IsNotEmpty({ message: 'Tag name is required' })
  name: string;

  @ApiProperty({
    description: 'Tag color (hex code)',
    example: '#FF5733',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Color must be a string' })
  color?: string;

  @ApiProperty({
    description: 'Tag description',
    example: 'Active customers',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
} 