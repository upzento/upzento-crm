import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePhoneNumberDto } from './create-phone-number.dto';

enum PhoneStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

export class UpdatePhoneNumberDto extends PartialType(CreatePhoneNumberDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(PhoneStatus)
  status?: PhoneStatus;
} 