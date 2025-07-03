import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Deal } from '@prisma/client';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async create(createDealDto: CreateDealDto, clientId: string): Promise<Deal> {
    const { stageId, pipelineId, contactId, assignedToId } = createDealDto;
    
    // Verify pipeline belongs to the client
    const pipeline = await this.prisma.pipeline.findFirst({
      where: { id: pipelineId, clientId }
    });
    
    if (!pipeline) {
      throw new NotFoundException(`Pipeline with ID ${pipelineId} not found`);
    }
    
    // Verify stage belongs to the pipeline
    const stage = await this.prisma.stage.findFirst({
      where: { id: stageId, pipelineId }
    });
    
    if (!stage) {
      throw new NotFoundException(`Stage with ID ${stageId} not found in this pipeline`);
    }
    
    // If contact ID is provided, verify it belongs to the client
    if (contactId) {
      const contact = await this.prisma.contact.findFirst({
        where: { id: contactId, clientId }
      });
      
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${contactId} not found`);
      }
    }
    
    // If assignedToId is provided, verify it's a valid user with access to this client
    if (assignedToId) {
      const user = await this.prisma.user.findFirst({
        where: {
          id: assignedToId,
          OR: [
            { clientId },
            { agencyId: { equals: pipeline.client.agencyId } }
          ]
        }
      });
      
      if (!user) {
        throw new NotFoundException(`User with ID ${assignedToId} not found or doesn't have access`);
      }
    }
    
    // Create the deal
    return this.prisma.deal.create({
      data: {
        ...createDealDto,
        clientId
      },
      include: {
        stage: true,
        pipeline: true,
        contact: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
  }

  async findAll(
    clientId: string,
    filters?: {
      pipelineId?: string;
      stageId?: string;
      assignedToId?: string;
      contactId?: string;
      search?: string;
    }
  ): Promise<Deal[]> {
    const where: any = { clientId };
    
    if (filters) {
      if (filters.pipelineId) {
        where.pipelineId = filters.pipelineId;
      }
      
      if (filters.stageId) {
        where.stageId = filters.stageId;
      }
      
      if (filters.assignedToId) {
        where.assignedToId = filters.assignedToId;
      }
      
      if (filters.contactId) {
        where.contactId = filters.contactId;
      }
      
      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ];
      }
    }
    
    return this.prisma.deal.findMany({
      where,
      include: {
        stage: true,
        pipeline: true,
        contact: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  async findOne(id: string, clientId: string): Promise<Deal> {
    const deal = await this.prisma.deal.findFirst({
      where: { id, clientId },
      include: {
        stage: true,
        pipeline: true,
        contact: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
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
        },
        activities: {
          include: {
            assignedTo: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            dueDate: 'asc'
          }
        }
      }
    });
    
    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }
    
    return deal;
  }

  async update(id: string, updateDealDto: UpdateDealDto, clientId: string): Promise<Deal> {
    // First check if deal exists and belongs to client
    await this.findOne(id, clientId);
    
    const { stageId, pipelineId, contactId, assignedToId } = updateDealDto;
    
    // If pipeline ID is provided, verify it belongs to the client
    if (pipelineId) {
      const pipeline = await this.prisma.pipeline.findFirst({
        where: { id: pipelineId, clientId }
      });
      
      if (!pipeline) {
        throw new NotFoundException(`Pipeline with ID ${pipelineId} not found`);
      }
    }
    
    // If stage ID is provided, verify it belongs to the pipeline
    if (stageId) {
      const currentDeal = await this.prisma.deal.findUnique({
        where: { id },
        select: { pipelineId: true }
      });
      
      const pipelineToCheck = pipelineId || currentDeal.pipelineId;
      
      const stage = await this.prisma.stage.findFirst({
        where: { id: stageId, pipelineId: pipelineToCheck }
      });
      
      if (!stage) {
        throw new NotFoundException(`Stage with ID ${stageId} not found in this pipeline`);
      }
    }
    
    // If contact ID is provided, verify it belongs to the client
    if (contactId) {
      const contact = await this.prisma.contact.findFirst({
        where: { id: contactId, clientId }
      });
      
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${contactId} not found`);
      }
    }
    
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
    
    return this.prisma.deal.update({
      where: { id },
      data: updateDealDto,
      include: {
        stage: true,
        pipeline: true,
        contact: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
  }

  async remove(id: string, clientId: string): Promise<Deal> {
    // First check if deal exists and belongs to client
    await this.findOne(id, clientId);
    
    return this.prisma.deal.delete({
      where: { id }
    });
  }

  async moveToStage(id: string, stageId: string, clientId: string): Promise<Deal> {
    // First check if deal exists and belongs to client
    const deal = await this.findOne(id, clientId);
    
    // Verify stage belongs to the deal's pipeline
    const stage = await this.prisma.stage.findFirst({
      where: { id: stageId, pipelineId: deal.pipelineId }
    });
    
    if (!stage) {
      throw new NotFoundException(`Stage with ID ${stageId} not found in this pipeline`);
    }
    
    return this.prisma.deal.update({
      where: { id },
      data: { stageId },
      include: {
        stage: true,
        pipeline: true
      }
    });
  }

  async addActivity(
    dealId: string,
    type: string,
    description: string,
    dueDate: string | null,
    assignedToId: string | null,
    clientId: string
  ) {
    // First check if deal exists and belongs to client
    await this.findOne(dealId, clientId);
    
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
    
    return this.prisma.dealActivity.create({
      data: {
        dealId,
        type,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId
      }
    });
  }

  async completeActivity(activityId: string, clientId: string) {
    const activity = await this.prisma.dealActivity.findUnique({
      where: { id: activityId },
      include: { deal: true }
    });
    
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${activityId} not found`);
    }
    
    if (activity.deal.clientId !== clientId) {
      throw new NotFoundException(`Activity with ID ${activityId} not found`);
    }
    
    return this.prisma.dealActivity.update({
      where: { id: activityId },
      data: {
        completed: true,
        completedAt: new Date()
      }
    });
  }
} 