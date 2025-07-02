import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELED = 'CANCELED',
  REFUNDED = 'REFUNDED',
}

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Invoice number',
    example: 'INV-2023-001',
  })
  @IsString()
  invoiceNumber: string;

  @ApiProperty({
    description: 'Subscription ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  subscriptionId: string;

  @ApiProperty({
    description: 'Invoice amount (before tax)',
    example: 99.99,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Tax amount',
    example: 10.00,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  tax?: number;

  @ApiProperty({
    description: 'Total amount (including tax)',
    example: 109.99,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'Invoice status',
    enum: InvoiceStatus,
    example: InvoiceStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiProperty({
    description: 'Invoice due date',
    example: '2023-01-15T00:00:00Z',
  })
  @IsDateString()
  dueDate: string;

  @ApiProperty({
    description: 'Invoice issue date',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiProperty({
    description: 'Invoice notes',
    example: 'Payment due within 15 days',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Agency ID (required if client ID is not provided)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  agencyId?: string;

  @ApiProperty({
    description: 'Client ID (required if agency ID is not provided)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  clientId?: string;
} 