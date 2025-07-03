import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';

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