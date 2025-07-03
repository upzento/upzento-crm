import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';


export enum ReviewSource {
  DIRECT = 'DIRECT',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  YELP = 'YELP',
  TRUSTPILOT = 'TRUSTPILOT',
  OTHER = 'OTHER',
}

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  content: string;

  @IsString()
  authorName: string;

  @IsOptional()
  @IsEmail()
  authorEmail?: string;

  @IsOptional()
  @IsString()
  authorPhone?: string;

  @IsOptional()
  @IsEnum(ReviewSource)
  source?: ReviewSource;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];

  @IsUUID()
  clientId: string;

  @IsOptional()
  @IsUUID()
  contactId?: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsOptional()
  @IsUUID()
  locationId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  tagIds?: string[];
} 