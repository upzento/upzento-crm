import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { CreateFormFieldDto } from './dto/create-form-field.dto';
import { CreateFormStepDto } from './dto/create-form-step.dto';
import { CreateFormWebhookDto } from './dto/create-form-webhook.dto';
import { Form, FormField, FormStep, FormSubmission, FormWebhook } from '@prisma/client';
import axios from 'axios';
import * as crypto from 'crypto';
import { SubmitFormDto } from './dto/submit-form.dto';
import * as dns from 'dns';
import { promisify } from 'util';

const resolveTxt = promisify(dns.resolveTxt);

@Injectable()
export class FormsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  // Form CRUD operations
  async createForm(dto: CreateFormDto, userId: string) {
    const form = await this.prisma.form.create({
      data: {
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive,
        isPublic: dto.isPublic,
        settings: dto.settings,
        createdBy: userId,
        fields: {
          create: dto.fields.map((field, index) => ({
            ...field,
            order: field.order ?? index,
          })),
        },
        webhooks: dto.webhooks ? {
          create: dto.webhooks,
        } : undefined,
      },
      include: {
        fields: true,
        webhooks: true,
      },
    });

    return form;
  }

  async findAllForms(clientId: string): Promise<Form[]> {
    return this.prisma.form.findMany({
      where: { clientId },
      include: {
        fields: true,
        steps: true,
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });
  }

  async findFormById(id: string, clientId: string): Promise<Form> {
    const form = await this.prisma.form.findFirst({
      where: { id, clientId },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
        steps: {
          orderBy: { order: 'asc' },
          include: {
            fields: {
              orderBy: { order: 'asc' },
            },
          },
        },
        webhooks: true,
      },
    });

    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }

    return form;
  }

  async updateForm(id: string, clientId: string, updateFormDto: UpdateFormDto): Promise<Form> {
    // Check if form exists
    await this.findFormById(id, clientId);

    return this.prisma.form.update({
      where: { id },
      data: {
        name: updateFormDto.name,
        description: updateFormDto.description,
        status: updateFormDto.status,
        settings: updateFormDto.settings,
      },
      include: {
        fields: true,
        steps: true,
      },
    });
  }

  async deleteForm(id: string, clientId: string): Promise<void> {
    // Check if form exists
    await this.findFormById(id, clientId);

    await this.prisma.form.delete({
      where: { id },
    });
  }

  // Form Field operations
  async createFormField(createFormFieldDto: CreateFormFieldDto): Promise<FormField> {
    return this.prisma.formField.create({
      data: {
        label: createFormFieldDto.label,
        type: createFormFieldDto.type,
        placeholder: createFormFieldDto.placeholder,
        helpText: createFormFieldDto.helpText,
        isRequired: createFormFieldDto.isRequired,
        order: createFormFieldDto.order,
        options: createFormFieldDto.options,
        validation: createFormFieldDto.validation,
        defaultValue: createFormFieldDto.defaultValue,
        form: {
          connect: { id: createFormFieldDto.formId },
        },
        ...(createFormFieldDto.stepId && {
          step: {
            connect: { id: createFormFieldDto.stepId },
          },
        }),
      },
    });
  }

  async updateFormField(id: string, updateData: Partial<CreateFormFieldDto>): Promise<FormField> {
    return this.prisma.formField.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteFormField(id: string): Promise<void> {
    await this.prisma.formField.delete({
      where: { id },
    });
  }

  // Form Step operations
  async createFormStep(createFormStepDto: CreateFormStepDto): Promise<FormStep> {
    return this.prisma.formStep.create({
      data: {
        title: createFormStepDto.title,
        description: createFormStepDto.description,
        order: createFormStepDto.order,
        form: {
          connect: { id: createFormStepDto.formId },
        },
      },
    });
  }

  async updateFormStep(id: string, updateData: Partial<CreateFormStepDto>): Promise<FormStep> {
    return this.prisma.formStep.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteFormStep(id: string): Promise<void> {
    await this.prisma.formStep.delete({
      where: { id },
    });
  }

  // Form Webhook operations
  async createFormWebhook(createFormWebhookDto: CreateFormWebhookDto): Promise<FormWebhook> {
    return this.prisma.formWebhook.create({
      data: {
        url: createFormWebhookDto.url,
        method: createFormWebhookDto.method,
        headers: createFormWebhookDto.headers,
        active: createFormWebhookDto.active,
        form: {
          connect: { id: createFormWebhookDto.formId },
        },
      },
    });
  }

  async updateFormWebhook(id: string, updateData: Partial<CreateFormWebhookDto>): Promise<FormWebhook> {
    return this.prisma.formWebhook.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteFormWebhook(id: string): Promise<void> {
    await this.prisma.formWebhook.delete({
      where: { id },
    });
  }

  // Form Submission operations
  async getFormSubmissions(formId: string, clientId: string): Promise<FormSubmission[]> {
    // Check if form exists and belongs to client
    await this.findFormById(formId, clientId);

    return this.prisma.formSubmission.findMany({
      where: { formId },
      include: {
        responses: {
          include: {
            field: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getFormSubmission(id: string, formId: string, clientId: string): Promise<FormSubmission> {
    // Check if form exists and belongs to client
    await this.findFormById(formId, clientId);

    const submission = await this.prisma.formSubmission.findFirst({
      where: { id, formId },
      include: {
        responses: {
          include: {
            field: true,
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    return submission;
  }

  async createFormSubmission(
    formId: string,
    data: { 
      responses: Array<{ fieldId: string; value?: string; fileUrl?: string }>;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<FormSubmission> {
    // Check if form exists
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: true,
      },
    });

    if (!form) {
      throw new NotFoundException(`Form with ID ${formId} not found`);
    }

    // Validate required fields
    const requiredFields = form.fields.filter(field => field.isRequired);
    for (const field of requiredFields) {
      const response = data.responses.find(r => r.fieldId === field.id);
      if (!response || (!response.value && !response.fileUrl)) {
        throw new Error(`Required field ${field.label} is missing`);
      }
    }

    // Create submission with responses
    return this.prisma.formSubmission.create({
      data: {
        form: {
          connect: { id: formId },
        },
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        responses: {
          create: data.responses.map(response => ({
            field: {
              connect: { id: response.fieldId },
            },
            value: response.value,
            fileUrl: response.fileUrl,
          })),
        },
      },
      include: {
        responses: {
          include: {
            field: true,
          },
        },
      },
    });
  }

  async deleteFormSubmission(id: string, formId: string, clientId: string): Promise<void> {
    // Check if form exists and belongs to client
    await this.findFormById(formId, clientId);

    // Check if submission exists
    const submission = await this.prisma.formSubmission.findFirst({
      where: { id, formId },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    await this.prisma.formSubmission.delete({
      where: { id },
    });
  }

  async getForm(formId: string, includePrivate = false) {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
        webhooks: includePrivate,
      },
    });

    if (!form) {
      throw new NotFoundException(`Form with ID ${formId} not found`);
    }

    if (!form.isPublic && !includePrivate) {
      throw new NotFoundException('Form not found');
    }

    return form;
  }

  async submitForm(formId: string, dto: SubmitFormDto) {
    const form = await this.getForm(formId);

    if (!form.isActive) {
      throw new BadRequestException('This form is no longer accepting submissions');
    }

    // Validate required fields
    const missingFields = form.fields
      .filter(field => field.isRequired)
      .filter(field => !dto.data[field.label]);

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Missing required fields: ${missingFields.map(f => f.label).join(', ')}`,
      );
    }

    // Create submission
    const submission = await this.prisma.formSubmission.create({
      data: {
        formId,
        data: dto.data,
        metadata: dto.metadata,
      },
    });

    // Process webhooks
    if (form.webhooks?.length > 0) {
      await this.processWebhooks(form.webhooks, submission);
    }

    return submission;
  }

  async getSubmissions(formId: string) {
    const form = await this.getForm(formId, true);

    return this.prisma.formSubmission.findMany({
      where: { formId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async processWebhooks(webhooks: any[], submission: any) {
    const promises = webhooks
      .filter(webhook => webhook.isActive)
      .map(async webhook => {
        try {
          const headers = {
            'Content-Type': 'application/json',
            ...webhook.headers,
          };

          // Add signature if secret is present
          if (webhook.secret) {
            const signature = this.generateWebhookSignature(
              submission,
              webhook.secret,
            );
            headers['X-Webhook-Signature'] = signature;
          }

          await axios({
            method: webhook.method,
            url: webhook.url,
            data: submission,
            headers,
          });
        } catch (error) {
          console.error(`Webhook processing failed: ${error.message}`);
          // Log webhook failure but don't fail the submission
        }
      });

    await Promise.allSettled(promises);
  }

  private generateWebhookSignature(payload: any, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }

  async duplicate(id: string) {
    const form = await this.findFormById(id, '');
    const { id: _, createdAt, updatedAt, ...formData } = form;

    return this.prisma.form.create({
      data: {
        ...formData,
        name: `${formData.name} (Copy)`,
        fields: {
          create: form.fields.map(({ id: _, ...field }) => field),
        },
        steps: {
          create: form.steps.map(({ id: _, fields, ...step }) => ({
            ...step,
            fields: {
              create: fields.map(({ id: __, ...field }) => field),
            },
          })),
        },
        settings: {
          create: form.settings
            ? { ...form.settings, id: undefined }
            : undefined,
        },
      },
      include: {
        fields: true,
        steps: {
          include: {
            fields: true,
          },
        },
        settings: true,
      },
    });
  }

  async verifyCaptcha(token: string) {
    try {
      const secretKey = this.configService.get('RECAPTCHA_SECRET_KEY');
      const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: secretKey,
            response: token,
          },
        },
      );

      if (!response.data.success) {
        throw new BadRequestException('CAPTCHA verification failed');
      }

      return response.data;
    } catch (error) {
      throw new BadRequestException('CAPTCHA verification failed');
    }
  }

  async verifyDomain(formId: string, domain: string) {
    // Generate verification token
    const verificationToken = `upzento-verify=${formId}`;

    // Save domain verification record
    await this.prisma.formDomain.create({
      data: {
        formId,
        domain,
        verificationToken,
        verified: false,
      },
    });

    return { verificationToken };
  }

  async checkDomainVerification(formId: string, domain: string) {
    try {
      // Get domain record
      const domainRecord = await this.prisma.formDomain.findFirst({
        where: { formId, domain },
      });

      if (!domainRecord) {
        return false;
      }

      // Check TXT records
      const txtRecords = await resolveTxt(domain);
      const verificationRecord = txtRecords.flat().find(record =>
        record.includes(`upzento-verify=${formId}`),
      );

      if (verificationRecord) {
        // Update domain verification status
        await this.prisma.formDomain.update({
          where: { id: domainRecord.id },
          data: { verified: true },
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Domain verification check failed:', error);
      return false;
    }
  }

  async createContactFromSubmission(submission: any) {
    const { data } = submission;

    return this.prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        source: 'form',
        formId: submission.formId,
        submissionId: submission.id,
      },
    });
  }

  async createDealFromSubmission(submission: any) {
    return this.prisma.deal.create({
      data: {
        title: `Form Submission - ${submission.data.name}`,
        value: submission.data.value,
        source: 'form',
        formId: submission.formId,
        submissionId: submission.id,
        contactId: submission.contactId,
      },
    });
  }

  async trackFormView(formId: string) {
    return this.prisma.formAnalytics.upsert({
      where: {
        formId_date: {
          formId,
          date: new Date(),
        },
      },
      update: {
        views: { increment: 1 },
      },
      create: {
        formId,
        date: new Date(),
        views: 1,
        submissions: 0,
        completionRate: 0,
      },
    });
  }

  async trackFormSubmission(formId: string, data: any) {
    const analytics = await this.prisma.formAnalytics.findUnique({
      where: {
        formId_date: {
          formId,
          date: new Date(),
        },
      },
    });

    if (!analytics) {
      return this.prisma.formAnalytics.create({
        data: {
          formId,
          date: new Date(),
          views: 0,
          submissions: 1,
          completionRate: 100,
        },
      });
    }

    const completionRate = Math.round(
      ((analytics.submissions + 1) / (analytics.views || 1)) * 100,
    );

    return this.prisma.formAnalytics.update({
      where: {
        formId_date: {
          formId,
          date: new Date(),
        },
      },
      data: {
        submissions: { increment: 1 },
        completionRate,
      },
    });
  }
} 