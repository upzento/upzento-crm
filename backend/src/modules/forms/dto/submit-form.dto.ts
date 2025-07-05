import { IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitFormDto {
  @ApiProperty({ description: 'Form submission data' })
  @IsObject()
  data: Record<string, any>;

  @ApiProperty({ description: 'Submission metadata' })
  @IsObject()
  @IsOptional()
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    timestamp?: string;
    [key: string]: any;
  };
} 