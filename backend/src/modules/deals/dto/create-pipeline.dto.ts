import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePipelineDto {
  @ApiProperty({
    description: 'Pipeline name',
    example: 'Sales Pipeline',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Pipeline description',
    example: 'Main sales pipeline for tracking leads and opportunities',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
} 