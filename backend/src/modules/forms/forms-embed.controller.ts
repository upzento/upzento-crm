import { Controller, Get, Post, Body, Param, Headers, Req, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@ApiTags('forms-embed')
@Controller('forms-embed')
export class FormsEmbedController {
  constructor(
    private readonly formsService: FormsService,
    private readonly prisma: PrismaService,
  ) {}

  // Get form structure for embedding
  @Get(':id')
  @ApiOperation({ summary: 'Get embeddable form by ID' })
  @ApiResponse({ status: 200, description: 'Form retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Form not found' })
  async getEmbeddedForm(@Param('id') id: string, @Headers('origin') origin: string) {
    // Find the form
    const form = await this.prisma.form.findUnique({
      where: { id },
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
        client: {
          include: {
            domains: true,
          },
        },
      },
    });

    if (!form) {
      throw new NotFoundException('Form not found');
    }

    // Check if the origin is allowed
    if (origin) {
      const isAllowedOrigin = form.client.domains.some(domain => {
        // Extract domain from origin (remove protocol and port)
        const originDomain = origin.replace(/^https?:\/\//, '').split(':')[0];
        return domain.domain === originDomain && domain.status === 'VERIFIED';
      });

      if (!isAllowedOrigin) {
        throw new BadRequestException('This form cannot be embedded on this domain');
      }
    }

    // Remove sensitive information
    const { client, ...safeForm } = form;
    
    return {
      ...safeForm,
      clientName: form.client.name, // Only expose client name
    };
  }

  // Submit form data
  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit form data' })
  @ApiResponse({ status: 201, description: 'Form submission created successfully' })
  @ApiResponse({ status: 404, description: 'Form not found' })
  async submitForm(
    @Param('id') id: string,
    @Body() submissionDto: CreateSubmissionDto,
    @Headers('origin') origin: string,
    @Req() request: any,
  ) {
    // Find the form
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            domains: true,
          },
        },
      },
    });

    if (!form) {
      throw new NotFoundException('Form not found');
    }

    // Check if the origin is allowed
    if (origin) {
      const isAllowedOrigin = form.client.domains.some(domain => {
        // Extract domain from origin (remove protocol and port)
        const originDomain = origin.replace(/^https?:\/\//, '').split(':')[0];
        return domain.domain === originDomain && domain.status === 'VERIFIED';
      });

      if (!isAllowedOrigin) {
        throw new BadRequestException('Form submissions from this domain are not allowed');
      }
    }

    // Get IP address and user agent
    const ipAddress = request.ip || 
                      request.headers['x-forwarded-for'] as string || 
                      '0.0.0.0';
                      
    const userAgent = request.headers['user-agent'] as string;

    // Create submission
    const submission = await this.formsService.createFormSubmission(
      id,
      {
        responses: submissionDto.responses,
        ipAddress,
        userAgent,
      },
    );

    // Return minimal response
    return {
      success: true,
      submissionId: submission.id,
      timestamp: submission.createdAt,
    };
  }
} 