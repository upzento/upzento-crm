import { IsString, IsOptional, IsArray, IsBoolean, IsInt, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchCondition {
  @ApiProperty({ description: 'Field to search on' })
  @IsString()
  field: string;

  @ApiProperty({ description: 'Operator for comparison' })
  @IsString()
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in' | 'exists';

  @ApiProperty({ description: 'Value to compare against' })
  value: any;

  @ApiProperty({ description: 'For between operator, the upper bound' })
  @IsOptional()
  upperValue?: any;
}

export class AdvancedSearchDto {
  @ApiProperty({ description: 'Search conditions to apply' })
  @IsArray()
  conditions: SearchCondition[];

  @ApiProperty({ description: 'How to combine conditions' })
  @IsString()
  @IsOptional()
  combinator: 'AND' | 'OR' = 'AND';

  @ApiProperty({ description: 'Fields to sort by' })
  @IsObject()
  @IsOptional()
  sort?: Record<string, 'asc' | 'desc'>;

  @ApiProperty({ description: 'Page number for pagination' })
  @IsInt()
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Items per page' })
  @IsInt()
  @IsOptional()
  limit?: number;

  @ApiProperty({ description: 'Whether to save this search' })
  @IsBoolean()
  @IsOptional()
  saveSearch?: boolean;

  @ApiProperty({ description: 'Name for the saved search' })
  @IsString()
  @IsOptional()
  searchName?: string;

  @ApiProperty({ description: 'Fields to include in the response' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  include?: string[];
} 