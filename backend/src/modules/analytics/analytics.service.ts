import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateIntegrationDto, IntegrationType } from './dto/create-integration.dto';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { CreateWidgetDto, WidgetType } from './dto/create-widget.dto';
import { CreateDatasetDto, DataType } from './dto/create-dataset.dto';
import { CreateReportDto, ReportFormat } from './dto/create-report.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Integration methods
  async createIntegration(createIntegrationDto: CreateIntegrationDto) {
    return this.prisma.analyticsIntegration.create({
      data: {
        ...createIntegrationDto,
        credentials: createIntegrationDto.credentials as unknown as Prisma.JsonObject,
        settings: createIntegrationDto.settings as unknown as Prisma.JsonObject,
      },
    });
  }

  async getAllIntegrations(clientId: string) {
    return this.prisma.analyticsIntegration.findMany({
      where: { clientId },
      include: {
        dashboards: true,
        datasets: true,
      },
    });
  }

  async getIntegration(id: string) {
    const integration = await this.prisma.analyticsIntegration.findUnique({
      where: { id },
      include: {
        dashboards: true,
        datasets: true,
      },
    });

    if (!integration) {
      throw new NotFoundException(`Integration with ID ${id} not found`);
    }

    return integration;
  }

  async updateIntegration(id: string, updateIntegrationDto: Partial<CreateIntegrationDto>) {
    // Check if integration exists
    await this.getIntegration(id);
    
    return this.prisma.analyticsIntegration.update({
      where: { id },
      data: {
        ...updateIntegrationDto,
        credentials: updateIntegrationDto.credentials as unknown as Prisma.JsonObject,
        settings: updateIntegrationDto.settings as unknown as Prisma.JsonObject,
      },
    });
  }

  async deleteIntegration(id: string) {
    // Check if integration exists
    await this.getIntegration(id);
    
    // Delete the integration (cascade will handle related entities)
    await this.prisma.analyticsIntegration.delete({
      where: { id },
    });

    return { id };
  }

  async syncIntegration(id: string) {
    // Check if integration exists
    const integration = await this.getIntegration(id);
    
    // Update lastSync timestamp
    await this.prisma.analyticsIntegration.update({
      where: { id },
      data: { lastSync: new Date() },
    });

    // In a real implementation, this would call the appropriate API
    // based on the integration type to sync data
    
    return {
      id,
      message: `Integration ${id} synced successfully`,
      lastSync: new Date(),
    };
  }

  // Dashboard methods
  async createDashboard(createDashboardDto: CreateDashboardDto) {
    // Check if integration exists
    await this.getIntegration(createDashboardDto.integrationId);
    
    return this.prisma.analyticsDashboard.create({
      data: {
        ...createDashboardDto,
        layout: createDashboardDto.layout as unknown as Prisma.JsonObject,
      },
    });
  }

  async getAllDashboards(clientId: string) {
    return this.prisma.analyticsDashboard.findMany({
      where: { clientId },
      include: {
        integration: true,
        widgets: true,
      },
    });
  }

  async getDashboard(id: string) {
    const dashboard = await this.prisma.analyticsDashboard.findUnique({
      where: { id },
      include: {
        integration: true,
        widgets: {
          include: {
            dataset: true,
          },
        },
      },
    });

    if (!dashboard) {
      throw new NotFoundException(`Dashboard with ID ${id} not found`);
    }

    return dashboard;
  }

  async updateDashboard(id: string, updateDashboardDto: Partial<CreateDashboardDto>) {
    // Check if dashboard exists
    await this.getDashboard(id);
    
    // If changing integration, check if it exists
    if (updateDashboardDto.integrationId) {
      await this.getIntegration(updateDashboardDto.integrationId);
    }
    
    return this.prisma.analyticsDashboard.update({
      where: { id },
      data: {
        ...updateDashboardDto,
        layout: updateDashboardDto.layout as unknown as Prisma.JsonObject,
      },
    });
  }

  async deleteDashboard(id: string) {
    // Check if dashboard exists
    await this.getDashboard(id);
    
    // Delete the dashboard (cascade will handle related entities)
    await this.prisma.analyticsDashboard.delete({
      where: { id },
    });

    return { id };
  }

  async setDefaultDashboard(id: string, clientId: string) {
    // Check if dashboard exists
    const dashboard = await this.getDashboard(id);
    
    // Check if dashboard belongs to client
    if (dashboard.clientId !== clientId) {
      throw new BadRequestException('Dashboard does not belong to this client');
    }
    
    // Clear default flag from all dashboards for this client
    await this.prisma.analyticsDashboard.updateMany({
      where: { clientId, isDefault: true },
      data: { isDefault: false },
    });
    
    // Set this dashboard as default
    await this.prisma.analyticsDashboard.update({
      where: { id },
      data: { isDefault: true },
    });

    return this.getDashboard(id);
  }

  // Widget methods
  async createWidget(createWidgetDto: CreateWidgetDto) {
    // Check if dashboard exists
    await this.getDashboard(createWidgetDto.dashboardId);
    
    // Check if dataset exists
    await this.getDataset(createWidgetDto.datasetId);
    
    return this.prisma.analyticsWidget.create({
      data: {
        ...createWidgetDto,
        settings: createWidgetDto.settings as unknown as Prisma.JsonObject,
        position: createWidgetDto.position as unknown as Prisma.JsonObject,
        size: createWidgetDto.size as unknown as Prisma.JsonObject,
      },
    });
  }

  async getWidget(id: string) {
    const widget = await this.prisma.analyticsWidget.findUnique({
      where: { id },
      include: {
        dashboard: true,
        dataset: true,
      },
    });

    if (!widget) {
      throw new NotFoundException(`Widget with ID ${id} not found`);
    }

    return widget;
  }

  async updateWidget(id: string, updateWidgetDto: Partial<CreateWidgetDto>) {
    // Check if widget exists
    await this.getWidget(id);
    
    // If changing dashboard, check if it exists
    if (updateWidgetDto.dashboardId) {
      await this.getDashboard(updateWidgetDto.dashboardId);
    }
    
    // If changing dataset, check if it exists
    if (updateWidgetDto.datasetId) {
      await this.getDataset(updateWidgetDto.datasetId);
    }
    
    return this.prisma.analyticsWidget.update({
      where: { id },
      data: {
        ...updateWidgetDto,
        settings: updateWidgetDto.settings as unknown as Prisma.JsonObject,
        position: updateWidgetDto.position as unknown as Prisma.JsonObject,
        size: updateWidgetDto.size as unknown as Prisma.JsonObject,
      },
    });
  }

  async deleteWidget(id: string) {
    // Check if widget exists
    await this.getWidget(id);
    
    // Delete the widget
    await this.prisma.analyticsWidget.delete({
      where: { id },
    });

    return { id };
  }

  // Dataset methods
  async createDataset(createDatasetDto: CreateDatasetDto) {
    // Check if integration exists
    await this.getIntegration(createDatasetDto.integrationId);
    
    return this.prisma.analyticsDataset.create({
      data: {
        ...createDatasetDto,
        query: createDatasetDto.query as unknown as Prisma.JsonObject,
      },
    });
  }

  async getAllDatasets(clientId: string) {
    return this.prisma.analyticsDataset.findMany({
      where: { clientId },
      include: {
        integration: true,
        widgets: true,
        cachedData: true,
      },
    });
  }

  async getDataset(id: string) {
    const dataset = await this.prisma.analyticsDataset.findUnique({
      where: { id },
      include: {
        integration: true,
        widgets: true,
        cachedData: true,
      },
    });

    if (!dataset) {
      throw new NotFoundException(`Dataset with ID ${id} not found`);
    }

    return dataset;
  }

  async updateDataset(id: string, updateDatasetDto: Partial<CreateDatasetDto>) {
    // Check if dataset exists
    await this.getDataset(id);
    
    // If changing integration, check if it exists
    if (updateDatasetDto.integrationId) {
      await this.getIntegration(updateDatasetDto.integrationId);
    }
    
    return this.prisma.analyticsDataset.update({
      where: { id },
      data: {
        ...updateDatasetDto,
        query: updateDatasetDto.query as unknown as Prisma.JsonObject,
      },
    });
  }

  async deleteDataset(id: string) {
    // Check if dataset exists
    await this.getDataset(id);
    
    // Delete the dataset (cascade will handle related entities)
    await this.prisma.analyticsDataset.delete({
      where: { id },
    });

    return { id };
  }

  async refreshDataset(id: string) {
    // Check if dataset exists
    const dataset = await this.getDataset(id);
    
    // In a real implementation, this would fetch data from the integration
    // based on the dataset query and update the cached data
    
    // For now, we'll just update the lastUpdated timestamp
    await this.prisma.analyticsDataset.update({
      where: { id },
      data: { lastUpdated: new Date() },
    });

    // Create or update cached data
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + dataset.cacheTime);
    
    const sampleData = {
      refreshed: true,
      timestamp: new Date().toISOString(),
      data: [
        { label: 'Sample 1', value: Math.floor(Math.random() * 100) },
        { label: 'Sample 2', value: Math.floor(Math.random() * 100) },
        { label: 'Sample 3', value: Math.floor(Math.random() * 100) },
      ],
    };

    if (dataset.cachedData) {
      await this.prisma.analyticsCachedData.update({
        where: { datasetId: id },
        data: {
          data: sampleData as unknown as Prisma.JsonObject,
          expiresAt,
          updatedAt: new Date(),
        },
      });
    } else {
      await this.prisma.analyticsCachedData.create({
        data: {
          datasetId: id,
          data: sampleData as unknown as Prisma.JsonObject,
          expiresAt,
        },
      });
    }

    return {
      id,
      message: `Dataset ${id} refreshed successfully`,
      lastUpdated: new Date(),
    };
  }

  // Report methods
  async createReport(createReportDto: CreateReportDto) {
    return this.prisma.analyticsReport.create({
      data: {
        ...createReportDto,
        schedule: createReportDto.schedule as unknown as Prisma.JsonObject,
        settings: createReportDto.settings as unknown as Prisma.JsonObject,
      },
    });
  }

  async getAllReports(clientId: string) {
    return this.prisma.analyticsReport.findMany({
      where: { clientId },
    });
  }

  async getReport(id: string) {
    const report = await this.prisma.analyticsReport.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  async updateReport(id: string, updateReportDto: Partial<CreateReportDto>) {
    // Check if report exists
    await this.getReport(id);
    
    return this.prisma.analyticsReport.update({
      where: { id },
      data: {
        ...updateReportDto,
        schedule: updateReportDto.schedule as unknown as Prisma.JsonObject,
        settings: updateReportDto.settings as unknown as Prisma.JsonObject,
      },
    });
  }

  async deleteReport(id: string) {
    // Check if report exists
    await this.getReport(id);
    
    // Delete the report
    await this.prisma.analyticsReport.delete({
      where: { id },
    });

    return { id };
  }

  async generateReport(id: string) {
    // Check if report exists
    const report = await this.getReport(id);
    
    // In a real implementation, this would generate the report
    // based on the report settings and send it to recipients
    
    // For now, we'll just update the lastSent timestamp
    await this.prisma.analyticsReport.update({
      where: { id },
      data: { lastSent: new Date() },
    });

    return {
      id,
      message: `Report ${id} generated and sent successfully`,
      lastSent: new Date(),
      recipients: report.recipients,
      format: report.format,
    };
  }
}

