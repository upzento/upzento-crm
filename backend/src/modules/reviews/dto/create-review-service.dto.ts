import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateReviewServiceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  clientId: string;
} 