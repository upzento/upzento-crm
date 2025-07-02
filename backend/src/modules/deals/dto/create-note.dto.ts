import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Note content',
    example: 'Client requested a follow-up call next week.',
  })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  content: string;

  @ApiProperty({
    description: 'Deal ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'Deal ID is required' })
  @IsUUID('4', { message: 'Deal ID must be a valid UUID' })
  dealId: string;
} 