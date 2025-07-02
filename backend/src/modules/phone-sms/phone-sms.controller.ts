import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { PhoneSmsService } from './phone-sms.service';
import { CreatePhoneNumberDto } from './dto/create-phone-number.dto';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';
import { CreateCallDto } from './dto/create-call.dto';
import { CreateSmsMessageDto } from './dto/create-sms-message.dto';
import { CreateSmsConversationDto } from './dto/create-sms-conversation.dto';
import { CreateSmsTemplateDto } from './dto/create-sms-template.dto';
import { CreateBulkSmsCampaignDto } from './dto/create-bulk-sms-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';

@Controller('phone-sms')
@UseGuards(JwtAuthGuard, TenantContextGuard)
export class PhoneSmsController {
  constructor(private readonly phoneSmsService: PhoneSmsService) {}

  // Phone Number endpoints
  @Post('phone-numbers')
  createPhoneNumber(@Body() createPhoneNumberDto: CreatePhoneNumberDto) {
    return this.phoneSmsService.createPhoneNumber(createPhoneNumberDto);
  }

  @Get('phone-numbers')
  findAllPhoneNumbers(@Request() req) {
    return this.phoneSmsService.findAllPhoneNumbers(req.user.clientId);
  }

  @Get('phone-numbers/:id')
  findPhoneNumberById(@Param('id') id: string, @Request() req) {
    return this.phoneSmsService.findPhoneNumberById(id, req.user.clientId);
  }

  @Patch('phone-numbers/:id')
  updatePhoneNumber(
    @Param('id') id: string,
    @Body() updatePhoneNumberDto: UpdatePhoneNumberDto,
    @Request() req,
  ) {
    return this.phoneSmsService.updatePhoneNumber(id, req.user.clientId, updatePhoneNumberDto);
  }

  @Delete('phone-numbers/:id')
  deletePhoneNumber(@Param('id') id: string, @Request() req) {
    return this.phoneSmsService.deletePhoneNumber(id, req.user.clientId);
  }

  // Call endpoints
  @Post('calls')
  createCall(@Body() createCallDto: CreateCallDto) {
    return this.phoneSmsService.createCall(createCallDto);
  }

  @Get('calls')
  findAllCalls(
    @Request() req,
    @Query('direction') direction?: string,
    @Query('status') status?: string,
    @Query('contactId') contactId?: string,
    @Query('dealId') dealId?: string,
    @Query('appointmentId') appointmentId?: string,
    @Query('assignedToId') assignedToId?: string,
    @Query('phoneNumberId') phoneNumberId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters = {
      direction,
      status,
      contactId,
      dealId,
      appointmentId,
      assignedToId,
      phoneNumberId,
      startDate,
      endDate,
    };

    return this.phoneSmsService.findAllCalls(req.user.clientId, filters);
  }

  @Get('calls/:id')
  findCallById(@Param('id') id: string, @Request() req) {
    return this.phoneSmsService.findCallById(id, req.user.clientId);
  }

