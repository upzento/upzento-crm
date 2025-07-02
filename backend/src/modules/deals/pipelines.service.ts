import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Pipeline } from '@prisma/client';
import { CreatePipelineDto } from './dto/create-pipeline.dto';

@Injectable()
export class PipelinesService {
  constructor(private prisma: PrismaService) {}

  async create(createPipelineDto: CreatePipelineDto, clientId: string): Promise<Pipeline> {
    // Create the pipeline
    const pipeline = await this.prisma.pipeline.create({
      data: {
        ...createPipelineDto,
        clientId,
        // Create default stages for the pipeline
        stages: {
          create: [
            { name: 'Lead', order: 0, color: '#3498db' },
            { name: 'Qualified', order: 1, color: '#2ecc71' },
            { name: 'Proposal', order: 2, color: '#f39c12' },
            { name: 'Negotiation', order: 3, color: '#9b59b6' },
            { name: 'Closed Won', order: 4, color: '#27ae60' },
            { name: 'Closed Lost', order: 5, color: '#e74c3c' }
          ]
        }
      },
      include: {
        stages: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    
    return pipeline;
  }

  async findAll(clientId: string): Promise<Pipeline[]> {
    return this.prisma.pipeline.findMany({
      where: { clientId },
      include: {
        stages: {
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            deals: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string, clientId: string): Promise<Pipeline> {
    const pipeline = await this.prisma.pipeline.findFirst({
      where: { id, clientId },
      include: {
        stages: {
          orderBy: {
            order: 'asc'
          },
          include: {
            _count: {
              select: {
                deals: true
              }
            }
          }
        },
        deals: {
          include: {
            stage: true,
            contact: true,
            assignedTo: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    
    if (!pipeline) {
      throw new NotFoundException(`Pipeline with ID ${id} not found`);
    }
    
    return pipeline;
  }

  async update(id: string, updatePipelineDto: any, clientId: string): Promise<Pipeline> {
    // First check if pipeline exists and belongs to client
    await this.findOne(id, clientId);
    
    return this.prisma.pipeline.update({
      where: { id },
      data: updatePipelineDto,
      include: {
        stages: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
  }

  async remove(id: string, clientId: string): Promise<Pipeline> {
    // First check if pipeline exists and belongs to client
    await this.findOne(id, clientId);
    
    // Check if pipeline has any deals
    const dealCount = await this.prisma.deal.count({
      where: { pipelineId: id }
    });
    
    if (dealCount > 0) {
      throw new NotFoundException(`Cannot delete pipeline with active deals`);
    }
    
    return this.prisma.pipeline.delete({
      where: { id }
    });
  }
} 