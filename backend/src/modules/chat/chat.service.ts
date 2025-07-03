import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ChatConversation, ChatMessage, ChatConversationStatus, ChatSource } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Conversation methods
  async createConversation(
    clientId: string,
    visitorName?: string,
    visitorEmail?: string,
    widgetId?: string,
    source: ChatSource = ChatSource.WEBSITE
  ): Promise<ChatConversation> {
    // If widget ID is provided, verify it belongs to the client
    if (widgetId) {
      const widget = await this.prisma.chatWidget.findFirst({
        where: { id: widgetId, clientId }
      });
      
      if (!widget) {
        throw new NotFoundException(`Widget with ID ${widgetId} not found`);
      }
    }
    
    return this.prisma.chatConversation.create({
      data: {
        visitorName,
        visitorEmail,
        widgetId,
        source,
        clientId
      },
      include: {
        widget: true
      }
    });
  }

  async findAllConversations(
    clientId: string,
    filters?: {
      status?: ChatConversationStatus;
      source?: ChatSource;
      assignedToId?: string;
      search?: string;
    }
  ): Promise<ChatConversation[]> {
    const where: any = { clientId };
    
    if (filters) {
      if (filters.status) {
        where.status = filters.status;
      }
      
      if (filters.source) {
        where.source = filters.source;
      }
      
      if (filters.assignedToId) {
        where.assignedToId = filters.assignedToId;
      }
      
      if (filters.search) {
        where.OR = [
          { visitorName: { contains: filters.search, mode: 'insensitive' } },
          { visitorEmail: { contains: filters.search, mode: 'insensitive' } },
          {
            messages: {
              some: {
                content: { contains: filters.search, mode: 'insensitive' }
              }
            }
          }
        ];
      }
    }
    
    return this.prisma.chatConversation.findMany({
      where,
      include: {
        widget: {
          select: {
            id: true,
            name: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            messages: true
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  async findConversation(id: string, clientId: string): Promise<ChatConversation> {
    const conversation = await this.prisma.chatConversation.findFirst({
      where: { id, clientId },
      include: {
        widget: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        messages: {
          include: {
            sentBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        notes: {
          include: {
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    // Mark all unread messages as read
    await this.prisma.chatMessage.updateMany({
      where: {
        conversationId: id,
        isFromVisitor: true,
        read: false
      },
      data: {
        read: true
      }
    });
    
    return conversation;
  }

  async updateConversationStatus(
    id: string,
    status: ChatConversationStatus,
    clientId: string
  ): Promise<ChatConversation> {
    await this.findConversation(id, clientId);
    
    return this.prisma.chatConversation.update({
      where: { id },
      data: { status }
    });
  }

  async assignConversation(
    id: string,
    assignedToId: string | null,
    clientId: string
  ): Promise<ChatConversation> {
    await this.findConversation(id, clientId);
    
    // If assignedToId is provided, verify it's a valid user with access to this client
    if (assignedToId) {
      const user = await this.prisma.user.findFirst({
        where: {
          id: assignedToId,
          OR: [
            { clientId },
            { client: { agencyId: { not: null } } }
          ]
        }
      });
      
      if (!user) {
        throw new NotFoundException(`User with ID ${assignedToId} not found or doesn't have access`);
      }
    }
    
    return this.prisma.chatConversation.update({
      where: { id },
      data: { assignedToId }
    });
  }

  // Message methods
  async createMessage(createMessageDto: CreateMessageDto, userId?: string): Promise<ChatMessage> {
    const { conversationId } = createMessageDto;
    
    // Check if conversation exists
    const conversation = await this.prisma.chatConversation.findUnique({
      where: { id: conversationId }
    });
    
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
    }
    
    // Create message
    return this.prisma.chatMessage.create({
      data: {
        ...createMessageDto,
        sentById: userId
      },
      include: {
        sentBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  }

  async markMessageAsRead(id: string): Promise<ChatMessage> {
    const message = await this.prisma.chatMessage.findUnique({
      where: { id }
    });
    
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    
    return this.prisma.chatMessage.update({
      where: { id },
      data: { read: true }
    });
  }

  // Tag methods
  async addTagToConversation(conversationId: string, tagId: string, clientId: string): Promise<void> {
    // Verify conversation belongs to client
    await this.findConversation(conversationId, clientId);
    
    // Verify tag belongs to client
    const tag = await this.prisma.chatTag.findFirst({
      where: { id: tagId, clientId }
    });
    
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }
    
    // Check if tag is already assigned
    const existingTag = await this.prisma.chatConversationTag.findUnique({
      where: {
        conversationId_tagId: {
          conversationId,
          tagId
        }
      }
    });
    
    if (existingTag) {
      throw new BadRequestException(`Tag is already assigned to this conversation`);
    }
    
    // Add tag to conversation
    await this.prisma.chatConversationTag.create({
      data: {
        conversationId,
        tagId
      }
    });
  }

  async removeTagFromConversation(conversationId: string, tagId: string, clientId: string): Promise<void> {
    // Verify conversation belongs to client
    await this.findConversation(conversationId, clientId);
    
    // Remove tag from conversation
    await this.prisma.chatConversationTag.delete({
      where: {
        conversationId_tagId: {
          conversationId,
          tagId
        }
      }
    }).catch(() => {
      throw new NotFoundException(`Tag with ID ${tagId} not found in this conversation`);
    });
  }

  // Note methods
  async addNoteToConversation(
    conversationId: string,
    content: string,
    createdById: string | undefined,
    clientId: string
  ): Promise<any> {
    // Verify conversation belongs to client
    await this.findConversation(conversationId, clientId);
    
    return this.prisma.chatNote.create({
      data: {
        content,
        conversationId,
        createdById
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  }

  // Analytics
  async getConversationStats(clientId: string, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const totalConversations = await this.prisma.chatConversation.count({
      where: { clientId }
    });
    
    const recentConversations = await this.prisma.chatConversation.count({
      where: {
        clientId,
        createdAt: {
          gte: startDate
        }
      }
    });
    
    const openConversations = await this.prisma.chatConversation.count({
      where: {
        clientId,
        status: ChatConversationStatus.OPEN
      }
    });
    
    const avgResponseTime = await this.calculateAverageResponseTime(clientId, startDate);
    
    const conversationsBySource = await this.prisma.chatConversation.groupBy({
      by: ['source'],
      where: { clientId },
      _count: true
    });
    
    return {
      totalConversations,
      recentConversations,
      openConversations,
      avgResponseTime,
      conversationsBySource
    };
  }

  private async calculateAverageResponseTime(clientId: string, startDate: Date): Promise<number> {
    // This is a simplified implementation
    // In a real system, you'd calculate the time between visitor messages and staff responses
    return 120; // 2 minutes in seconds as an example
  }
} 