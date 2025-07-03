import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseUUIDPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';
import { RequiresTenantType } from '../auth/decorators/tenant-type.decorator';
import { WhatsappService } from './whatsapp.service';
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
import { WhatsAppService } from './whatsapp.service';
import { CreateWhatsappAccountDto } from './dto/create-whatsapp-account.dto';



@Controller('chat/whatsapp')
@UseGuards(JwtAuthGuard, TenantContextGuard)
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Post('accounts')
  createAccount(@Body() createAccountDto: CreateWhatsappAccountDto) {
    return this.whatsappService.createAccount(createAccountDto);
  }

  @Get('accounts')
  findAllAccounts(@Query('clientId') clientId: string) {
    return this.whatsappService.findAllAccounts(clientId);
  }

  @Get('accounts/:id')
  findOneAccount(@Param('id') id: string) {
    return this.whatsappService.findOneAccount(id);
  }

  @Patch('accounts/:id')
  updateAccount(
    @Param('id') id: string,
    @Body() updateAccountDto: Partial<CreateWhatsappAccountDto>,
  ) {
    return this.whatsappService.updateAccount(id, updateAccountDto);
  }

  @Delete('accounts/:id')
  removeAccount(@Param('id') id: string) {
    return this.whatsappService.removeAccount(id);
  }

  @Post('send')
  sendMessage(
    @Body()
    messageData: {
      accountId: string;
      to: string;
      message: string;
      attachmentUrl?: string;
    },
  ) {
    const { accountId, to, message, attachmentUrl } = messageData;
    return this.whatsappService.sendMessage(accountId, to, message, attachmentUrl);
  }

  @Post('webhook')
  handleWebhook(@Body() webhookData: any) {
    return this.whatsappService.handleWebhook(webhookData);
  }
} 