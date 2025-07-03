import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard, TenantContextGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Integration endpoints
  @Post('integrations')
  createIntegration(@Body() createIntegrationDto: CreateIntegrationDto) {
    return this.analyticsService.createIntegration(createIntegrationDto);
  }

  @Get('integrations')
  getAllIntegrations(@Query('clientId') clientId: string) {
    return this.analyticsService.getAllIntegrations(clientId);
  }

  @Get('integrations/:id')
  getIntegration(@Param('id') id: string) {
    return this.analyticsService.getIntegration(id);
  }

  @Patch('integrations/:id')
  updateIntegration(
    @Param('id') id: string,
    @Body() updateIntegrationDto: Partial<CreateIntegrationDto>,
  ) {
    return this.analyticsService.updateIntegration(id, updateIntegrationDto);
  }

  @Delete('integrations/:id')
  deleteIntegration(@Param('id') id: string) {
    return this.analyticsService.deleteIntegration(id);
  }

  @Post('integrations/:id/sync')
  syncIntegration(@Param('id') id: string) {
    return this.analyticsService.syncIntegration(id);
  }

  // Dashboard endpoints
  @Post('dashboards')
  createDashboard(@Body() createDashboardDto: CreateDashboardDto) {
    return this.analyticsService.createDashboard(createDashboardDto);
  }

  @Get('dashboards')
  getAllDashboards(@Query('clientId') clientId: string) {
    return this.analyticsService.getAllDashboards(clientId);
  }

  @Get('dashboards/:id')
  getDashboard(@Param('id') id: string) {
    return this.analyticsService.getDashboard(id);
  }

  @Patch('dashboards/:id')
  updateDashboard(
    @Param('id') id: string,
    @Body() updateDashboardDto: Partial<CreateDashboardDto>,
  ) {
    return this.analyticsService.updateDashboard(id, updateDashboardDto);
  }

  @Delete('dashboards/:id')
  deleteDashboard(@Param('id') id: string) {
    return this.analyticsService.deleteDashboard(id);
  }

  @Post('dashboards/:id/set-default')
  setDefaultDashboard(
    @Param('id') id: string,
    @Query('clientId') clientId: string,
  ) {
    return this.analyticsService.setDefaultDashboard(id, clientId);
  }

  // Widget endpoints
  @Post('widgets')
  createWidget(@Body() createWidgetDto: CreateWidgetDto) {
    return this.analyticsService.createWidget(createWidgetDto);
  }

  @Get('widgets/:id')
  getWidget(@Param('id') id: string) {
    return this.analyticsService.getWidget(id);
  }

  @Patch('widgets/:id')
  updateWidget(
    @Param('id') id: string,
    @Body() updateWidgetDto: Partial<CreateWidgetDto>,
  ) {
    return this.analyticsService.updateWidget(id, updateWidgetDto);
  }

  @Delete('widgets/:id')
  deleteWidget(@Param('id') id: string) {
    return this.analyticsService.deleteWidget(id);
  }

  // Dataset endpoints
  @Post('datasets')
  createDataset(@Body() createDatasetDto: CreateDatasetDto) {
    return this.analyticsService.createDataset(createDatasetDto);
  }

  @Get('datasets')
  getAllDatasets(@Query('clientId') clientId: string) {
    return this.analyticsService.getAllDatasets(clientId);
  }

  @Get('datasets/:id')
  getDataset(@Param('id') id: string) {
    return this.analyticsService.getDataset(id);
  }

  @Patch('datasets/:id')
  updateDataset(
    @Param('id') id: string,
    @Body() updateDatasetDto: Partial<CreateDatasetDto>,
  ) {
    return this.analyticsService.updateDataset(id, updateDatasetDto);
  }

  @Delete('datasets/:id')
  deleteDataset(@Param('id') id: string) {
    return this.analyticsService.deleteDataset(id);
  }

  @Post('datasets/:id/refresh')
  refreshDataset(@Param('id') id: string) {
    return this.analyticsService.refreshDataset(id);
  }

  // Report endpoints
  @Post('reports')
  createReport(@Body() createReportDto: CreateReportDto) {
    return this.analyticsService.createReport(createReportDto);
  }

  @Get('reports')
  getAllReports(@Query('clientId') clientId: string) {
    return this.analyticsService.getAllReports(clientId);
  }

  @Get('reports/:id')
  getReport(@Param('id') id: string) {
    return this.analyticsService.getReport(id);
  }

  @Patch('reports/:id')
  updateReport(
    @Param('id') id: string,
    @Body() updateReportDto: Partial<CreateReportDto>,
  ) {
    return this.analyticsService.updateReport(id, updateReportDto);
  }

  @Delete('reports/:id')
  deleteReport(@Param('id') id: string) {
    return this.analyticsService.deleteReport(id);
  }

  @Post('reports/:id/generate')
  generateReport(@Param('id') id: string) {
    return this.analyticsService.generateReport(id);
  }
} 
