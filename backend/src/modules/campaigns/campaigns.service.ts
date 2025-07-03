import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCampaignDto, CampaignStatus } from './dto/create-campaign.dto';
import { CreateCampaignMessageDto, MessageStatus } from './dto/create-campaign-message.dto';
import { CreateCampaignSegmentDto } from './dto/create-campaign-segment.dto';
import { CreateCampaignTemplateDto } from './dto/create-campaign-template.dto';
import { CreateAutomationWorkflowDto } from './dto/create-automation-workflow.dto';
import { CreateABTestDto } from './dto/create-ab-test.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  // Campaign methods
  async createCampaign(createCampaignDto: CreateCampaignDto) {
    const { segmentIds, ...campaignData } = createCampaignDto;

    // Create the campaign
    const campaign = await this.prisma.campaign.create({
      data: {
        ...campaignData,
        status: campaignData.status || CampaignStatus.DRAFT,
      },
    });

    // Create analytics record for the campaign
    await this.prisma.campaignAnalytics.create({
      data: {
        campaignId: campaign.id,
        updatedAt: new Date(),
      },
    });

    // Add segments if provided
    if (segmentIds && segmentIds.length > 0) {
      await this.prisma.campaignToSegment.createMany({
        data: segmentIds.map(segmentId => ({
          campaignId: campaign.id,
          segmentId,
        })),
      });
    }

    return this.getCampaign(campaign.id);
  }

  async getAllCampaigns(
    clientId: string,
    options?: {
      skip?: number;
      take?: number;
      status?: CampaignStatus;
      type?: string;
      search?: string;
    }
  ) {
    const where: Prisma.CampaignWhereInput = { clientId };
    
    if (options?.status) {
      where.status = options.status;
    }
    
    if (options?.type) {
      where.type = options.type;
    }
    
    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }
    
    const [campaigns, totalCount] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip: options?.skip,
        take: options?.take || 10,
        include: {
          analytics: true,
          segments: {
            include: {
              segment: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      this.prisma.campaign.count({ where }),
    ]);
    
    return {
      data: campaigns,
      meta: {
        total: totalCount,
        skip: options?.skip || 0,
        take: options?.take || 10,
      },
    };
  }

  async getCampaign(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        analytics: true,
        segments: {
          include: {
            segment: true,
          },
        },
      },
    });
    
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    
    return campaign;
  }

  async updateCampaign(id: string, updateCampaignDto: Partial<CreateCampaignDto>) {
    const { segmentIds, ...campaignData } = updateCampaignDto;
    
    // Check if campaign exists
    await this.getCampaign(id);
    
    // Update campaign
    const updatedCampaign = await this.prisma.campaign.update({
      where: { id },
      data: campaignData,
    });
    
    // Update segments if provided
    if (segmentIds) {
      // Remove existing segments
      await this.prisma.campaignToSegment.deleteMany({
        where: { campaignId: id },
      });
      
      // Add new segments
      if (segmentIds.length > 0) {
        await this.prisma.campaignToSegment.createMany({
          data: segmentIds.map(segmentId => ({
            campaignId: id,
            segmentId,
          })),
        });
      }
    }
    
    return this.getCampaign(id);
  }

  async deleteCampaign(id: string) {
    // Check if campaign exists
    await this.getCampaign(id);
    
    await this.prisma.campaign.delete({
      where: { id },
    });
    
    return { success: true, message: 'Campaign deleted successfully' };
  }

  async updateCampaignStatus(id: string, status: CampaignStatus) {
    // Check if campaign exists
    await this.getCampaign(id);
    
    // Update status
    const updatedCampaign = await this.prisma.campaign.update({
      where: { id },
      data: { 
        status,
        sentAt: status === CampaignStatus.SENT ? new Date() : undefined 
      },
    });
    
    return updatedCampaign;
  }

  // Campaign Message methods
  async createCampaignMessage(createMessageDto: CreateCampaignMessageDto) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id: 'placeholder', ...createMessageDto };
  }

  async getCampaignMessage(id: string) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id, content: 'Placeholder message content' };
  }

  async updateCampaignMessage(id: string, updateMessageDto: Partial<CreateCampaignMessageDto>) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id, ...updateMessageDto };
  }

  async deleteCampaignMessage(id: string) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { success: true, message: 'Campaign message deleted successfully' };
  }

  // Campaign Segment methods
  async createCampaignSegment(createSegmentDto: CreateCampaignSegmentDto) {
    const segment = await this.prisma.campaignSegment.create({
      data: createSegmentDto,
    });
    
    return segment;
  }

  async getAllCampaignSegments(clientId: string) {
    const segments = await this.prisma.campaignSegment.findMany({
      where: { clientId },
      include: {
        _count: {
          select: {
            campaigns: true,
          },
        },
      },
    });
    
    return segments;
  }

  async getCampaignSegment(id: string) {
    const segment = await this.prisma.campaignSegment.findUnique({
      where: { id },
      include: {
        campaigns: {
          include: {
            campaign: true,
          },
        },
      },
    });
    
    if (!segment) {
      throw new NotFoundException(`Campaign segment with ID ${id} not found`);
    }
    
    return segment;
  }

  async updateCampaignSegment(id: string, updateSegmentDto: Partial<CreateCampaignSegmentDto>) {
    // Check if segment exists
    await this.getCampaignSegment(id);
    
    const updatedSegment = await this.prisma.campaignSegment.update({
      where: { id },
      data: updateSegmentDto,
    });
    
    return updatedSegment;
  }

  async deleteCampaignSegment(id: string) {
    // Check if segment exists
    await this.getCampaignSegment(id);
    
    await this.prisma.campaignSegment.delete({
      where: { id },
    });
    
    return { success: true, message: 'Campaign segment deleted successfully' };
  }

  // Campaign Template methods
  async createCampaignTemplate(createTemplateDto: CreateCampaignTemplateDto) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id: 'placeholder', ...createTemplateDto };
  }

  async getAllCampaignTemplates(clientId: string, type?: string) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return [{ id: 'placeholder', name: 'Sample Template', clientId, type: type || 'email' }];
  }

  async getCampaignTemplate(id: string) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id, name: 'Sample Template' };
  }

  async updateCampaignTemplate(id: string, updateTemplateDto: Partial<CreateCampaignTemplateDto>) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id, ...updateTemplateDto };
  }

  async deleteCampaignTemplate(id: string) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { success: true, message: 'Campaign template deleted successfully' };
  }

  // Automation Workflow methods
  async createAutomationWorkflow(createWorkflowDto: CreateAutomationWorkflowDto) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id: 'placeholder', ...createWorkflowDto };
  }

  async getAllAutomationWorkflows(clientId: string) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return [{ id: 'placeholder', name: 'Sample Workflow', clientId }];
  }

  async getAutomationWorkflow(id: string) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id, name: 'Sample Workflow' };
  }

  async updateAutomationWorkflow(id: string, updateWorkflowDto: Partial<CreateAutomationWorkflowDto>) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id, ...updateWorkflowDto };
  }

  async deleteAutomationWorkflow(id: string) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { success: true, message: 'Automation workflow deleted successfully' };
  }

  async toggleAutomationWorkflow(id: string, isActive: boolean) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id, isActive };
  }

  // A/B Test methods
  async createABTest(createABTestDto: CreateABTestDto) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id: 'placeholder', ...createABTestDto };
  }

  async getABTest(id: string) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id, name: 'Sample A/B Test' };
  }

  async updateABTest(id: string, updateABTestDto: Partial<CreateABTestDto>) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { id, ...updateABTestDto };
  }

  async deleteABTest(id: string) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { success: true, message: 'A/B test deleted successfully' };
  }

  // Campaign Analytics methods
  async updateCampaignAnalytics(id: string, analyticsData: any) {
    // Check if campaign exists
    await this.getCampaign(id);
    
    // Get existing analytics
    const existingAnalytics = await this.prisma.campaignAnalytics.findUnique({
      where: { campaignId: id },
    });
    
    if (!existingAnalytics) {
      throw new NotFoundException(`Analytics for campaign with ID ${id} not found`);
    }
    
    // Update analytics
    const updatedAnalytics = await this.prisma.campaignAnalytics.update({
      where: { id: existingAnalytics.id },
      data: {
        ...analyticsData,
        updatedAt: new Date(),
      },
    });
    
    return updatedAnalytics;
  }

  // Recipient Event methods
  async trackRecipientEvent(id: string, eventData: any) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { success: true, message: 'Event tracked successfully' };
  }

  // Deal Attribution methods
  async attributeDealToCampaign(dealId: string, campaignId: string) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return { success: true, message: 'Deal attributed to campaign successfully' };
  }

  async getDealsAttributedToCampaign(id: string) {
    // Implementation depends on specific requirements
    // This is a placeholder implementation
    return [{ id: 'placeholder', name: 'Sample Deal', value: 1000 }];
  }
}
