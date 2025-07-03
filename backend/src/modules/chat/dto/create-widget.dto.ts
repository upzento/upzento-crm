import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator';

enum WidgetPosition {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
}

export class CreateWidgetDto {
  @ApiProperty({
    description: 'Widget name',
    example: 'Website Chat Widget',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Welcome message shown when chat is initiated',
    example: 'Welcome! How can we help you today?',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Welcome message must be a string' })
  welcomeMessage?: string;

  @ApiProperty({
    description: 'Message shown when no agents are online',
    example: 'We\'re currently offline. Please leave a message and we\'ll get back to you.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Offline message must be a string' })
  offlineMessage?: string;

  @ApiProperty({
    description: 'Primary color for the widget (hex code)',
    example: '#3498db',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Primary color must be a string' })
  primaryColor?: string;

  @ApiProperty({
    description: 'Secondary color for the widget (hex code)',
    example: '#2ecc71',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Secondary color must be a string' })
  secondaryColor?: string;

  @ApiProperty({
    description: 'Position of the widget on the page',
    enum: WidgetPosition,
    example: 'RIGHT',
    required: false,
  })
  @IsOptional()
  @IsEnum(WidgetPosition, { message: 'Position must be RIGHT, LEFT, BOTTOM_RIGHT, or BOTTOM_LEFT' })
  position?: WidgetPosition;

  @ApiProperty({
    description: 'Whether to show agent avatars in the chat',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Show agent avatar must be a boolean' })
  showAgentAvatar?: boolean;

  @ApiProperty({
    description: 'Whether to show agent names in the chat',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Show agent name must be a boolean' })
  showAgentName?: boolean;
} 