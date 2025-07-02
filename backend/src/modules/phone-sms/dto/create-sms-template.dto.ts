import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateSmsTemplateDto {
  @IsString()
  name: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsUUID()
  clientId: string;
} 