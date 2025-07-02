import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Service name',
    example: 'Consultation',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Service description',
    example: 'Initial consultation to discuss project requirements',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'Service duration in minutes',
    example: 60,
  })
  @IsNotEmpty({ message: 'Duration is required' })
  @IsNumber({}, { message: 'Duration must be a number' })
  @IsPositive({ message: 'Duration must be positive' })
  duration: number;

  @ApiProperty({
    description: 'Service price',
    example: 99.99,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;

  @ApiProperty({
    description: 'Buffer time before appointment in minutes',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Buffer time before must be a number' })
  @Min(0, { message: 'Buffer time before cannot be negative' })
  bufferTimeBefore?: number;

  @ApiProperty({
    description: 'Buffer time after appointment in minutes',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Buffer time after must be a number' })
  @Min(0, { message: 'Buffer time after cannot be negative' })
  bufferTimeAfter?: number;

  @ApiProperty({
    description: 'Service color for calendar display',
    example: '#FF5733',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Color must be a string' })
  color?: string;

  @ApiProperty({
    description: 'Service category',
    example: 'Consultations',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  category?: string;

  @ApiProperty({
    description: 'Is this a virtual service (online meeting)',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  isVirtual?: boolean;
} 