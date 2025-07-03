import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseUUIDPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';
import { RequiresTenantType } from '../auth/decorators/tenant-type.decorator';
import { WidgetsService } from './widgets.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

@ApiTags('chat')
@Controller('chat/widgets')
@UseGuards(JwtAuthGuard, TenantContextGuard)
@ApiBearerAuth()
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat widget' })
  @ApiResponse({ status: 201, description: 'Widget created successfully' })
  create(@Body() createWidgetDto: CreateWidgetDto, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.widgetsService.create(createWidgetDto, clientId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chat widgets for the client' })
  @ApiResponse({ status: 200, description: 'Widgets retrieved successfully' })
  findAll(@Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.widgetsService.findAll(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chat widget by ID' })
  @ApiResponse({ status: 200, description: 'Widget retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Widget not found' })
  findOne(@Param('id') id: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.widgetsService.findOne(id, clientId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a chat widget' })
  @ApiResponse({ status: 200, description: 'Widget updated successfully' })
  @ApiResponse({ status: 404, description: 'Widget not found' })
  update(
    @Param('id') id: string,
    @Body() updateWidgetDto: UpdateWidgetDto,
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    return this.widgetsService.update(id, updateWidgetDto, clientId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat widget' })
  @ApiResponse({ status: 200, description: 'Widget deleted successfully' })
  @ApiResponse({ status: 404, description: 'Widget not found' })
  remove(@Param('id') id: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.widgetsService.remove(id, clientId);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle a chat widget active status' })
  @ApiResponse({ status: 200, description: 'Widget status toggled successfully' })
  @ApiResponse({ status: 404, description: 'Widget not found' })
  toggle(
    @Param('id') id: string, 
    @Body('isActive') isActive: boolean,
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    return this.widgetsService.toggle(id, isActive, clientId);
  }
} 