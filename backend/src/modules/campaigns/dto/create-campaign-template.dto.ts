import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsUUID
} from 'class-validator';
import { MessageType } from './create-campaign-message.dto';

export class CreateCampaignTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  body: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsUUID()
  clientId: string;
} 