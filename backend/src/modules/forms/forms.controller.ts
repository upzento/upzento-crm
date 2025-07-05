import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseUUIDPipe, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { VerifyCaptchaDto } from './dto/verify-captcha.dto';
import { VerifyDomainDto } from './dto/verify-domain.dto';

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
  @ApiOperation({ summary: 'Get all forms' })
  async findAllForms(@Query('type') type?: string) {
    return this.formsService.findAll(type);
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
  @ApiOperation({ summary: 'Update a form' })
  async updateForm(
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
    @Request() req,
  ) {
    return this.formsService.updateForm(id, req.user.clientId, updateFormDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a form' })
  async deleteForm(@Param('id') id: string, @Request() req) {
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

  @Post('submit')
  @ApiOperation({ summary: 'Submit a form' })
  @ApiResponse({ status: 201, description: 'Form submitted successfully' })
  async submitForm(
    @Body() submitFormDto: SubmitFormDto,
  ) {
    try {
      // Verify CAPTCHA if token provided
      if (submitFormDto.captchaToken) {
        await this.formsService.verifyCaptcha(submitFormDto.captchaToken);
      }

      // Verify domain if in embed mode
      if (submitFormDto.metadata?.source === 'embed') {
        const domain = new URL(submitFormDto.metadata.url).hostname;
        const isVerified = await this.formsService.checkDomainVerification(
          submitFormDto.formId,
          domain,
        );
        if (!isVerified) {
          throw new UnauthorizedException('Domain not verified');
        }
      }

      // Submit form
      const submission = await this.formsService.submitForm(submitFormDto);

      // Create contact if enabled
      if (submission.createContact) {
        await this.formsService.createContactFromSubmission(submission);
      }

      // Create deal if enabled
      if (submission.createDeal) {
        await this.formsService.createDealFromSubmission(submission);
      }

      return submission;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('verify-captcha')
  @ApiOperation({ summary: 'Verify reCAPTCHA token' })
  async verifyCaptcha(@Body() verifyCaptchaDto: VerifyCaptchaDto) {
    return this.formsService.verifyCaptcha(verifyCaptchaDto.token);
  }

  @Post(':id/domains/verify')
  @ApiOperation({ summary: 'Verify domain for form embedding' })
  async verifyDomain(
    @Param('id') id: string,
    @Body() verifyDomainDto: VerifyDomainDto,
  ) {
    return this.formsService.verifyDomain(id, verifyDomainDto.domain);
  }

  @Get(':id/domains/:domain/status')
  @ApiOperation({ summary: 'Check domain verification status' })
  async checkDomainVerification(
    @Param('id') id: string,
    @Param('domain') domain: string,
  ) {
    return this.formsService.checkDomainVerification(id, domain);
  }

  @Post(':id/analytics/view')
  @ApiOperation({ summary: 'Track form view' })
  async trackView(@Param('id') id: string) {
    return this.formsService.trackFormView(id);
  }

  @Post(':id/analytics/submission')
  @ApiOperation({ summary: 'Track form submission' })
  async trackSubmission(
    @Param('id') id: string,
    @Body() data: Record<string, any>,
  ) {
    return this.formsService.trackFormSubmission(id, data);
  }
} 