import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsObject, IsInt } from 'class-validator';

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUAL = 'SEMI_ANNUAL',
  ANNUAL = 'ANNUAL',
}

export enum PlanType {
  AGENCY = 'AGENCY',
  CLIENT = 'CLIENT',
}

export class CreatePlanDto {
  @ApiProperty({
    description: 'Plan name',
    example: 'Premium Plan',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Plan description',
    example: 'Our premium plan with all features',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Plan price',
    example: 99.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Billing cycle',
    enum: BillingCycle,
    example: BillingCycle.MONTHLY,
  })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({
    description: 'Plan features',
    example: { forms: true, chat: true, maxUsers: 10 },
  })
  @IsObject()
  features: Record<string, any>;

  @ApiProperty({
    description: 'Whether the plan is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Maximum number of users',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  maxUsers?: number;

  @ApiProperty({
    description: 'Maximum number of contacts',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  maxContacts?: number;

  @ApiProperty({
    description: 'Maximum storage in GB',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsInt()
  maxStorage?: number;

  @ApiProperty({
    description: 'Plan type',
    enum: PlanType,
    example: PlanType.CLIENT,
  })
  @IsEnum(PlanType)
  planType: PlanType;
} 