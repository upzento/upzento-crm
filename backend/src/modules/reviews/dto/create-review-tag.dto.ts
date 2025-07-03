import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';


export class CreateReviewTagDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsUUID()
  clientId: string;
} 