import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignCampaignDto {
  @ApiProperty({ description: 'ID of the campaign to assign' })
  @IsString()
  campaignId: string;

  @ApiProperty({ description: 'IDs of contacts to assign the campaign to' })
  @IsArray()
  @IsString({ each: true })
  contactIds: string[];

  @ApiProperty({ description: 'Optional override parameters for the campaign' })
  @IsOptional()
  overrides?: {
    startDelay?: number;
    customFields?: Record<string, any>;
  };
} 