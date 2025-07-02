import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateReviewLocationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsUUID()
  clientId: string;
} 