import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';

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