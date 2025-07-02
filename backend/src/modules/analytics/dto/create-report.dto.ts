import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsArray,
  IsUUID,
  IsObject,
  IsEmail
} from 'class-validator';

export enum ReportFormat {
  PDF = 'PDF',
  CSV = 'CSV',
  EXCEL = 'EXCEL',
  HTML = 'HTML',
}

export class CreateReportDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  schedule?: Record<string, any>;

  @IsArray()
  @IsEmail({}, { each: true })
  recipients: string[];

  @IsEnum(ReportFormat)
  format: ReportFormat;

  @IsObject()
  settings: Record<string, any>;

  @IsUUID()
  clientId: string;
} 