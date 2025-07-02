import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus, PaymentStatus, ShippingStatus } from './create-order.dto';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsString()
  paymentIntentId?: string;

  @IsOptional()
  @IsEnum(ShippingStatus)
  shippingStatus?: ShippingStatus;

  @IsOptional()
  @IsString()
  shippingMethod?: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;
} 