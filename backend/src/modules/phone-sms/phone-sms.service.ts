import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePhoneNumberDto } from './dto/create-phone-number.dto';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';
import { CreateCallDto } from './dto/create-call.dto';
import { CreateSmsMessageDto } from './dto/create-sms-message.dto';
import { CreateSmsConversationDto } from './dto/create-sms-conversation.dto';
import { CreateSmsTemplateDto } from './dto/create-sms-template.dto';
import { CreateBulkSmsCampaignDto } from './dto/create-bulk-sms-campaign.dto';

@Injectable()
export class PhoneSmsService {
  constructor(private prisma: PrismaService) {}

  // Phone Number Management
  async createPhoneNumber(createPhoneNumberDto: CreatePhoneNumberDto) {
    return this.prisma.phoneNumber.create({
      data: {
        number: createPhoneNumberDto.number,
        name: createPhoneNumberDto.name,
        provider: createPhoneNumberDto.provider,
        type: createPhoneNumberDto.type,
        status: createPhoneNumberDto.status || 'ACTIVE',
        client: {
          connect: { id: createPhoneNumberDto.clientId },
        },
      },
    });
  }

  async findAllPhoneNumbers(clientId: string) {
    return this.prisma.phoneNumber.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPhoneNumberById(id: string, clientId: string) {
    const phoneNumber = await this.prisma.phoneNumber.findFirst({
      where: { id, clientId },
    });

    if (!phoneNumber) {
      throw new NotFoundException(`Phone number with ID ${id} not found`);
    }

    return phoneNumber;
  }

  async updatePhoneNumber(id: string, clientId: string, updatePhoneNumberDto: UpdatePhoneNumberDto) {
    await this.findPhoneNumberById(id, clientId);

    return this.prisma.phoneNumber.update({
      where: { id },
      data: {
        name: updatePhoneNumberDto.name,
        status: updatePhoneNumberDto.status,
      },
    });
  }

  async deletePhoneNumber(id: string, clientId: string) {
    await this.findPhoneNumberById(id, clientId);

    return this.prisma.phoneNumber.delete({
      where: { id },
    });
  }

  // Call Management
  async createCall(createCallDto: CreateCallDto) {
    return this.prisma.call.create({
      data: {
        direction: createCallDto.direction,
        status: createCallDto.status,
        from: createCallDto.from,
        to: createCallDto.to,
        duration: createCallDto.duration,
        startTime: new Date(createCallDto.startTime),
        endTime: createCallDto.endTime ? new Date(createCallDto.endTime) : undefined,
        recordingUrl: createCallDto.recordingUrl,
        notes: createCallDto.notes,
        phoneNumber: {
          connect: { id: createCallDto.phoneNumberId },
        },
        client: {
          connect: { id: createCallDto.clientId },
        },
        ...(createCallDto.contactId && {
          contact: {
            connect: { id: createCallDto.contactId },
          },
        }),
        ...(createCallDto.dealId && {
          deal: {
            connect: { id: createCallDto.dealId },
          },
        }),
        ...(createCallDto.appointmentId && {
          appointment: {
            connect: { id: createCallDto.appointmentId },
          },
        }),
        ...(createCallDto.assignedToId && {
          assignedTo: {
            connect: { id: createCallDto.assignedToId },
          },
        }),
      },
    });
  }

  async findAllCalls(clientId: string, filters?: any) {
    const where: any = { clientId };

    // Apply filters if provided
    if (filters) {
      if (filters.direction) where.direction = filters.direction;
      if (filters.status) where.status = filters.status;
      if (filters.contactId) where.contactId = filters.contactId;
      if (filters.dealId) where.dealId = filters.dealId;
      if (filters.appointmentId) where.appointmentId = filters.appointmentId;
      if (filters.assignedToId) where.assignedToId = filters.assignedToId;
      if (filters.phoneNumberId) where.phoneNumberId = filters.phoneNumberId;
      
      // Date range filter
      if (filters.startDate && filters.endDate) {
        where.startTime = {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate),
        };
      }
    }

    return this.prisma.call.findMany({
      where,
      include: {
        phoneNumber: true,
        contact: true,
        deal: true,
        appointment: true,
        assignedTo: true,
        tasks: true,
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async findCallById(id: string, clientId: string) {
    const call = await this.prisma.call.findFirst({
      where: { id, clientId },
      include: {
        phoneNumber: true,
        contact: true,
        deal: true,
        appointment: true,
        assignedTo: true,
        tasks: true,
      },
    });

    if (!call) {
      throw new NotFoundException(`Call with ID ${id} not found`);
    }

    return call;
  }

  async updateCallStatus(id: string, clientId: string, status: string) {
    await this.findCallById(id, clientId);

    return this.prisma.call.update({
      where: { id },
      data: { status },
    });
  }

  async updateCallNotes(id: string, clientId: string, notes: string) {
    await this.findCallById(id, clientId);

    return this.prisma.call.update({
      where: { id },
      data: { notes },
    });
  }

  async assignCall(id: string, clientId: string, userId: string) {
    await this.findCallById(id, clientId);

    return this.prisma.call.update({
      where: { id },
      data: {
        assignedTo: {
          connect: { id: userId },
        },
      },
      include: {
        assignedTo: true,
      },
    });
  }

  // SMS Conversation Management
  async createSmsConversation(createSmsConversationDto: CreateSmsConversationDto) {
    return this.prisma.sMSConversation.create({
      data: {
        status: createSmsConversationDto.status || 'ACTIVE',
        client: {
          connect: { id: createSmsConversationDto.clientId },
        },
        ...(createSmsConversationDto.contactId && {
          contact: {
            connect: { id: createSmsConversationDto.contactId },
          },
        }),
        ...(createSmsConversationDto.assignedToId && {
          assignedTo: {
            connect: { id: createSmsConversationDto.assignedToId },
          },
        }),
      },
    });
  }

  async findAllSmsConversations(clientId: string, filters?: any) {
    const where: any = { clientId };

    // Apply filters if provided
    if (filters) {
      if (filters.status) where.status = filters.status;
      if (filters.contactId) where.contactId = filters.contactId;
      if (filters.assignedToId) where.assignedToId = filters.assignedToId;
    }

    return this.prisma.sMSConversation.findMany({
      where,
      include: {
        contact: true,
        assignedTo: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findSmsConversationById(id: string, clientId: string) {
    const conversation = await this.prisma.sMSConversation.findFirst({
      where: { id, clientId },
      include: {
        contact: true,
        assignedTo: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException(`SMS conversation with ID ${id} not found`);
    }

    return conversation;
  }

  async updateSmsConversationStatus(id: string, clientId: string, status: string) {
    await this.findSmsConversationById(id, clientId);

    return this.prisma.sMSConversation.update({
      where: { id },
      data: { status },
    });
  }

  async assignSmsConversation(id: string, clientId: string, userId: string) {
    await this.findSmsConversationById(id, clientId);

    return this.prisma.sMSConversation.update({
      where: { id },
      data: {
        assignedTo: {
          connect: { id: userId },
        },
      },
      include: {
        assignedTo: true,
      },
    });
  }

  // SMS Message Management
  async createSmsMessage(createSmsMessageDto: CreateSmsMessageDto) {
    // Check if conversation exists
    const conversation = await this.prisma.sMSConversation.findFirst({
      where: {
        id: createSmsMessageDto.conversationId,
        clientId: createSmsMessageDto.clientId,
      },
    });

    if (!conversation) {
      throw new NotFoundException(`SMS conversation with ID ${createSmsMessageDto.conversationId} not found`);
    }

    // Create the message
    const message = await this.prisma.sMSMessage.create({
      data: {
        direction: createSmsMessageDto.direction,
        status: createSmsMessageDto.status,
        from: createSmsMessageDto.from,
        to: createSmsMessageDto.to,
        body: createSmsMessageDto.body,
        mediaUrls: createSmsMessageDto.mediaUrls || [],
        phoneNumber: {
          connect: { id: createSmsMessageDto.phoneNumberId },
        },
        client: {
          connect: { id: createSmsMessageDto.clientId },
        },
        conversation: {
          connect: { id: createSmsMessageDto.conversationId },
        },
        ...(createSmsMessageDto.contactId && {
          contact: {
            connect: { id: createSmsMessageDto.contactId },
          },
        }),
        ...(createSmsMessageDto.dealId && {
          deal: {
            connect: { id: createSmsMessageDto.dealId },
          },
        }),
        ...(createSmsMessageDto.appointmentId && {
          appointment: {
            connect: { id: createSmsMessageDto.appointmentId },
          },
        }),
      },
    });

    // Update conversation's updatedAt timestamp
    await this.prisma.sMSConversation.update({
      where: { id: createSmsMessageDto.conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async findAllSmsMessages(conversationId: string, clientId: string) {
    // Check if conversation exists
    await this.findSmsConversationById(conversationId, clientId);

    return this.prisma.sMSMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateSmsMessageStatus(id: string, clientId: string, status: string) {
    const message = await this.prisma.sMSMessage.findFirst({
      where: { id, clientId },
    });

    if (!message) {
      throw new NotFoundException(`SMS message with ID ${id} not found`);
    }

    return this.prisma.sMSMessage.update({
      where: { id },
      data: { status },
    });
  }

  // SMS Template Management
  async createSmsTemplate(createSmsTemplateDto: CreateSmsTemplateDto) {
    return this.prisma.sMSTemplate.create({
      data: {
        name: createSmsTemplateDto.name,
        body: createSmsTemplateDto.body,
        category: createSmsTemplateDto.category,
        client: {
          connect: { id: createSmsTemplateDto.clientId },
        },
      },
    });
  }

  async findAllSmsTemplates(clientId: string, category?: string) {
    const where: any = { clientId };
    if (category) where.category = category;

    return this.prisma.sMSTemplate.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findSmsTemplateById(id: string, clientId: string) {
    const template = await this.prisma.sMSTemplate.findFirst({
      where: { id, clientId },
    });

    if (!template) {
      throw new NotFoundException(`SMS template with ID ${id} not found`);
    }

    return template;
  }

  async updateSmsTemplate(id: string, clientId: string, updateData: Partial<CreateSmsTemplateDto>) {
    await this.findSmsTemplateById(id, clientId);

    return this.prisma.sMSTemplate.update({
      where: { id },
      data: {
        name: updateData.name,
        body: updateData.body,
        category: updateData.category,
      },
    });
  }

  async deleteSmsTemplate(id: string, clientId: string) {
    await this.findSmsTemplateById(id, clientId);

    return this.prisma.sMSTemplate.delete({
      where: { id },
    });
  }

  // Bulk SMS Campaign Management
  async createBulkSmsCampaign(createBulkSmsCampaignDto: CreateBulkSmsCampaignDto) {
    const { recipients, ...campaignData } = createBulkSmsCampaignDto;

    // Create campaign
    const campaign = await this.prisma.bulkSMSCampaign.create({
      data: {
        name: campaignData.name,
        message: campaignData.message,
        status: campaignData.status || 'DRAFT',
        scheduledAt: campaignData.scheduledAt ? new Date(campaignData.scheduledAt) : undefined,
        client: {
          connect: { id: campaignData.clientId },
        },
        ...(campaignData.createdById && {
          createdBy: {
            connect: { id: campaignData.createdById },
          },
        }),
      },
    });

    // Create recipients
    if (recipients && recipients.length > 0) {
      await Promise.all(
        recipients.map(recipient =>
          this.prisma.bulkSMSRecipient.create({
            data: {
              phoneNumber: recipient.phoneNumber,
              status: 'PENDING',
              campaign: {
                connect: { id: campaign.id },
              },
              ...(recipient.contactId && {
                contact: {
                  connect: { id: recipient.contactId },
                },
              }),
            },
          }),
        ),
      );
    }

    return this.findBulkSmsCampaignById(campaign.id, campaignData.clientId);
  }

  async findAllBulkSmsCampaigns(clientId: string, status?: string) {
    const where: any = { clientId };
    if (status) where.status = status;

    return this.prisma.bulkSMSCampaign.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            recipients: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBulkSmsCampaignById(id: string, clientId: string) {
    const campaign = await this.prisma.bulkSMSCampaign.findFirst({
      where: { id, clientId },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        recipients: {
          include: {
            contact: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Bulk SMS campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async updateBulkSmsCampaignStatus(id: string, clientId: string, status: string) {
    await this.findBulkSmsCampaignById(id, clientId);

    return this.prisma.bulkSMSCampaign.update({
      where: { id },
      data: { status },
    });
  }

  async scheduleBulkSmsCampaign(id: string, clientId: string, scheduledAt: string) {
    await this.findBulkSmsCampaignById(id, clientId);

    return this.prisma.bulkSMSCampaign.update({
      where: { id },
      data: {
        status: 'SCHEDULED',
        scheduledAt: new Date(scheduledAt),
      },
    });
  }

  async deleteBulkSmsCampaign(id: string, clientId: string) {
    await this.findBulkSmsCampaignById(id, clientId);

    return this.prisma.bulkSMSCampaign.delete({
      where: { id },
    });
  }

  // Add recipients to campaign
  async addRecipientsToCampaign(campaignId: string, clientId: string, recipients: any[]) {
    await this.findBulkSmsCampaignById(campaignId, clientId);

    const createdRecipients = await Promise.all(
      recipients.map(recipient =>
        this.prisma.bulkSMSRecipient.create({
          data: {
            phoneNumber: recipient.phoneNumber,
            status: 'PENDING',
            campaign: {
              connect: { id: campaignId },
            },
            ...(recipient.contactId && {
              contact: {
                connect: { id: recipient.contactId },
              },
            }),
          },
        }),
      ),
    );

    return createdRecipients;
  }

  // Remove recipient from campaign
  async removeRecipientFromCampaign(recipientId: string, campaignId: string, clientId: string) {
    // Check if campaign exists
    await this.findBulkSmsCampaignById(campaignId, clientId);

    // Check if recipient exists
    const recipient = await this.prisma.bulkSMSRecipient.findFirst({
      where: {
        id: recipientId,
        campaignId,
      },
    });

    if (!recipient) {
      throw new NotFoundException(`Recipient with ID ${recipientId} not found in campaign ${campaignId}`);
    }

    return this.prisma.bulkSMSRecipient.delete({
      where: { id: recipientId },
    });
  }
} 