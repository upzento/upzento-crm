import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard, TenantContextGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Conversation endpoints
  @Post('conversations')
  createConversation(
    @Body() data: {
      clientId: string;
      visitorName?: string;
      visitorEmail?: string;
      widgetId?: string;
      source?: string;
    },
  ) {
    const { clientId, visitorName, visitorEmail, widgetId, source } = data;
    return this.chatService.createConversation(
      clientId,
      visitorName,
      visitorEmail,
      widgetId,
      source as any,
    );
  }

  @Get('conversations')
  findAllConversations(
    @Query('clientId') clientId: string,
    @Query('status') status?: string,
    @Query('source') source?: string,
    @Query('assignedToId') assignedToId?: string,
    @Query('search') search?: string,
  ) {
    return this.chatService.findAllConversations(clientId, {
      status: status as any,
      source: source as any,
      assignedToId,
      search,
    });
  }

  @Get('conversations/:id')
  findConversation(
    @Param('id') id: string,
    @Query('clientId') clientId: string,
  ) {
    return this.chatService.findConversation(id, clientId);
  }

  @Patch('conversations/:id/status')
  updateConversationStatus(
    @Param('id') id: string,
    @Query('clientId') clientId: string,
    @Body('status') status: string,
  ) {
    return this.chatService.updateConversationStatus(
      id,
      status as any,
      clientId,
    );
  }

  @Patch('conversations/:id/assign')
  assignConversation(
    @Param('id') id: string,
    @Query('clientId') clientId: string,
    @Body('assignedToId') assignedToId: string | null,
  ) {
    return this.chatService.assignConversation(id, assignedToId, clientId);
  }

  // Message endpoints
  @Post('messages')
  createMessage(@Body() createMessageDto: CreateMessageDto, @Request() req: any) {
    return this.chatService.createMessage(createMessageDto, req.user?.id);
  }

  @Patch('messages/:id/read')
  markMessageAsRead(@Param('id') id: string) {
    return this.chatService.markMessageAsRead(id);
  }

  // Tag endpoints
  @Post('conversations/:id/tags')
  addTagToConversation(
    @Param('id') conversationId: string,
    @Query('clientId') clientId: string,
    @Body('tagId') tagId: string,
  ) {
    if (!tagId) {
      throw new BadRequestException('Tag ID is required');
    }
    return this.chatService.addTagToConversation(conversationId, tagId, clientId);
  }

  @Post('conversations/:id/tags/remove')
  removeTagFromConversation(
    @Param('id') conversationId: string,
    @Query('clientId') clientId: string,
    @Body('tagId') tagId: string,
  ) {
    if (!tagId) {
      throw new BadRequestException('Tag ID is required');
    }
    return this.chatService.removeTagFromConversation(conversationId, tagId, clientId);
  }

  // Note endpoints
  @Post('conversations/:id/notes')
  addNoteToConversation(
    @Param('id') conversationId: string,
    @Query('clientId') clientId: string,
    @Body('content') content: string,
    @Request() req: any,
  ) {
    if (!content) {
      throw new BadRequestException('Note content is required');
    }
    return this.chatService.addNoteToConversation(
      conversationId,
      content,
      req.user?.id,
      clientId,
    );
  }

  // Stats endpoints
  @Get('stats')
  getConversationStats(
    @Query('clientId') clientId: string,
    @Query('days') days?: string,
  ) {
    return this.chatService.getConversationStats(
      clientId,
      days ? parseInt(days) : undefined,
    );
  }
} 