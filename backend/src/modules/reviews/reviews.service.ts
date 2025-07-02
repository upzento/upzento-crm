import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto, ReviewStatus } from './dto/update-review.dto';
import { CreateReviewTagDto } from './dto/create-review-tag.dto';
import { CreateReviewServiceDto } from './dto/create-review-service.dto';
import { CreateReviewLocationDto } from './dto/create-review-location.dto';
import { CreateReviewWidgetDto } from './dto/create-review-widget.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  // Review Management
  async createReview(createReviewDto: CreateReviewDto) {
    const { tagIds, ...reviewData } = createReviewDto;

    // Create the review
    const review = await this.prisma.review.create({
      data: {
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        authorName: reviewData.authorName,
        authorEmail: reviewData.authorEmail,
        authorPhone: reviewData.authorPhone,
        source: reviewData.source || 'DIRECT',
        status: 'PENDING',
        imageUrls: reviewData.imageUrls || [],
        client: {
          connect: { id: reviewData.clientId },
        },
        ...(reviewData.contactId && {
          contact: {
            connect: { id: reviewData.contactId },
          },
        }),
        ...(reviewData.serviceId && {
          service: {
            connect: { id: reviewData.serviceId },
          },
        }),
        ...(reviewData.locationId && {
          location: {
            connect: { id: reviewData.locationId },
          },
        }),
      },
    });

    // Add tags if provided
    if (tagIds && tagIds.length > 0) {
      await this.addTagsToReview(review.id, tagIds);
    }

    return this.findReviewById(review.id, reviewData.clientId);
  }

  async findAllReviews(clientId: string, filters?: any) {
    const where: any = { clientId };

    // Apply filters if provided
    if (filters) {
      if (filters.status) where.status = filters.status;
      if (filters.source) where.source = filters.source;
      if (filters.minRating) where.rating = { gte: parseInt(filters.minRating) };
      if (filters.maxRating) where.rating = { ...where.rating, lte: parseInt(filters.maxRating) };
      if (filters.serviceId) where.serviceId = filters.serviceId;
      if (filters.locationId) where.locationId = filters.locationId;
      if (filters.contactId) where.contactId = filters.contactId;
      
      // Date range filter
      if (filters.startDate && filters.endDate) {
        where.createdAt = {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate),
        };
      }
      
      // Search in content or author name
      if (filters.search) {
        where.OR = [
          { content: { contains: filters.search, mode: 'insensitive' } },
          { authorName: { contains: filters.search, mode: 'insensitive' } },
          { title: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
      
      // Filter by tag
      if (filters.tagId) {
        where.tags = {
          some: {
            tagId: filters.tagId,
          },
        };
      }
    }

    return this.prisma.review.findMany({
      where,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        service: true,
        location: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findReviewById(id: string, clientId: string) {
    const review = await this.prisma.review.findFirst({
      where: { id, clientId },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        service: true,
        location: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async updateReview(id: string, clientId: string, updateReviewDto: UpdateReviewDto) {
    await this.findReviewById(id, clientId);
    
    const { tagIds, ...updateData } = updateReviewDto;
    
    // If responding to the review, set the response date
    if (updateData.responseContent && !updateData.responseContent.trim().length) {
      updateData.responseContent = null;
    } else if (updateData.responseContent) {
      updateData['responseDate'] = new Date();
    }

    // Update the review
    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.serviceId && {
          service: {
            connect: { id: updateData.serviceId },
          },
        }),
        ...(updateData.locationId && {
          location: {
            connect: { id: updateData.locationId },
          },
        }),
      },
    });

    // Update tags if provided
    if (tagIds) {
      // Remove existing tags
      await this.prisma.reviewToTag.deleteMany({
        where: { reviewId: id },
      });
      
      // Add new tags
      if (tagIds.length > 0) {
        await this.addTagsToReview(id, tagIds);
      }
    }

    return this.findReviewById(id, clientId);
  }

  async updateReviewStatus(id: string, clientId: string, status: ReviewStatus) {
    await this.findReviewById(id, clientId);

    return this.prisma.review.update({
      where: { id },
      data: { status },
    });
  }

  async deleteReview(id: string, clientId: string) {
    await this.findReviewById(id, clientId);

    return this.prisma.review.delete({
      where: { id },
    });
  }

  async addTagsToReview(reviewId: string, tagIds: string[]) {
    const data = tagIds.map(tagId => ({
      reviewId,
      tagId,
    }));

    await this.prisma.reviewToTag.createMany({
      data,
      skipDuplicates: true,
    });
  }

  // Review Tag Management
  async createReviewTag(createReviewTagDto: CreateReviewTagDto) {
    return this.prisma.reviewTag.create({
      data: {
        name: createReviewTagDto.name,
        color: createReviewTagDto.color || '#3498db',
        client: {
          connect: { id: createReviewTagDto.clientId },
        },
      },
    });
  }

  async findAllReviewTags(clientId: string) {
    return this.prisma.reviewTag.findMany({
      where: { clientId },
      orderBy: { name: 'asc' },
    });
  }

  async findReviewTagById(id: string, clientId: string) {
    const tag = await this.prisma.reviewTag.findFirst({
      where: { id, clientId },
    });

    if (!tag) {
      throw new NotFoundException(`Review tag with ID ${id} not found`);
    }

    return tag;
  }

  async updateReviewTag(id: string, clientId: string, updateData: Partial<CreateReviewTagDto>) {
    await this.findReviewTagById(id, clientId);

    return this.prisma.reviewTag.update({
      where: { id },
      data: {
        name: updateData.name,
        color: updateData.color,
      },
    });
  }

  async deleteReviewTag(id: string, clientId: string) {
    await this.findReviewTagById(id, clientId);

    return this.prisma.reviewTag.delete({
      where: { id },
    });
  }

  // Review Service Management
  async createReviewService(createReviewServiceDto: CreateReviewServiceDto) {
    return this.prisma.reviewService.create({
      data: {
        name: createReviewServiceDto.name,
        description: createReviewServiceDto.description,
        client: {
          connect: { id: createReviewServiceDto.clientId },
        },
      },
    });
  }

  async findAllReviewServices(clientId: string) {
    return this.prisma.reviewService.findMany({
      where: { clientId },
      orderBy: { name: 'asc' },
    });
  }

  async findReviewServiceById(id: string, clientId: string) {
    const service = await this.prisma.reviewService.findFirst({
      where: { id, clientId },
    });

    if (!service) {
      throw new NotFoundException(`Review service with ID ${id} not found`);
    }

    return service;
  }

  async updateReviewService(id: string, clientId: string, updateData: Partial<CreateReviewServiceDto>) {
    await this.findReviewServiceById(id, clientId);

    return this.prisma.reviewService.update({
      where: { id },
      data: {
        name: updateData.name,
        description: updateData.description,
      },
    });
  }

  async deleteReviewService(id: string, clientId: string) {
    await this.findReviewServiceById(id, clientId);

    return this.prisma.reviewService.delete({
      where: { id },
    });
  }

  // Review Location Management
  async createReviewLocation(createReviewLocationDto: CreateReviewLocationDto) {
    return this.prisma.reviewLocation.create({
      data: {
        name: createReviewLocationDto.name,
        address: createReviewLocationDto.address,
        client: {
          connect: { id: createReviewLocationDto.clientId },
        },
      },
    });
  }

  async findAllReviewLocations(clientId: string) {
    return this.prisma.reviewLocation.findMany({
      where: { clientId },
      orderBy: { name: 'asc' },
    });
  }

  async findReviewLocationById(id: string, clientId: string) {
    const location = await this.prisma.reviewLocation.findFirst({
      where: { id, clientId },
    });

    if (!location) {
      throw new NotFoundException(`Review location with ID ${id} not found`);
    }

    return location;
  }

  async updateReviewLocation(id: string, clientId: string, updateData: Partial<CreateReviewLocationDto>) {
    await this.findReviewLocationById(id, clientId);

    return this.prisma.reviewLocation.update({
      where: { id },
      data: {
        name: updateData.name,
        address: updateData.address,
      },
    });
  }

  async deleteReviewLocation(id: string, clientId: string) {
    await this.findReviewLocationById(id, clientId);

    return this.prisma.reviewLocation.delete({
      where: { id },
    });
  }

  // Review Widget Management
  async createReviewWidget(createReviewWidgetDto: CreateReviewWidgetDto) {
    return this.prisma.reviewWidget.create({
      data: {
        name: createReviewWidgetDto.name,
        description: createReviewWidgetDto.description,
        displayType: createReviewWidgetDto.displayType || 'CAROUSEL',
        theme: createReviewWidgetDto.theme,
        filters: createReviewWidgetDto.filters,
        showRating: createReviewWidgetDto.showRating ?? true,
        showDate: createReviewWidgetDto.showDate ?? true,
        showSource: createReviewWidgetDto.showSource ?? true,
        showResponse: createReviewWidgetDto.showResponse ?? true,
        maxReviews: createReviewWidgetDto.maxReviews || 10,
        allowedDomains: createReviewWidgetDto.allowedDomains,
        client: {
          connect: { id: createReviewWidgetDto.clientId },
        },
      },
    });
  }

  async findAllReviewWidgets(clientId: string) {
    return this.prisma.reviewWidget.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findReviewWidgetById(id: string, clientId: string) {
    const widget = await this.prisma.reviewWidget.findFirst({
      where: { id, clientId },
    });

    if (!widget) {
      throw new NotFoundException(`Review widget with ID ${id} not found`);
    }

    return widget;
  }

  async updateReviewWidget(id: string, clientId: string, updateData: Partial<CreateReviewWidgetDto>) {
    await this.findReviewWidgetById(id, clientId);

    return this.prisma.reviewWidget.update({
      where: { id },
      data: {
        name: updateData.name,
        description: updateData.description,
        displayType: updateData.displayType,
        theme: updateData.theme,
        filters: updateData.filters,
        showRating: updateData.showRating,
        showDate: updateData.showDate,
        showSource: updateData.showSource,
        showResponse: updateData.showResponse,
        maxReviews: updateData.maxReviews,
        allowedDomains: updateData.allowedDomains,
      },
    });
  }

  async deleteReviewWidget(id: string, clientId: string) {
    await this.findReviewWidgetById(id, clientId);

    return this.prisma.reviewWidget.delete({
      where: { id },
    });
  }

  // Public widget data retrieval (for embedding)
  async getPublicWidgetData(widgetId: string, domain: string) {
    // Find the widget
    const widget = await this.prisma.reviewWidget.findUnique({
      where: { id: widgetId },
    });

    if (!widget) {
      throw new NotFoundException('Widget not found');
    }

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

    // Build query based on widget filters
    const where: any = {
      clientId: widget.clientId,
      status: 'APPROVED',
    };

    if (widget.filters) {
      const filters = widget.filters as any;
      
      if (filters.minRating) {
        where.rating = { gte: filters.minRating };
      }
      
      if (filters.serviceIds && filters.serviceIds.length > 0) {
        where.serviceId = { in: filters.serviceIds };
      }
      
      if (filters.locationIds && filters.locationIds.length > 0) {
        where.locationId = { in: filters.locationIds };
      }
      
      if (filters.sources && filters.sources.length > 0) {
        where.source = { in: filters.sources };
      }
      
      if (filters.tagIds && filters.tagIds.length > 0) {
        where.tags = {
          some: {
            tagId: { in: filters.tagIds },
          },
        };
      }
    }

    // Get reviews based on filters
    const reviews = await this.prisma.review.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: widget.maxReviews,
    });

    // Calculate statistics
    const stats = await this.getClientReviewStats(widget.clientId);

    // Return widget data with reviews and settings
    return {
      widget: {
        id: widget.id,
        name: widget.name,
        displayType: widget.displayType,
        theme: widget.theme,
        showRating: widget.showRating,
        showDate: widget.showDate,
        showSource: widget.showSource,
        showResponse: widget.showResponse,
      },
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        authorName: review.authorName,
        source: review.source,
        createdAt: review.createdAt,
        responseContent: review.responseContent,
        responseDate: review.responseDate,
        service: review.service?.name,
        location: review.location?.name,
      })),
      stats,
    };
  }

  // Review Statistics
  async getClientReviewStats(clientId: string) {
    // Get total count
    const totalCount = await this.prisma.review.count({
      where: {
        clientId,
        status: 'APPROVED',
      },
    });

    // Get average rating
    const ratingResult = await this.prisma.review.aggregate({
      where: {
        clientId,
        status: 'APPROVED',
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    // Get rating distribution
    const ratingDistribution = await this.prisma.review.groupBy({
      by: ['rating'],
      where: {
        clientId,
        status: 'APPROVED',
      },
      _count: {
        rating: true,
      },
    });

    // Format rating distribution
    const distribution = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
    };

    ratingDistribution.forEach(item => {
      distribution[item.rating.toString()] = item._count.rating;
    });

    return {
      totalCount,
      averageRating: ratingResult._avg.rating || 0,
      ratingCount: ratingResult._count.rating || 0,
      distribution,
    };
  }
} 