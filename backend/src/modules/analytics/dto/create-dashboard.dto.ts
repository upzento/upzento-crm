import { 
  IsString, 
  IsOptional, 
  IsBoolean, 
  IsUUID,
  IsObject
} from 'class-validator';

export class CreateDashboardDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  layout: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsUUID()
  integrationId: string;

  @IsUUID()
  clientId: string;
} 
