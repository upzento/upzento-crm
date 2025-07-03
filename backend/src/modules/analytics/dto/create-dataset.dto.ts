import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';

export enum DataType {
  TIME_SERIES = 'TIME_SERIES',
  CATEGORICAL = 'CATEGORICAL',
  TABULAR = 'TABULAR',
  GEOSPATIAL = 'GEOSPATIAL',
  CUSTOM = 'CUSTOM',
}

export class CreateDatasetDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  query: Record<string, any>;

  @IsEnum(DataType)
  dataType: DataType;

  @IsOptional()
  @IsInt()
  @Min(0)
  cacheTime?: number;

  @IsUUID()
  integrationId: string;

  @IsUUID()
  clientId: string;
}

