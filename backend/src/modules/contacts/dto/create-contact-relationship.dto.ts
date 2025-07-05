import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RelationshipType {
  REPORTS_TO = 'REPORTS_TO',
  COLLEAGUE = 'COLLEAGUE',
  SUPERVISOR = 'SUPERVISOR',
  SPOUSE = 'SPOUSE',
  SIBLING = 'SIBLING',
  PARENT = 'PARENT',
  CHILD = 'CHILD',
  FRIEND = 'FRIEND',
  OTHER = 'OTHER',
}

export class CreateContactRelationshipDto {
  @ApiProperty({ description: 'ID of the first contact in the relationship' })
  @IsString()
  contactId1: string;

  @ApiProperty({ description: 'ID of the second contact in the relationship' })
  @IsString()
  contactId2: string;

  @ApiProperty({ description: 'Type of relationship between the contacts', enum: RelationshipType })
  @IsEnum(RelationshipType)
  relationshipType: RelationshipType;

  @ApiProperty({ description: 'Additional notes about the relationship' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Custom relationship label when type is OTHER' })
  @IsString()
  @IsOptional()
  customLabel?: string;

  @ApiProperty({ description: 'Strength/importance of the relationship (1-5)' })
  @IsOptional()
  strength?: number;
} 