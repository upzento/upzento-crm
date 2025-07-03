import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';


export class FilterConditionDto {
  field: string;
  operator: string;
  value: any;
}

export class FilterGroupDto {
  conditions: FilterConditionDto[];
  operator: 'AND' | 'OR';
}

export class CreateCampaignSegmentDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  filterCriteria: {
    groups: FilterGroupDto[];
    operator: 'AND' | 'OR';
  };

  @IsUUID()
  clientId: string;
} 