import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';


export enum DataType {
  TIME_SERIES = 'TIME_SERIES',
  CATEGORICAL = 'CATEGORICAL',
  TABULAR = 'TABULAR',
  GEOSPATIAL = 'GEOSPATIAL',
  CUSTOM = 'CUSTOM',
}

export class CreateDatasetDto {
  @ApiProperty({ description: 'Dataset name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Dataset description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Data type',
    enum: DataType
  })
  @IsEnum(DataType)
  dataType: DataType;

  @ApiProperty({ 
    description: 'Query configuration for data retrieval',
    type: 'object'
  })
  @IsObject()
  query: Record<string, any>;

  @ApiProperty({ description: 'Integration ID' })
  @IsUUID()
  integrationId: string;

  @ApiProperty({ description: 'Client ID', required: false })
  @IsOptional()
  @IsString()
  clientId?: string; // Will be set from context if not provided
}

export class UpdateDatasetDto extends PartialType(CreateDatasetDto) {}

