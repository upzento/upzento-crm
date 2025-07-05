import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCaptchaDto {
  @ApiProperty({
    description: 'reCAPTCHA token to verify',
    example: '03AGdBq24PwEalnDhw3...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
} 