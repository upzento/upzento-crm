import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseUUIDPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';
import { RequiresTenantType } from '../auth/decorators/tenant-type.decorator';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { CreateFormFieldDto } from './dto/create-form-field.dto';
import { CreateFormStepDto } from './dto/create-form-step.dto';
import { CreateFormWebhookDto } from './dto/create-form-webhook.dto';
import { SubmitFormDto } from './dto/submit-form.dto';

@ApiTags('forms')
@Controller('forms')
@UseGuards(JwtAuthGuard, TenantContextGuard)
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  // Form endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new form' })
  @ApiResponse({ status: 201, description: 'Form created successfully' })
  async createForm(@Body() dto: CreateFormDto) {
    // TODO: Get userId from request context
    const userId = 'current-user-id';
    return this.formsService.createForm(dto, userId);
  }

  @Get()
  findAllForms(@Request() req) {
    return this.formsService.findAllForms(req.user.clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a form by ID' })
  @ApiResponse({ status: 200, description: 'Form retrieved successfully' })
  async getForm(
    @Param('id') formId: string,
    @Query('include_private') includePrivate?: boolean,
  ) {
    return this.formsService.getForm(formId, includePrivate);
  }

  @Patch(':id')
  updateForm(
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
    @Request() req,
  ) {
    return this.formsService.updateForm(id, req.user.clientId, updateFormDto);
  }

  @Delete(':id')
  deleteForm(@Param('id') id: string, @Request() req) {
    return this.formsService.deleteForm(id, req.user.clientId);
  }

  // Form Field endpoints
  @Post('fields')
  createFormField(@Body() createFormFieldDto: CreateFormFieldDto) {
    return this.formsService.createFormField(createFormFieldDto);
  }

  @Patch('fields/:id')
  updateFormField(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateFormFieldDto>,
  ) {
    return this.formsService.updateFormField(id, updateData);
  }

  @Delete('fields/:id')
  deleteFormField(@Param('id') id: string) {
    return this.formsService.deleteFormField(id);
  }

  // Form Step endpoints
  @Post('steps')
  createFormStep(@Body() createFormStepDto: CreateFormStepDto) {
    return this.formsService.createFormStep(createFormStepDto);
  }

  @Patch('steps/:id')
  updateFormStep(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateFormStepDto>,
  ) {
    return this.formsService.updateFormStep(id, updateData);
  }

  @Delete('steps/:id')
  deleteFormStep(@Param('id') id: string) {
    return this.formsService.deleteFormStep(id);
  }

  // Form Webhook endpoints
  @Post('webhooks')
  createFormWebhook(@Body() createFormWebhookDto: CreateFormWebhookDto) {
    return this.formsService.createFormWebhook(createFormWebhookDto);
  }

  @Patch('webhooks/:id')
  updateFormWebhook(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateFormWebhookDto>,
  ) {
    return this.formsService.updateFormWebhook(id, updateData);
  }

  @Delete('webhooks/:id')
  deleteFormWebhook(@Param('id') id: string) {
    return this.formsService.deleteFormWebhook(id);
  }

  // Form Submission endpoints
  @Get(':formId/submissions')
  getFormSubmissions(@Param('formId') formId: string, @Request() req) {
    return this.formsService.getFormSubmissions(formId, req.user.clientId);
  }

  @Get(':formId/submissions/:id')
  getFormSubmission(
    @Param('formId') formId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.formsService.getFormSubmission(id, formId, req.user.clientId);
  }

  @Post(':formId/submissions')
  createFormSubmission(
    @Param('formId') formId: string,
    @Body() data: {
      responses: Array<{ fieldId: string; value?: string; fileUrl?: string }>;
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    return this.formsService.createFormSubmission(formId, data);
  }

  @Delete(':formId/submissions/:id')
  deleteFormSubmission(
    @Param('formId') formId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.formsService.deleteFormSubmission(id, formId, req.user.clientId);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit a form' })
  @ApiResponse({ status: 201, description: 'Form submitted successfully' })
  async submitForm(
    @Param('id') formId: string,
    @Body() dto: SubmitFormDto,
  ) {
    return this.formsService.submitForm(formId, dto);
  }

  @Get(':id/submissions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get form submissions' })
  @ApiResponse({ status: 200, description: 'Form submissions retrieved successfully' })
  async getSubmissions(@Param('id') formId: string) {
    return this.formsService.getSubmissions(formId);
  }
} 