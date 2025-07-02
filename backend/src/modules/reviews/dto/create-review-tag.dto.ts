import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateReviewTagDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsUUID()
  clientId: string;
} 