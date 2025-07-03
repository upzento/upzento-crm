import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



export class CreateLocationDto {
  @ApiProperty({
    description: 'Location name',
    example: 'Downtown Office',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Location address',
    example: '123 Main St, City, State, 12345',
  })
  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  address: string;

  @ApiProperty({
    description: 'Location description',
    example: 'Our main office in the downtown area',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'Phone number for this location',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @ApiProperty({
    description: 'Email for this location',
    example: 'downtown@example.com',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  email?: string;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: '37.7749',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Latitude must be a string' })
  latitude?: string;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: '-122.4194',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Longitude must be a string' })
  longitude?: string;
} 