import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitFormDto {
  @ApiProperty({
    description: 'Form ID',
    example: 'form_123',
  })
  @IsString()
  @IsNotEmpty()
  formId: string;

  @ApiProperty({
    description: 'Form data',
    example: { name: 'John Doe', email: 'john@example.com' },
  })
  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;

  @ApiProperty({
    description: 'reCAPTCHA token',
    example: '03AGdBq24PwEalnDhw3...',
    required: false,
  })
  @IsString()
  @IsOptional()
  captchaToken?: string;

  @ApiProperty({
    description: 'Contact ID to associate with submission',
    example: 'contact_123',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactId?: string;

  @ApiProperty({
    description: 'Deal ID to associate with submission',
    example: 'deal_123',
    required: false,
  })
  @IsString()
  @IsOptional()
  dealId?: string;

  @ApiProperty({
    description: 'Submission metadata',
    example: {
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0...',
      referrer: 'https://example.com',
      submittedAt: '2024-02-26T12:00:00Z',
      source: 'embed',
      url: 'https://example.com/contact',
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    submittedAt?: string;
    source?: string;
    url?: string;
  };
} 