  @Patch('calls/:id/status')
  updateCallStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    return this.phoneSmsService.updateCallStatus(id, req.user.clientId, status);
  }

  @Patch('calls/:id/notes')
  updateCallNotes(
    @Param('id') id: string,
    @Body('notes') notes: string,
    @Request() req,
  ) {
    return this.phoneSmsService.updateCallNotes(id, req.user.clientId, notes);
  }

  @Patch('calls/:id/assign')
  assignCall(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Request() req,
  ) {
    return this.phoneSmsService.assignCall(id, req.user.clientId, userId);
  }

  // SMS Conversation endpoints
  @Post('conversations')
  createSmsConversation(@Body() createSmsConversationDto: CreateSmsConversationDto) {
    return this.phoneSmsService.createSmsConversation(createSmsConversationDto);
  }

  @Get('conversations')
  findAllSmsConversations(
    @Request() req,
    @Query('status') status?: string,
    @Query('contactId') contactId?: string,
    @Query('assignedToId') assignedToId?: string,
  ) {
    const filters = { status, contactId, assignedToId };
    return this.phoneSmsService.findAllSmsConversations(req.user.clientId, filters);
  }

  @Get('conversations/:id')
  findSmsConversationById(@Param('id') id: string, @Request() req) {
    return this.phoneSmsService.findSmsConversationById(id, req.user.clientId);
  }

  @Patch('conversations/:id/status')
  updateSmsConversationStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    return this.phoneSmsService.updateSmsConversationStatus(id, req.user.clientId, status);
  }

  @Patch('conversations/:id/assign')
  assignSmsConversation(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Request() req,
  ) {
    return this.phoneSmsService.assignSmsConversation(id, req.user.clientId, userId);
  }

  // SMS Message endpoints
  @Post('messages')
  createSmsMessage(@Body() createSmsMessageDto: CreateSmsMessageDto) {
    return this.phoneSmsService.createSmsMessage(createSmsMessageDto);
  }

  @Get('conversations/:conversationId/messages')
  findAllSmsMessages(
    @Param('conversationId') conversationId: string,
    @Request() req,
  ) {
    return this.phoneSmsService.findAllSmsMessages(conversationId, req.user.clientId);
  }

  @Patch('messages/:id/status')
  updateSmsMessageStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    return this.phoneSmsService.updateSmsMessageStatus(id, req.user.clientId, status);
  }

  // SMS Template endpoints
  @Post('templates')
  createSmsTemplate(@Body() createSmsTemplateDto: CreateSmsTemplateDto) {
    return this.phoneSmsService.createSmsTemplate(createSmsTemplateDto);
  }

  @Get('templates')
  findAllSmsTemplates(
    @Request() req,
    @Query('category') category?: string,
  ) {
    return this.phoneSmsService.findAllSmsTemplates(req.user.clientId, category);
  }

  @Get('templates/:id')
  findSmsTemplateById(@Param('id') id: string, @Request() req) {
    return this.phoneSmsService.findSmsTemplateById(id, req.user.clientId);
  }

  @Patch('templates/:id')
  updateSmsTemplate(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateSmsTemplateDto>,
    @Request() req,
  ) {
    return this.phoneSmsService.updateSmsTemplate(id, req.user.clientId, updateData);
  }

  @Delete('templates/:id')
  deleteSmsTemplate(@Param('id') id: string, @Request() req) {
    return this.phoneSmsService.deleteSmsTemplate(id, req.user.clientId);
  }

  // Bulk SMS Campaign endpoints
  @Post('campaigns')
  createBulkSmsCampaign(@Body() createBulkSmsCampaignDto: CreateBulkSmsCampaignDto) {
    return this.phoneSmsService.createBulkSmsCampaign(createBulkSmsCampaignDto);
  }

  @Get('campaigns')
  findAllBulkSmsCampaigns(
    @Request() req,
    @Query('status') status?: string,
  ) {
    return this.phoneSmsService.findAllBulkSmsCampaigns(req.user.clientId, status);
  }

  @Get('campaigns/:id')
  findBulkSmsCampaignById(@Param('id') id: string, @Request() req) {
    return this.phoneSmsService.findBulkSmsCampaignById(id, req.user.clientId);
  }

  @Patch('campaigns/:id/status')
  updateBulkSmsCampaignStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    return this.phoneSmsService.updateBulkSmsCampaignStatus(id, req.user.clientId, status);
  }

  @Patch('campaigns/:id/schedule')
  scheduleBulkSmsCampaign(
    @Param('id') id: string,
    @Body('scheduledAt') scheduledAt: string,
    @Request() req,
  ) {
    return this.phoneSmsService.scheduleBulkSmsCampaign(id, req.user.clientId, scheduledAt);
  }

  @Delete('campaigns/:id')
  deleteBulkSmsCampaign(@Param('id') id: string, @Request() req) {
    return this.phoneSmsService.deleteBulkSmsCampaign(id, req.user.clientId);
  }

  @Post('campaigns/:id/recipients')
  addRecipientsToCampaign(
    @Param('id') id: string,
    @Body('recipients') recipients: any[],
    @Request() req,
  ) {
    return this.phoneSmsService.addRecipientsToCampaign(id, req.user.clientId, recipients);
  }

  @Delete('campaigns/:campaignId/recipients/:recipientId')
  removeRecipientFromCampaign(
    @Param('campaignId') campaignId: string,
    @Param('recipientId') recipientId: string,
    @Request() req,
  ) {
    return this.phoneSmsService.removeRecipientFromCampaign(recipientId, campaignId, req.user.clientId);
  }
} 