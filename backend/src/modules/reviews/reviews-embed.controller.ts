import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseUUIDPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';
import { RequiresTenantType } from '../auth/decorators/tenant-type.decorator';
import { Reviews-embedService } from './reviews-embed.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews-embed')
export class ReviewsEmbedController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('widgets/:id')
  async getPublicWidgetData(
    @Param('id') id: string,
    @Headers('origin') origin: string,
    @Headers('referer') referer: string,
  ) {
    if (!origin && !referer) {
      throw new BadRequestException('Origin or referer header is required');
    }

    // Extract domain from origin or referer
    let domain;
    if (origin) {
      try {
        const url = new URL(origin);
        domain = url.hostname;
      } catch (error) {
        throw new BadRequestException('Invalid origin header');
      }
    } else if (referer) {
      try {
        const url = new URL(referer);
        domain = url.hostname;
      } catch (error) {
        throw new BadRequestException('Invalid referer header');
      }
    }

    return this.reviewsService.getPublicWidgetData(id, domain);
  }

  @Post('widgets/:id/submit')
  async submitReview(
    @Param('id') widgetId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Headers('origin') origin: string,
    @Headers('referer') referer: string,
  ) {
    if (!origin && !referer) {
      throw new BadRequestException('Origin or referer header is required');
    }

    // Extract domain from origin or referer
    let domain;
    if (origin) {
      try {
        const url = new URL(origin);
        domain = url.hostname;
      } catch (error) {
        throw new BadRequestException('Invalid origin header');
      }
    } else if (referer) {
      try {
        const url = new URL(referer);
        domain = url.hostname;
      } catch (error) {
        throw new BadRequestException('Invalid referer header');
      }
    }

    // Get widget to verify domain and clientId
    const widget = await this.reviewsService.findReviewWidgetById(widgetId, createReviewDto.clientId);
    
    // Check if domain is allowed
    const isDomainAllowed = widget.allowedDomains.some(allowedDomain => {
      // Handle wildcards and exact matches
      if (allowedDomain === '*') return true;
      if (allowedDomain.startsWith('*.')) {
        const baseDomain = allowedDomain.substring(2);
        return domain.endsWith(baseDomain);
      }
      return domain === allowedDomain;
    });

    if (!isDomainAllowed) {
      throw new BadRequestException('Domain not authorized for this widget');
    }

    // Create the review
    const review = await this.reviewsService.createReview(createReviewDto);
    
    return {
      success: true,
      message: 'Review submitted successfully',
      reviewId: review.id,
    };
  }
} 