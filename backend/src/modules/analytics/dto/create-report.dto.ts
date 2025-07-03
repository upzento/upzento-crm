import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';


export enum ReportFormat {
  PDF = 'PDF',
  CSV = 'CSV',
  EXCEL = 'EXCEL',
  HTML = 'HTML',
}

export class CreateReportDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  schedule?: Record<string, any>;

  @IsArray()
  @IsEmail({}, { each: true })
  recipients: string[];

  @IsEnum(ReportFormat)
  format: ReportFormat;

  @IsObject()
  settings: Record<string, any>;

  @IsUUID()
  clientId: string;
} 
