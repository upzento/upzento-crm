import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreateFormStepDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  order: number;

  @IsUUID()
  formId: string;
} 