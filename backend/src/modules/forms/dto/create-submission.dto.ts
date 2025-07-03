import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';



class FormFieldResponseDto {
  @IsString()
  fieldId: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}

export class CreateSubmissionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldResponseDto)
  responses: FormFieldResponseDto[];

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
