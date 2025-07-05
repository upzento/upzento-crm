import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyDomainDto {
  @ApiProperty({
    description: 'Domain to verify',
    example: 'example.com',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/, {
    message: 'Invalid domain name',
  })
  domain: string;
} 