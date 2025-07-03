import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';

enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  LOCATION = 'LOCATION',
}

export class CreateMessageDto {
  @ApiProperty({
    description: 'Message content',
    example: 'Hello, I need help with my order.',
  })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  content: string;

  @ApiProperty({
    description: 'Type of message',
    enum: MessageType,
    example: 'TEXT',
    required: false,
    default: 'TEXT',
  })
  @IsOptional()
  @IsEnum(MessageType, { message: 'Type must be TEXT, IMAGE, FILE, or LOCATION' })
  type?: MessageType;

  @ApiProperty({
    description: 'URL to media (for image, file types)',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Media URL must be a string' })
  mediaUrl?: string;

  @ApiProperty({
    description: 'Whether the message is from the visitor',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Is from visitor must be a boolean' })
  isFromVisitor?: boolean;

  @ApiProperty({
    description: 'Conversation ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'Conversation ID is required' })
  @IsUUID('4', { message: 'Conversation ID must be a valid UUID' })
  conversationId: string;
} 