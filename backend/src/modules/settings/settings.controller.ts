import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';
import { RequiresTenantType } from '../auth/decorators/tenant-type.decorator';

import { CreateGeneralSettingsDto } from './dto/create-general-settings.dto';
import { UpdateGeneralSettingsDto } from './dto/update-general-settings.dto';
import { CreateIntegrationSettingsDto } from './dto/create-integration-settings.dto';
import { UpdateIntegrationSettingsDto } from './dto/update-integration-settings.dto';
import { CreateModuleSettingsDto, ModuleType } from './dto/create-module-settings.dto';
import { UpdateModuleSettingsDto } from './dto/update-module-settings.dto';
import { CreateNotificationSettingsDto } from './dto/create-notification-settings.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { CreateSecuritySettingsDto } from './dto/create-security-settings.dto';
import { UpdateSecuritySettingsDto } from './dto/update-security-settings.dto';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard, TenantContextGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // General Settings
  @Post('general')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Create general settings' })
  @ApiResponse({ status: 201, description: 'General settings created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createGeneralSettings(@Body() createGeneralSettingsDto: CreateGeneralSettingsDto, @Request() req) {
    // Override clientId with the authenticated client's ID
    createGeneralSettingsDto.clientId = req.user.tenantContext.clientId;
    return this.settingsService.createGeneralSettings(createGeneralSettingsDto);
  }

  @Get('general')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get general settings' })
  @ApiResponse({ status: 200, description: 'General settings retrieved successfully' })
  @ApiResponse({ status: 404, description: 'General settings not found' })
  getGeneralSettings(@Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.settingsService.getGeneralSettings(clientId);
  }

  @Patch('general')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Update general settings' })
  @ApiResponse({ status: 200, description: 'General settings updated successfully' })
  @ApiResponse({ status: 404, description: 'General settings not found' })
  updateGeneralSettings(
    @Body() updateGeneralSettingsDto: UpdateGeneralSettingsDto,
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    
    // Create audit log
    this.createSettingsAuditLog(
      req,
      'UPDATE_GENERAL_SETTINGS',
      'GENERAL_SETTINGS',
      clientId,
      { newSettings: updateGeneralSettingsDto }
    );
    
    return this.settingsService.updateGeneralSettings(clientId, updateGeneralSettingsDto);
  }

  // Integration Settings
  @Post('integrations')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Create integration settings' })
  @ApiResponse({ status: 201, description: 'Integration settings created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createIntegrationSettings(
    @Body() createIntegrationSettingsDto: CreateIntegrationSettingsDto,
    @Request() req
  ) {
    // Override clientId with the authenticated client's ID
    createIntegrationSettingsDto.clientId = req.user.tenantContext.clientId;
    
    // Create audit log
    this.createSettingsAuditLog(
      req,
      'CREATE_INTEGRATION',
      'INTEGRATION_SETTINGS',
      createIntegrationSettingsDto.clientId,
      { integration: createIntegrationSettingsDto }
    );
    
    return this.settingsService.createIntegrationSettings(createIntegrationSettingsDto);
  }

  @Get('integrations')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get all integration settings' })
  @ApiResponse({ status: 200, description: 'Integration settings retrieved successfully' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by integration type' })
  getAllIntegrationSettings(@Query('type') type: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    
    if (type) {
      return this.settingsService.getIntegrationSettingsByType(clientId, type);
    }
    
    return this.settingsService.getAllIntegrationSettings(clientId);
  }

  @Get('integrations/:id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get integration settings by ID' })
  @ApiResponse({ status: 200, description: 'Integration settings retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Integration settings not found' })
  getIntegrationSettings(@Param('id', ParseUUIDPipe) id: string) {
    return this.settingsService.getIntegrationSettings(id);
  }

  @Patch('integrations/:id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Update integration settings' })
  @ApiResponse({ status: 200, description: 'Integration settings updated successfully' })
  @ApiResponse({ status: 404, description: 'Integration settings not found' })
  updateIntegrationSettings(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIntegrationSettingsDto: UpdateIntegrationSettingsDto,
    @Request() req
  ) {
    // Create audit log
    this.createSettingsAuditLog(
      req,
      'UPDATE_INTEGRATION',
      'INTEGRATION_SETTINGS',
      id,
      { newSettings: updateIntegrationSettingsDto }
    );
    
    return this.settingsService.updateIntegrationSettings(id, updateIntegrationSettingsDto);
  }

  @Delete('integrations/:id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Delete integration settings' })
  @ApiResponse({ status: 200, description: 'Integration settings deleted successfully' })
  @ApiResponse({ status: 404, description: 'Integration settings not found' })
  deleteIntegrationSettings(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    // Create audit log
    this.createSettingsAuditLog(
      req,
      'DELETE_INTEGRATION',
      'INTEGRATION_SETTINGS',
      id,
      {}
    );
    
    return this.settingsService.deleteIntegrationSettings(id);
  }

  // Module Settings
  @Post('modules')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Create module settings' })
  @ApiResponse({ status: 201, description: 'Module settings created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createModuleSettings(
    @Body() createModuleSettingsDto: CreateModuleSettingsDto,
    @Request() req
  ) {
    // Override clientId with the authenticated client's ID
    createModuleSettingsDto.clientId = req.user.tenantContext.clientId;
    
    // Create audit log
    this.createSettingsAuditLog(
      req,
      'CREATE_MODULE_SETTINGS',
      'MODULE_SETTINGS',
      createModuleSettingsDto.clientId,
      { moduleType: createModuleSettingsDto.moduleType, settings: createModuleSettingsDto }
    );
    
    return this.settingsService.createModuleSettings(createModuleSettingsDto);
  }

  @Get('modules')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get all module settings' })
  @ApiResponse({ status: 200, description: 'Module settings retrieved successfully' })
  getAllModuleSettings(@Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.settingsService.getAllModuleSettings(clientId);
  }

  @Get('modules/:moduleType')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get module settings by type' })
  @ApiResponse({ status: 200, description: 'Module settings retrieved successfully' })
  @ApiParam({ name: 'moduleType', enum: ModuleType })
  getModuleSettingsByType(
    @Param('moduleType', new ParseEnumPipe(ModuleType)) moduleType: ModuleType,
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    return this.settingsService.getModuleSettingsByType(clientId, moduleType);
  }

  @Patch('modules/:moduleType')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Update module settings by type' })
  @ApiResponse({ status: 200, description: 'Module settings updated successfully' })
  @ApiParam({ name: 'moduleType', enum: ModuleType })
  updateModuleSettingsByType(
    @Param('moduleType', new ParseEnumPipe(ModuleType)) moduleType: ModuleType,
    @Body() updateModuleSettingsDto: UpdateModuleSettingsDto,
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    
    // Create audit log
    this.createSettingsAuditLog(
      req,
      'UPDATE_MODULE_SETTINGS',
      'MODULE_SETTINGS',
      moduleType,
      { moduleType, newSettings: updateModuleSettingsDto }
    );
    
    return this.settingsService.updateModuleSettingsByType(clientId, moduleType, updateModuleSettingsDto);
  }

  // Notification Settings
  @Post('notifications')
  @ApiOperation({ summary: 'Create notification settings' })
  @ApiResponse({ status: 201, description: 'Notification settings created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createNotificationSettings(
    @Body() createNotificationSettingsDto: CreateNotificationSettingsDto,
    @Request() req
  ) {
    // Override userId with the authenticated user's ID
    createNotificationSettingsDto.userId = req.user.id;
    
    return this.settingsService.createNotificationSettings(createNotificationSettingsDto);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get all notification settings for current user' })
  @ApiResponse({ status: 200, description: 'Notification settings retrieved successfully' })
  getAllNotificationSettings(@Request() req) {
    const userId = req.user.id;
    return this.settingsService.getAllNotificationSettings(userId);
  }

  @Get('notifications/:moduleType')
  @ApiOperation({ summary: 'Get notification settings by module type' })
  @ApiResponse({ status: 200, description: 'Notification settings retrieved successfully' })
  @ApiParam({ name: 'moduleType', enum: ModuleType })
  getNotificationSettingsByType(
    @Param('moduleType', new ParseEnumPipe(ModuleType)) moduleType: ModuleType,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.settingsService.getNotificationSettingsByType(userId, moduleType);
  }

  @Patch('notifications/:moduleType')
  @ApiOperation({ summary: 'Update notification settings by module type' })
  @ApiResponse({ status: 200, description: 'Notification settings updated successfully' })
  @ApiParam({ name: 'moduleType', enum: ModuleType })
  updateNotificationSettingsByType(
    @Param('moduleType', new ParseEnumPipe(ModuleType)) moduleType: ModuleType,
    @Body() updateNotificationSettingsDto: UpdateNotificationSettingsDto,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.settingsService.updateNotificationSettingsByType(userId, moduleType, updateNotificationSettingsDto);
  }

  // Security Settings
  @Post('security')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Create security settings' })
  @ApiResponse({ status: 201, description: 'Security settings created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createSecuritySettings(
    @Body() createSecuritySettingsDto: CreateSecuritySettingsDto,
    @Request() req
  ) {
    // Override clientId with the authenticated client's ID
    createSecuritySettingsDto.clientId = req.user.tenantContext.clientId;
    
    // Create audit log
    this.createSettingsAuditLog(
      req,
      'CREATE_SECURITY_SETTINGS',
      'SECURITY_SETTINGS',
      createSecuritySettingsDto.clientId,
      { settings: createSecuritySettingsDto }
    );
    
    return this.settingsService.createSecuritySettings(createSecuritySettingsDto);
  }

  @Get('security')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get security settings' })
  @ApiResponse({ status: 200, description: 'Security settings retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Security settings not found' })
  getSecuritySettings(@Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.settingsService.getSecuritySettings(clientId);
  }

  @Patch('security')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Update security settings' })
  @ApiResponse({ status: 200, description: 'Security settings updated successfully' })
  @ApiResponse({ status: 404, description: 'Security settings not found' })
  updateSecuritySettings(
    @Body() updateSecuritySettingsDto: UpdateSecuritySettingsDto,
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    
    // Create audit log
    this.createSettingsAuditLog(
      req,
      'UPDATE_SECURITY_SETTINGS',
      'SECURITY_SETTINGS',
      clientId,
      { newSettings: updateSecuritySettingsDto }
    );
    
    return this.settingsService.updateSecuritySettings(clientId, updateSecuritySettingsDto);
  }

  // Audit Logs
  @Get('audit-logs')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'entityType', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  getAuditLogs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('entityType') entityType?: string,
    @Query('action') action?: string,
    @Query('userId') userId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Request() req?: any
  ) {
    const clientId = req.user.tenantContext.clientId;
    
    const options = {
      page: page ? parseInt(page as any) : undefined,
      limit: limit ? parseInt(limit as any) : undefined,
      entityType,
      action,
      userId,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    };
    
    return this.settingsService.getAuditLogs(clientId, options);
  }

  @Get('audit-logs/:id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get audit log by ID' })
  @ApiResponse({ status: 200, description: 'Audit log retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Audit log not found' })
  getAuditLog(@Param('id', ParseUUIDPipe) id: string) {
    return this.settingsService.getAuditLog(id);
  }

  // Helper method to create audit logs for settings changes
  private createSettingsAuditLog(req: any, action: string, entityType: string, entityId: string, details: any) {
    const clientId = req.user.tenantContext.clientId;
    const userId = req.user.id;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    const auditLogDto: CreateAuditLogDto = {
      action,
      entityType,
      entityId,
      details,
      ipAddress,
      userAgent,
      userId,
      clientId,
    };
    
    this.settingsService.createAuditLog(auditLogDto).catch(error => {
      console.error('Failed to create audit log:', error);
    });
  }
} 