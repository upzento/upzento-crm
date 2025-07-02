import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ChatWidget } from '@prisma/client';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

@Injectable()
export class WidgetsService {
  constructor(private prisma: PrismaService) {}

  async create(createWidgetDto: CreateWidgetDto, clientId: string): Promise<ChatWidget> {
    return this.prisma.chatWidget.create({
      data: {
        ...createWidgetDto,
        clientId
      }
    });
  }

  async findAll(clientId: string): Promise<ChatWidget[]> {
    return this.prisma.chatWidget.findMany({
      where: { clientId },
      include: {
        _count: {
          select: {
            conversations: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string, clientId: string): Promise<ChatWidget> {
    const widget = await this.prisma.chatWidget.findFirst({
      where: { id, clientId },
      include: {
        conversations: {
          take: 5,
          orderBy: {
            updatedAt: 'desc'
          },
          include: {
            _count: {
              select: {
                messages: true
              }
            }
          }
        }
      }
    });
    
    if (!widget) {
      throw new NotFoundException(`Widget with ID ${id} not found`);
    }
    
    return widget;
  }

  async update(id: string, updateWidgetDto: UpdateWidgetDto, clientId: string): Promise<ChatWidget> {
    await this.findOne(id, clientId);
    
    return this.prisma.chatWidget.update({
      where: { id },
      data: updateWidgetDto
    });
  }

  async remove(id: string, clientId: string): Promise<ChatWidget> {
    await this.findOne(id, clientId);
    
    return this.prisma.chatWidget.delete({
      where: { id }
    });
  }

  async generateEmbedCode(id: string, clientId: string): Promise<{ scriptCode: string; iframeCode: string }> {
    const widget = await this.findOne(id, clientId);
    
    // Generate script embed code
    const scriptCode = `<script src="https://upzento.com/chat/widget/${widget.id}" async></script>`;
    
    // Generate iframe embed code
    const iframeCode = `<iframe src="https://upzento.com/chat/widget/${widget.id}/iframe" width="300" height="500" frameborder="0"></iframe>`;
    
    return { scriptCode, iframeCode };
  }
} 