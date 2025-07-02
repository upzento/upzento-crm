import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateStageDto {
  @ApiProperty({
    description: 'Stage name',
    example: 'Qualified Lead',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Stage order (position in pipeline)',
    example: 2,
  })
  @IsNotEmpty({ message: 'Order is required' })
  @IsNumber({}, { message: 'Order must be a number' })
  @Min(0, { message: 'Order cannot be negative' })
  order: number;

  @ApiProperty({
    description: 'Pipeline ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'Pipeline ID is required' })
  @IsUUID('4', { message: 'Pipeline ID must be a valid UUID' })
  pipelineId: string;

  @ApiProperty({
    description: 'Stage color',
    example: '#FF5733',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Color must be a string' })
  color?: string;

  @ApiProperty({
    description: 'Probability of closing deals in this stage (0-100)',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Probability must be a number' })
  @Min(0, { message: 'Probability cannot be negative' })
  probability?: number;
} 