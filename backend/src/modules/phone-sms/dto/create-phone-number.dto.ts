import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';


enum PhoneProvider {
  TWILIO = 'TWILIO',
  VONAGE = 'VONAGE',
  OTHER = 'OTHER',
}

enum PhoneType {
  VOICE = 'VOICE',
  SMS = 'SMS',
  VOICE_SMS = 'VOICE_SMS',
}

export class CreatePhoneNumberDto {
  @IsString()
  number: string;

  @IsString()
  name: string;

  @IsEnum(PhoneProvider)
  provider: PhoneProvider;

  @IsEnum(PhoneType)
  type: PhoneType;

  @IsOptional()
  @IsString()
  status?: string;

  @IsUUID()
  clientId: string;
} 