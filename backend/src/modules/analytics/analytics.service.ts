import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateIntegrationDto, UpdateIntegrationDto, IntegrationType, IntegrationStatus } from './dto/create-integration.dto';
import { CreateDashboardDto, UpdateDashboardDto } from './dto/create-dashboard.dto';
import { CreateWidgetDto, WidgetType } from './dto/create-widget.dto';
import { CreateDatasetDto, UpdateDatasetDto } from './dto/create-dataset.dto';
import { CreateReportDto, ReportFormat } from './dto/create-report.dto';
import { Prisma } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Integration Management
  async createIntegration(createIntegrationDto: CreateIntegrationDto, clientId: string, userId: string) {
    // Encrypt credentials before storing
    const encryptedCredentials = this.encryptCredentials(createIntegrationDto.credentials);
    
    // Validate client access
    await this.validateClientAccess(clientId, userId);
    
    const integration = await this.prisma.analyticsIntegration.create({
      data: {
        name: createIntegrationDto.name,
        type: createIntegrationDto.type,
        credentials: encryptedCredentials,
        config: createIntegrationDto.config || {},
        syncFrequency: createIntegrationDto.syncFrequency || 'daily',
        status: IntegrationStatus.DISCONNECTED,
        clientId,
      },
    });

    // Test the integration connection
    await this.testIntegrationConnection(integration.id);

    return integration;
  }

  async getIntegrations(clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    return this.prisma.analyticsIntegration.findMany({
      where: { clientId },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        lastSync: true,
        syncFrequency: true,
        errorMessage: true,
        config: true,
        createdAt: true,
        updatedAt: true,
        // Don't return credentials for security
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getIntegration(id: string, clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    const integration = await this.prisma.analyticsIntegration.findFirst({
      where: { id, clientId },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        lastSync: true,
        syncFrequency: true,
        errorMessage: true,
        config: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return integration;
  }

  async updateIntegration(id: string, updateIntegrationDto: UpdateIntegrationDto, clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    const integration = await this.prisma.analyticsIntegration.findFirst({
      where: { id, clientId },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    const updateData: any = {
      ...updateIntegrationDto,
      updatedAt: new Date(),
    };

    // Encrypt new credentials if provided
    if (updateIntegrationDto.credentials) {
      updateData.credentials = this.encryptCredentials(updateIntegrationDto.credentials);
    }

    const updatedIntegration = await this.prisma.analyticsIntegration.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        lastSync: true,
        syncFrequency: true,
        errorMessage: true,
        config: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Test connection if credentials were updated
    if (updateIntegrationDto.credentials) {
      await this.testIntegrationConnection(id);
    }

    return updatedIntegration;
  }

  async deleteIntegration(id: string, clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    const integration = await this.prisma.analyticsIntegration.findFirst({
      where: { id, clientId },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    // Delete associated datasets first
    await this.prisma.analyticsDataset.deleteMany({
      where: { integrationId: id },
    });

    // Delete the integration
    await this.prisma.analyticsIntegration.delete({
      where: { id },
    });

    return { message: 'Integration deleted successfully' };
  }

  async syncIntegration(id: string, clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    const integration = await this.prisma.analyticsIntegration.findFirst({
      where: { id, clientId },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    // Update status to syncing
    await this.prisma.analyticsIntegration.update({
      where: { id },
      data: { status: IntegrationStatus.SYNCING },
    });

    try {
      // Perform the actual sync based on integration type
      await this.performIntegrationSync(integration);
      
      // Update status to connected and lastSync
      await this.prisma.analyticsIntegration.update({
        where: { id },
        data: { 
          status: IntegrationStatus.CONNECTED,
          lastSync: new Date(),
          errorMessage: null,
        },
      });

      return { message: 'Sync completed successfully' };
    } catch (error) {
      // Update status to error
      await this.prisma.analyticsIntegration.update({
        where: { id },
        data: { 
          status: IntegrationStatus.ERROR,
          errorMessage: error.message,
        },
      });

      throw new BadRequestException(`Sync failed: ${error.message}`);
    }
  }

  // Dashboard Management
  async createDashboard(createDashboardDto: CreateDashboardDto, clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    return this.prisma.analyticsDashboard.create({
      data: {
        name: createDashboardDto.name,
        description: createDashboardDto.description,
        layout: createDashboardDto.layout || {},
        isTemplate: createDashboardDto.isTemplate || false,
        isDefault: createDashboardDto.isDefault || false,
        isPublic: createDashboardDto.isPublic || false,
        clientId,
        createdById: userId,
      },
      include: {
        widgets: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async getDashboards(clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    return this.prisma.analyticsDashboard.findMany({
      where: { clientId },
      include: {
        widgets: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { widgets: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDashboard(id: string, clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    const dashboard = await this.prisma.analyticsDashboard.findFirst({
      where: { id, clientId },
      include: {
        widgets: {
          orderBy: { createdAt: 'asc' },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!dashboard) {
      throw new NotFoundException('Dashboard not found');
    }

    return dashboard;
  }

  async updateDashboard(id: string, updateDashboardDto: UpdateDashboardDto, clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    const dashboard = await this.prisma.analyticsDashboard.findFirst({
      where: { id, clientId },
    });

    if (!dashboard) {
      throw new NotFoundException('Dashboard not found');
    }

    return this.prisma.analyticsDashboard.update({
      where: { id },
      data: updateDashboardDto,
      include: {
        widgets: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async deleteDashboard(id: string, clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    const dashboard = await this.prisma.analyticsDashboard.findFirst({
      where: { id, clientId },
    });

    if (!dashboard) {
      throw new NotFoundException('Dashboard not found');
    }

    // Delete widgets first
    await this.prisma.analyticsWidget.deleteMany({
      where: { dashboardId: id },
    });

    // Delete dashboard shares
    await this.prisma.dashboardShare.deleteMany({
      where: { dashboardId: id },
    });

    // Delete the dashboard
    await this.prisma.analyticsDashboard.delete({
      where: { id },
    });

    return { message: 'Dashboard deleted successfully' };
  }

  // Dataset Management
  async createDataset(createDatasetDto: CreateDatasetDto, clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    // Verify integration belongs to the client
    const integration = await this.prisma.analyticsIntegration.findFirst({
      where: { id: createDatasetDto.integrationId, clientId },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return this.prisma.analyticsDataset.create({
      data: {
        name: createDatasetDto.name,
        description: createDatasetDto.description,
        dataType: createDatasetDto.dataType,
        query: createDatasetDto.query,
        integrationId: createDatasetDto.integrationId,
        clientId,
      },
    });
  }

  async getDatasets(clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    return this.prisma.analyticsDataset.findMany({
      where: { clientId },
      include: {
        integration: {
          select: { id: true, name: true, type: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Analytics Goals
  async createGoal(data: any, clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    return this.prisma.analyticsGoal.create({
      data: {
        ...data,
        clientId,
      },
    });
  }

  async getGoals(clientId: string, userId: string) {
    await this.validateClientAccess(clientId, userId);
    
    return this.prisma.analyticsGoal.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Private helper methods
  private async validateClientAccess(clientId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { client: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user belongs to the client or has higher permissions
    if (user.clientId !== clientId && !['SUPER_ADMIN', 'ADMIN', 'AGENCY_OWNER', 'AGENCY_ADMIN'].includes(user.role)) {
      throw new ForbiddenException('Access denied to this client');
    }
  }

  private encryptCredentials(credentials: Record<string, any>): Record<string, any> {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
    
    const encrypted: Record<string, any> = {};
    
    for (const [field, value] of Object.entries(credentials)) {
      if (typeof value === 'string') {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher(algorithm, key);
        
        let encryptedValue = cipher.update(value, 'utf8', 'hex');
        encryptedValue += cipher.final('hex');
        
        encrypted[field] = {
          encrypted: encryptedValue,
          iv: iv.toString('hex'),
        };
      } else {
        encrypted[field] = value;
      }
    }
    
    return encrypted;
  }

  private decryptCredentials(encryptedCredentials: Record<string, any>): Record<string, any> {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
    
    const decrypted: Record<string, any> = {};
    
    for (const [field, value] of Object.entries(encryptedCredentials)) {
      if (typeof value === 'object' && value.encrypted && value.iv) {
        const decipher = crypto.createDecipher(algorithm, key);
        
        let decryptedValue = decipher.update(value.encrypted, 'hex', 'utf8');
        decryptedValue += decipher.final('utf8');
        
        decrypted[field] = decryptedValue;
      } else {
        decrypted[field] = value;
      }
    }
    
    return decrypted;
  }

  private async testIntegrationConnection(integrationId: string) {
    const integration = await this.prisma.analyticsIntegration.findUnique({
      where: { id: integrationId },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    try {
      const credentials = this.decryptCredentials(integration.credentials as Record<string, any>);
      
      // Test connection based on integration type
      switch (integration.type) {
        case IntegrationType.GOOGLE_ANALYTICS:
          await this.testGoogleAnalyticsConnection(credentials);
          break;
        case IntegrationType.META_ADS:
          await this.testMetaAdsConnection(credentials);
          break;
        case IntegrationType.LINKEDIN_ADS:
          await this.testLinkedInAdsConnection(credentials);
          break;
        default:
          throw new BadRequestException('Unsupported integration type');
      }

      // Update status to connected
      await this.prisma.analyticsIntegration.update({
        where: { id: integrationId },
        data: { 
          status: IntegrationStatus.CONNECTED,
          errorMessage: null,
        },
      });
    } catch (error) {
      // Update status to error
      await this.prisma.analyticsIntegration.update({
        where: { id: integrationId },
        data: { 
          status: IntegrationStatus.ERROR,
          errorMessage: error.message,
        },
      });
      
      throw error;
    }
  }

  private async testGoogleAnalyticsConnection(credentials: any) {
    // Mock Google Analytics API test
    // In real implementation, use Google Analytics Reporting API
    if (!credentials.propertyId || !credentials.accessToken) {
      throw new BadRequestException('Invalid Google Analytics credentials');
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock success/failure
    if (credentials.propertyId.includes('invalid')) {
      throw new BadRequestException('Invalid property ID');
    }
  }

  private async testMetaAdsConnection(credentials: any) {
    // Mock Meta Ads API test
    // In real implementation, use Facebook Marketing API
    if (!credentials.adAccountId || !credentials.accessToken) {
      throw new BadRequestException('Invalid Meta Ads credentials');
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock success/failure
    if (credentials.accessToken.includes('expired')) {
      throw new BadRequestException('Access token expired');
    }
  }

  private async testLinkedInAdsConnection(credentials: any) {
    // Mock LinkedIn Ads API test
    // In real implementation, use LinkedIn Marketing API
    if (!credentials.adAccountId || !credentials.accessToken) {
      throw new BadRequestException('Invalid LinkedIn Ads credentials');
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock success/failure
    if (credentials.clientId.includes('invalid')) {
      throw new BadRequestException('Invalid client ID');
    }
  }

  private async performIntegrationSync(integration: any) {
    const credentials = this.decryptCredentials(integration.credentials as Record<string, any>);
    
    // Perform sync based on integration type
    switch (integration.type) {
      case IntegrationType.GOOGLE_ANALYTICS:
        await this.syncGoogleAnalyticsData(integration, credentials);
        break;
      case IntegrationType.META_ADS:
        await this.syncMetaAdsData(integration, credentials);
        break;
      case IntegrationType.LINKEDIN_ADS:
        await this.syncLinkedInAdsData(integration, credentials);
        break;
      default:
        throw new BadRequestException('Unsupported integration type');
    }
  }

  private async syncGoogleAnalyticsData(integration: any, credentials: any) {
    // Mock Google Analytics data sync
    // In real implementation, fetch data from Google Analytics Reporting API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create or update datasets with fetched data
    const mockData = {
      sessions: Math.floor(Math.random() * 10000),
      users: Math.floor(Math.random() * 8000),
      pageviews: Math.floor(Math.random() * 50000),
      bounceRate: Math.random() * 0.8,
    };

    await this.prisma.analyticsDataset.upsert({
      where: { 
        integrationId: integration.id,
        name: 'Google Analytics Overview',
      },
      update: {
        cachedData: mockData,
        lastRefresh: new Date(),
      },
      create: {
        name: 'Google Analytics Overview',
        description: 'General website analytics data',
        dataType: 'time_series',
        query: { metrics: ['sessions', 'users', 'pageviews', 'bounceRate'] },
        cachedData: mockData,
        lastRefresh: new Date(),
        integrationId: integration.id,
        clientId: integration.clientId,
      },
    });
  }

  private async syncMetaAdsData(integration: any, credentials: any) {
    // Mock Meta Ads data sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockData = {
      impressions: Math.floor(Math.random() * 100000),
      clicks: Math.floor(Math.random() * 5000),
      spend: Math.floor(Math.random() * 1000),
      ctr: Math.random() * 0.05,
    };

    await this.prisma.analyticsDataset.upsert({
      where: { 
        integrationId: integration.id,
        name: 'Meta Ads Performance',
      },
      update: {
        cachedData: mockData,
        lastRefresh: new Date(),
      },
      create: {
        name: 'Meta Ads Performance',
        description: 'Facebook and Instagram ads performance',
        dataType: 'time_series',
        query: { metrics: ['impressions', 'clicks', 'spend', 'ctr'] },
        cachedData: mockData,
        lastRefresh: new Date(),
        integrationId: integration.id,
        clientId: integration.clientId,
      },
    });
  }

  private async syncLinkedInAdsData(integration: any, credentials: any) {
    // Mock LinkedIn Ads data sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockData = {
      impressions: Math.floor(Math.random() * 50000),
      clicks: Math.floor(Math.random() * 2000),
      spend: Math.floor(Math.random() * 500),
      conversions: Math.floor(Math.random() * 100),
    };

    await this.prisma.analyticsDataset.upsert({
      where: { 
        integrationId: integration.id,
        name: 'LinkedIn Ads Performance',
      },
      update: {
        cachedData: mockData,
        lastRefresh: new Date(),
      },
      create: {
        name: 'LinkedIn Ads Performance',
        description: 'LinkedIn professional ads performance',
        dataType: 'time_series',
        query: { metrics: ['impressions', 'clicks', 'spend', 'conversions'] },
        cachedData: mockData,
        lastRefresh: new Date(),
        integrationId: integration.id,
        clientId: integration.clientId,
      },
    });
  }
}

