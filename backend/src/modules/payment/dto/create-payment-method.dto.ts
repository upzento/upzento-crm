import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



export enum PaymentMethodType {
  CARD = 'CARD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
  OTHER = 'OTHER',
}

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Payment method type',
    enum: PaymentMethodType,
    example: PaymentMethodType.CARD,
  })
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @ApiProperty({
    description: 'Payment method name',
    example: 'Corporate Credit Card',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Whether this is the default payment method',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  // Card details (if type is CARD)
  @ApiProperty({
    description: 'Last 4 digits of the card',
    example: '4242',
    required: false,
  })
  @IsOptional()
  @IsString()
  cardLast4?: string;

  @ApiProperty({
    description: 'Card brand',
    example: 'Visa',
    required: false,
  })
  @IsOptional()
  @IsString()
  cardBrand?: string;

  @ApiProperty({
    description: 'Card expiry month',
    example: 12,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  cardExpiryMonth?: number;

  @ApiProperty({
    description: 'Card expiry year',
    example: 2025,
    required: false,
  })
  @IsOptional()
  @IsInt()
  cardExpiryYear?: number;

  // Bank account details (if type is BANK_ACCOUNT)
  @ApiProperty({
    description: 'Bank name',
    example: 'Chase',
    required: false,
  })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({
    description: 'Last 4 digits of bank account',
    example: '6789',
    required: false,
  })
  @IsOptional()
  @IsString()
  bankAccountLast4?: string;

  // External payment details (if type is PAYPAL, etc.)
  @ApiProperty({
    description: 'External payment system ID',
    example: 'paypal_12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  externalId?: string;

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