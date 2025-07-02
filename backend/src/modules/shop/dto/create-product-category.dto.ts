import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsUUID()
  clientId: string;
} 