import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';
import { AnalyticsService } from './analytics.service';
import { CreateIntegrationDto, UpdateIntegrationDto } from './dto/create-integration.dto';
import { CreateDashboardDto, UpdateDashboardDto } from './dto/create-dashboard.dto';
import { CreateDatasetDto, UpdateDatasetDto } from './dto/create-dataset.dto';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard, TenantContextGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Integration endpoints
  @Post('integrations')
  @ApiOperation({ summary: 'Create a new analytics integration' })
  @ApiResponse({ status: 201, description: 'Integration created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createIntegration(
    @Body() createIntegrationDto: CreateIntegrationDto,
    @Request() req: any,
  ) {
    const clientId = req.user.clientId || createIntegrationDto.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.createIntegration(createIntegrationDto, clientId, userId);
  }

  @Get('integrations')
  @ApiOperation({ summary: 'Get all integrations for the client' })
  @ApiResponse({ status: 200, description: 'Integrations retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getIntegrations(@Request() req: any) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.getIntegrations(clientId, userId);
  }

  @Get('integrations/:id')
  @ApiOperation({ summary: 'Get a specific integration' })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({ status: 200, description: 'Integration retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Integration not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getIntegration(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.getIntegration(id, clientId, userId);
  }

  @Put('integrations/:id')
  @ApiOperation({ summary: 'Update an integration' })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({ status: 200, description: 'Integration updated successfully' })
  @ApiResponse({ status: 404, description: 'Integration not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateIntegration(
    @Param('id') id: string,
    @Body() updateIntegrationDto: UpdateIntegrationDto,
    @Request() req: any,
  ) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.updateIntegration(id, updateIntegrationDto, clientId, userId);
  }

  @Delete('integrations/:id')
  @ApiOperation({ summary: 'Delete an integration' })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({ status: 200, description: 'Integration deleted successfully' })
  @ApiResponse({ status: 404, description: 'Integration not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteIntegration(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.deleteIntegration(id, clientId, userId);
  }

  @Post('integrations/:id/sync')
  @ApiOperation({ summary: 'Manually sync an integration' })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({ status: 200, description: 'Sync completed successfully' })
  @ApiResponse({ status: 404, description: 'Integration not found' })
  @ApiResponse({ status: 400, description: 'Sync failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async syncIntegration(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.syncIntegration(id, clientId, userId);
  }

  // Dashboard endpoints
  @Post('dashboards')
  @ApiOperation({ summary: 'Create a new analytics dashboard' })
  @ApiResponse({ status: 201, description: 'Dashboard created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createDashboard(
    @Body() createDashboardDto: CreateDashboardDto,
    @Request() req: any,
  ) {
    const clientId = req.user.clientId || createDashboardDto.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.createDashboard(createDashboardDto, clientId, userId);
  }

  @Get('dashboards')
  @ApiOperation({ summary: 'Get all dashboards for the client' })
  @ApiResponse({ status: 200, description: 'Dashboards retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getDashboards(@Request() req: any) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.getDashboards(clientId, userId);
  }

  @Get('dashboards/:id')
  @ApiOperation({ summary: 'Get a specific dashboard' })
  @ApiParam({ name: 'id', description: 'Dashboard ID' })
  @ApiResponse({ status: 200, description: 'Dashboard retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Dashboard not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getDashboard(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.getDashboard(id, clientId, userId);
  }

  @Put('dashboards/:id')
  @ApiOperation({ summary: 'Update a dashboard' })
  @ApiParam({ name: 'id', description: 'Dashboard ID' })
  @ApiResponse({ status: 200, description: 'Dashboard updated successfully' })
  @ApiResponse({ status: 404, description: 'Dashboard not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateDashboard(
    @Param('id') id: string,
    @Body() updateDashboardDto: UpdateDashboardDto,
    @Request() req: any,
  ) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.updateDashboard(id, updateDashboardDto, clientId, userId);
  }

  @Delete('dashboards/:id')
  @ApiOperation({ summary: 'Delete a dashboard' })
  @ApiParam({ name: 'id', description: 'Dashboard ID' })
  @ApiResponse({ status: 200, description: 'Dashboard deleted successfully' })
  @ApiResponse({ status: 404, description: 'Dashboard not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteDashboard(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.deleteDashboard(id, clientId, userId);
  }

  // Dataset endpoints
  @Post('datasets')
  @ApiOperation({ summary: 'Create a new analytics dataset' })
  @ApiResponse({ status: 201, description: 'Dataset created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createDataset(
    @Body() createDatasetDto: CreateDatasetDto,
    @Request() req: any,
  ) {
    const clientId = req.user.clientId || createDatasetDto.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.createDataset(createDatasetDto, clientId, userId);
  }

  @Get('datasets')
  @ApiOperation({ summary: 'Get all datasets for the client' })
  @ApiResponse({ status: 200, description: 'Datasets retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getDatasets(@Request() req: any) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.getDatasets(clientId, userId);
  }

  // Analytics Goals endpoints
  @Post('goals')
  @ApiOperation({ summary: 'Create a new analytics goal' })
  @ApiResponse({ status: 201, description: 'Goal created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createGoal(
    @Body() data: any,
    @Request() req: any,
  ) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.createGoal(data, clientId, userId);
  }

  @Get('goals')
  @ApiOperation({ summary: 'Get all goals for the client' })
  @ApiResponse({ status: 200, description: 'Goals retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getGoals(@Request() req: any) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    return this.analyticsService.getGoals(clientId, userId);
  }

  // Analytics Overview endpoint
  @Get('overview')
  @ApiOperation({ summary: 'Get analytics overview for the client' })
  @ApiResponse({ status: 200, description: 'Overview retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getOverview(@Request() req: any) {
    const clientId = req.user.clientId;
    const userId = req.user.id;
    
    // Get summary data
    const [integrations, dashboards, datasets, goals] = await Promise.all([
      this.analyticsService.getIntegrations(clientId, userId),
      this.analyticsService.getDashboards(clientId, userId),
      this.analyticsService.getDatasets(clientId, userId),
      this.analyticsService.getGoals(clientId, userId),
    ]);

    return {
      summary: {
        totalIntegrations: integrations.length,
        connectedIntegrations: integrations.filter(i => i.status === 'connected').length,
        totalDashboards: dashboards.length,
        totalDatasets: datasets.length,
        totalGoals: goals.length,
        activeGoals: goals.filter(g => g.status === 'active').length,
      },
      integrations: integrations.slice(0, 5), // Latest 5 integrations
      dashboards: dashboards.slice(0, 5), // Latest 5 dashboards
      recentActivity: {
        lastSync: integrations
          .filter(i => i.lastSync)
          .sort((a, b) => new Date(b.lastSync!).getTime() - new Date(a.lastSync!).getTime())[0]?.lastSync,
        errorCount: integrations.filter(i => i.status === 'error').length,
      },
    };
  }
} 
