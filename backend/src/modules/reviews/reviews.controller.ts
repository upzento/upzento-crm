import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  Headers,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto, ReviewStatus } from './dto/update-review.dto';
import { CreateReviewTagDto } from './dto/create-review-tag.dto';
import { CreateReviewServiceDto } from './dto/create-review-service.dto';
import { CreateReviewLocationDto } from './dto/create-review-location.dto';
import { CreateReviewWidgetDto } from './dto/create-review-widget.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard, TenantContextGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Review endpoints
  @Post()
  createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(createReviewDto);
  }

  @Get()
  findAllReviews(
    @Request() req,
    @Query('status') status?: string,
    @Query('source') source?: string,
    @Query('minRating') minRating?: string,
    @Query('maxRating') maxRating?: string,
    @Query('serviceId') serviceId?: string,
    @Query('locationId') locationId?: string,
    @Query('contactId') contactId?: string,
    @Query('tagId') tagId?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters = {
      status,
      source,
      minRating,
      maxRating,
      serviceId,
      locationId,
      contactId,
      tagId,
      search,
      startDate,
      endDate,
    };

    return this.reviewsService.findAllReviews(req.user.clientId, filters);
  }

  @Get('stats')
  getClientReviewStats(@Request() req) {
    return this.reviewsService.getClientReviewStats(req.user.clientId);
  }

  @Get(':id')
  findReviewById(@Param('id') id: string, @Request() req) {
    return this.reviewsService.findReviewById(id, req.user.clientId);
  }

  @Patch(':id')
  updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ) {
    return this.reviewsService.updateReview(id, req.user.clientId, updateReviewDto);
  }

  @Patch(':id/status')
  updateReviewStatus(
    @Param('id') id: string,
    @Body('status') status: ReviewStatus,
    @Request() req,
  ) {
    return this.reviewsService.updateReviewStatus(id, req.user.clientId, status);
  }

  @Delete(':id')
  deleteReview(@Param('id') id: string, @Request() req) {
    return this.reviewsService.deleteReview(id, req.user.clientId);
  }

  // Review Tag endpoints
  @Post('tags')
  createReviewTag(@Body() createReviewTagDto: CreateReviewTagDto) {
    return this.reviewsService.createReviewTag(createReviewTagDto);
  }

  @Get('tags')
  findAllReviewTags(@Request() req) {
    return this.reviewsService.findAllReviewTags(req.user.clientId);
  }

  @Get('tags/:id')
  findReviewTagById(@Param('id') id: string, @Request() req) {
    return this.reviewsService.findReviewTagById(id, req.user.clientId);
  }

  @Patch('tags/:id')
  updateReviewTag(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateReviewTagDto>,
    @Request() req,
  ) {
    return this.reviewsService.updateReviewTag(id, req.user.clientId, updateData);
  }

  @Delete('tags/:id')
  deleteReviewTag(@Param('id') id: string, @Request() req) {
    return this.reviewsService.deleteReviewTag(id, req.user.clientId);
  }

  // Review Service endpoints
  @Post('services')
  createReviewService(@Body() createReviewServiceDto: CreateReviewServiceDto) {
    return this.reviewsService.createReviewService(createReviewServiceDto);
  }

  @Get('services')
  findAllReviewServices(@Request() req) {
    return this.reviewsService.findAllReviewServices(req.user.clientId);
  }

  @Get('services/:id')
  findReviewServiceById(@Param('id') id: string, @Request() req) {
    return this.reviewsService.findReviewServiceById(id, req.user.clientId);
  }

  @Patch('services/:id')
  updateReviewService(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateReviewServiceDto>,
    @Request() req,
  ) {
    return this.reviewsService.updateReviewService(id, req.user.clientId, updateData);
  }

  @Delete('services/:id')
  deleteReviewService(@Param('id') id: string, @Request() req) {
    return this.reviewsService.deleteReviewService(id, req.user.clientId);
  }

  // Review Location endpoints
  @Post('locations')
  createReviewLocation(@Body() createReviewLocationDto: CreateReviewLocationDto) {
    return this.reviewsService.createReviewLocation(createReviewLocationDto);
  }

  @Get('locations')
  findAllReviewLocations(@Request() req) {
    return this.reviewsService.findAllReviewLocations(req.user.clientId);
  }

  @Get('locations/:id')
  findReviewLocationById(@Param('id') id: string, @Request() req) {
    return this.reviewsService.findReviewLocationById(id, req.user.clientId);
  }

  @Patch('locations/:id')
  updateReviewLocation(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateReviewLocationDto>,
    @Request() req,
  ) {
    return this.reviewsService.updateReviewLocation(id, req.user.clientId, updateData);
  }

  @Delete('locations/:id')
  deleteReviewLocation(@Param('id') id: string, @Request() req) {
    return this.reviewsService.deleteReviewLocation(id, req.user.clientId);
  }

  // Review Widget endpoints
  @Post('widgets')
  createReviewWidget(@Body() createReviewWidgetDto: CreateReviewWidgetDto) {
    return this.reviewsService.createReviewWidget(createReviewWidgetDto);
  }

  @Get('widgets')
  findAllReviewWidgets(@Request() req) {
    return this.reviewsService.findAllReviewWidgets(req.user.clientId);
  }

  @Get('widgets/:id')
  findReviewWidgetById(@Param('id') id: string, @Request() req) {
    return this.reviewsService.findReviewWidgetById(id, req.user.clientId);
  }

  @Patch('widgets/:id')
  updateReviewWidget(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateReviewWidgetDto>,
    @Request() req,
  ) {
    return this.reviewsService.updateReviewWidget(id, req.user.clientId, updateData);
  }

  @Delete('widgets/:id')
  deleteReviewWidget(@Param('id') id: string, @Request() req) {
    return this.reviewsService.deleteReviewWidget(id, req.user.clientId);
  }
} 