import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { CreateFormFieldDto } from './dto/create-form-field.dto';
import { CreateFormStepDto } from './dto/create-form-step.dto';
import { CreateFormWebhookDto } from './dto/create-form-webhook.dto';
import { Form, FormField, FormStep, FormSubmission, FormWebhook } from '@prisma/client';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  // Form CRUD operations
  async createForm(createFormDto: CreateFormDto): Promise<Form> {
    return this.prisma.form.create({
      data: {
        name: createFormDto.name,
        description: createFormDto.description,
        status: createFormDto.status,
        settings: createFormDto.settings,
        client: {
          connect: { id: createFormDto.clientId },
        },
      },
      include: {
        fields: true,
        steps: true,
      },
    });
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
} 