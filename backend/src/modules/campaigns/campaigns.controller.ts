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
  BadRequestException,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, CampaignStatus } from './dto/create-campaign.dto';
import { CreateCampaignMessageDto } from './dto/create-campaign-message.dto';
import { CreateCampaignSegmentDto } from './dto/create-campaign-segment.dto';
import { CreateCampaignTemplateDto } from './dto/create-campaign-template.dto';
import { CreateAutomationWorkflowDto } from './dto/create-automation-workflow.dto';
import { CreateABTestDto } from './dto/create-ab-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';

@Controller('campaigns')
@UseGuards(JwtAuthGuard, TenantContextGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  // Campaign endpoints
  @Post()
  createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.createCampaign(createCampaignDto);
  }

  @Get()
  getAllCampaigns(
    @Query('clientId') clientId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: CampaignStatus,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    return this.campaignsService.getAllCampaigns(clientId, {
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
      type,
      search,
    });
  }

  @Get(':id')
  getCampaign(@Param('id') id: string) {
    return this.campaignsService.getCampaign(id);
  }

  @Patch(':id')
  updateCampaign(
    @Param('id') id: string,
    @Body() updateCampaignDto: Partial<CreateCampaignDto>,
  ) {
    return this.campaignsService.updateCampaign(id, updateCampaignDto);
  }

  @Delete(':id')
  deleteCampaign(@Param('id') id: string) {
    return this.campaignsService.deleteCampaign(id);
  }

  @Patch(':id/status')
  updateCampaignStatus(
    @Param('id') id: string,
    @Body('status') status: CampaignStatus,
  ) {
    if (!status) {
      throw new BadRequestException('Status is required');
    }
    return this.campaignsService.updateCampaignStatus(id, status);
  }

  // Campaign Message endpoints
  @Post('messages')
  createCampaignMessage(@Body() createMessageDto: CreateCampaignMessageDto) {
    return this.campaignsService.createCampaignMessage(createMessageDto);
  }

  @Get('messages/:id')
  getCampaignMessage(@Param('id') id: string) {
    return this.campaignsService.getCampaignMessage(id);
  }

  @Patch('messages/:id')
  updateCampaignMessage(
    @Param('id') id: string,
    @Body() updateMessageDto: Partial<CreateCampaignMessageDto>,
  ) {
    return this.campaignsService.updateCampaignMessage(id, updateMessageDto);
  }

  @Delete('messages/:id')
  deleteCampaignMessage(@Param('id') id: string) {
    return this.campaignsService.deleteCampaignMessage(id);
  }

  // Campaign Segment endpoints
  @Post('segments')
  createCampaignSegment(@Body() createSegmentDto: CreateCampaignSegmentDto) {
    return this.campaignsService.createCampaignSegment(createSegmentDto);
  }

  @Get('segments')
  getAllCampaignSegments(@Query('clientId') clientId: string) {
    return this.campaignsService.getAllCampaignSegments(clientId);
  }

  @Get('segments/:id')
  getCampaignSegment(@Param('id') id: string) {
    return this.campaignsService.getCampaignSegment(id);
  }

  @Patch('segments/:id')
  updateCampaignSegment(
    @Param('id') id: string,
    @Body() updateSegmentDto: Partial<CreateCampaignSegmentDto>,
  ) {
    return this.campaignsService.updateCampaignSegment(id, updateSegmentDto);
  }

  @Delete('segments/:id')
  deleteCampaignSegment(@Param('id') id: string) {
    return this.campaignsService.deleteCampaignSegment(id);
  }

  // Campaign Template endpoints
  @Post('templates')
  createCampaignTemplate(@Body() createTemplateDto: CreateCampaignTemplateDto) {
    return this.campaignsService.createCampaignTemplate(createTemplateDto);
  }

  @Get('templates')
  getAllCampaignTemplates(
    @Query('clientId') clientId: string,
    @Query('type') type?: string,
  ) {
    return this.campaignsService.getAllCampaignTemplates(clientId, type);
  }

  @Get('templates/:id')
  getCampaignTemplate(@Param('id') id: string) {
    return this.campaignsService.getCampaignTemplate(id);
  }

  @Patch('templates/:id')
  updateCampaignTemplate(
    @Param('id') id: string,
    @Body() updateTemplateDto: Partial<CreateCampaignTemplateDto>,
  ) {
    return this.campaignsService.updateCampaignTemplate(id, updateTemplateDto);
  }

  @Delete('templates/:id')
  deleteCampaignTemplate(@Param('id') id: string) {
    return this.campaignsService.deleteCampaignTemplate(id);
  }

  // Automation Workflow endpoints
  @Post('workflows')
  createAutomationWorkflow(@Body() createWorkflowDto: CreateAutomationWorkflowDto) {
    return this.campaignsService.createAutomationWorkflow(createWorkflowDto);
  }

  @Get('workflows')
  getAllAutomationWorkflows(@Query('clientId') clientId: string) {
    return this.campaignsService.getAllAutomationWorkflows(clientId);
  }

  @Get('workflows/:id')
  getAutomationWorkflow(@Param('id') id: string) {
    return this.campaignsService.getAutomationWorkflow(id);
  }

  @Patch('workflows/:id')
  updateAutomationWorkflow(
    @Param('id') id: string,
    @Body() updateWorkflowDto: Partial<CreateAutomationWorkflowDto>,
  ) {
    return this.campaignsService.updateAutomationWorkflow(id, updateWorkflowDto);
  }

  @Delete('workflows/:id')
  deleteAutomationWorkflow(@Param('id') id: string) {
    return this.campaignsService.deleteAutomationWorkflow(id);
  }

  @Patch('workflows/:id/toggle')
  toggleAutomationWorkflow(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    if (isActive === undefined) {
      throw new BadRequestException('isActive is required');
    }
    return this.campaignsService.toggleAutomationWorkflow(id, isActive);
  }

  // A/B Test endpoints
  @Post('ab-tests')
  createABTest(@Body() createABTestDto: CreateABTestDto) {
    return this.campaignsService.createABTest(createABTestDto);
  }

  @Get('ab-tests/:id')
  getABTest(@Param('id') id: string) {
    return this.campaignsService.getABTest(id);
  }

  @Patch('ab-tests/:id')
  updateABTest(
    @Param('id') id: string,
    @Body() updateABTestDto: Partial<CreateABTestDto>,
  ) {
    return this.campaignsService.updateABTest(id, updateABTestDto);
  }

  @Delete('ab-tests/:id')
  deleteABTest(@Param('id') id: string) {
    return this.campaignsService.deleteABTest(id);
  }

  // Campaign Analytics endpoints
  @Patch(':id/analytics')
  updateCampaignAnalytics(
    @Param('id') id: string,
    @Body() analyticsData: {
      sent?: number;
      delivered?: number;
      opened?: number;
      clicked?: number;
      replied?: number;
      bounced?: number;
      unsubscribed?: number;
      conversions?: number;
      revenue?: number;
    },
  ) {
    return this.campaignsService.updateCampaignAnalytics(id, analyticsData);
  }

  // Recipient Event endpoints
  @Post('recipients/:id/events')
  trackRecipientEvent(
    @Param('id') id: string,
    @Body() eventData: {
      eventType: string;
      metadata?: Record<string, any>;
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    if (!eventData.eventType) {
      throw new BadRequestException('Event type is required');
    }
    return this.campaignsService.trackRecipientEvent(
      id,
      eventData.eventType,
      eventData.metadata,
      eventData.ipAddress,
      eventData.userAgent,
    );
  }

  // Deal Attribution endpoints
  @Post('deals/:dealId/attribute')
  attributeDealToCampaign(
    @Param('dealId') dealId: string,
    @Body('campaignId') campaignId: string,
  ) {
    if (!campaignId) {
      throw new BadRequestException('Campaign ID is required');
    }
    return this.campaignsService.attributeDealToCampaign(dealId, campaignId);
  }

  @Get(':id/deals')
  getDealsAttributedToCampaign(@Param('id') id: string) {
    return this.campaignsService.getDealsAttributedToCampaign(id);
  }
} 