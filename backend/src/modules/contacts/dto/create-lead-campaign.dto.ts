import { IsString, IsOptional, IsArray, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadCampaignDto {
  @ApiProperty({ description: 'Name of the lead nurturing campaign' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the campaign' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Target segment or contact list IDs' })
  @IsArray()
  @IsString({ each: true })
  targetSegmentIds: string[];

  @ApiProperty({ description: 'Campaign trigger conditions' })
  @IsArray()
  triggerConditions: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: string | number | boolean;
  }[];

  @ApiProperty({ description: 'Campaign steps/actions' })
  @IsArray()
  steps: {
    type: 'email' | 'sms' | 'task' | 'webhook';
    content: string;
    delay: number; // delay in minutes
    conditions?: {
      field: string;
      operator: string;
      value: any;
    }[];
  }[];

  @ApiProperty({ description: 'Whether the campaign is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Maximum number of contacts to include' })
  @IsInt()
  @IsOptional()
  maxContacts?: number;
} 