import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SearchCondition } from './advanced-search.dto';

export class CreateSegmentDto {
  @ApiProperty({ description: 'Name of the segment' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the segment' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Search conditions that define the segment' })
  @IsArray()
  conditions: SearchCondition[];

  @ApiProperty({ description: 'How to combine conditions' })
  @IsString()
  @IsOptional()
  combinator: 'AND' | 'OR' = 'AND';

  @ApiProperty({ description: 'Whether the segment updates automatically' })
  @IsBoolean()
  @IsOptional()
  isDynamic?: boolean = true;

  @ApiProperty({ description: 'Whether to include archived contacts' })
  @IsBoolean()
  @IsOptional()
  includeArchived?: boolean = false;
} 