import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';

export class CreateContactCustomFieldDto {
  @ApiProperty({
    description: 'Custom field name',
    example: 'Birthday',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Custom field type',
    example: 'date',
    enum: ['text', 'number', 'date', 'select', 'checkbox', 'url', 'email', 'phone'],
  })
  @IsString({ message: 'Type must be a string' })
  @IsNotEmpty({ message: 'Type is required' })
  type: string;

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