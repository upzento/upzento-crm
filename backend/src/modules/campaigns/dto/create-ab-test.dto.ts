import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export enum ABTestStatus {
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateABTestDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  testVariable: string;

  @IsObject()
  variantA: Record<string, any>;

  @IsObject()
  variantB: Record<string, any>;

  @IsOptional()
  @IsString()
  winningVariant?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsEnum(ABTestStatus)
  status?: ABTestStatus;

  @IsUUID()
  campaignId: string;
} 