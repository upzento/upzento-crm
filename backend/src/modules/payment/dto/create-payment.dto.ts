import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Invoice ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  invoiceId: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 109.99,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Payment method',
    example: 'Credit Card',
  })
  @IsString()
  paymentMethod: string;

  @ApiProperty({
    description: 'Payment date',
    example: '2023-01-15T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @ApiProperty({
    description: 'Transaction ID from payment processor',
    example: 'txn_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({
    description: 'Payment notes',
    example: 'Payment received via Stripe',
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