import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseUUIDPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';
import { RequiresTenantType } from '../auth/decorators/tenant-type.decorator';
import { ShopService } from './shop.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateProductDto, ProductStatus } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CreateShopWidgetDto } from './dto/create-shop-widget.dto';



@Controller('shop')
@UseGuards(JwtAuthGuard, TenantContextGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  // Product endpoints
  @Post('products')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.shopService.createProduct(createProductDto);
  }

  @Get('products')
  getAllProducts(
    @Query('clientId') clientId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: ProductStatus,
    @Query('categoryId') categoryId?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('search') search?: string,
  ) {
    return this.shopService.getAllProducts(clientId, {
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
      categoryId,
      isFeatured: isFeatured ? isFeatured === 'true' : undefined,
      search,
    });
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return this.shopService.getProduct(id);
  }

  @Patch('products/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.shopService.updateProduct(id, updateProductDto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.shopService.deleteProduct(id);
  }

  // Category endpoints
  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateProductCategoryDto) {
    return this.shopService.createCategory(createCategoryDto);
  }

  @Get('categories')
  getAllCategories(@Query('clientId') clientId: string) {
    return this.shopService.getAllCategories(clientId);
  }

  @Get('categories/:id')
  getCategory(@Param('id') id: string) {
    return this.shopService.getCategory(id);
  }

  @Patch('categories/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<CreateProductCategoryDto>,
  ) {
    return this.shopService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.shopService.deleteCategory(id);
  }

  // Order endpoints
  @Post('orders')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.shopService.createOrder(createOrderDto);
  }

  @Get('orders')
  getAllOrders(
    @Query('clientId') clientId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: OrderStatus,
    @Query('search') search?: string,
  ) {
    return this.shopService.getAllOrders(clientId, {
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
      search,
    });
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.shopService.getOrder(id);
  }

  @Patch('orders/:id')
  updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.shopService.updateOrder(id, updateOrderDto);
  }

  // Coupon endpoints
  @Post('coupons')
  createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return this.shopService.createCoupon(createCouponDto);
  }

  @Get('coupons')
  getAllCoupons(@Query('clientId') clientId: string) {
    return this.shopService.getAllCoupons(clientId);
  }

  @Get('coupons/:id')
  getCoupon(@Param('id') id: string) {
    return this.shopService.getCoupon(id);
  }

  @Patch('coupons/:id')
  updateCoupon(
    @Param('id') id: string,
    @Body() updateCouponDto: Partial<CreateCouponDto>,
  ) {
    return this.shopService.updateCoupon(id, updateCouponDto);
  }

  @Delete('coupons/:id')
  deleteCoupon(@Param('id') id: string) {
    return this.shopService.deleteCoupon(id);
  }

  // Shop Widget endpoints
  @Post('widgets')
  createShopWidget(@Body() createShopWidgetDto: CreateShopWidgetDto) {
    return this.shopService.createShopWidget(createShopWidgetDto);
  }

  @Get('widgets')
  getAllShopWidgets(@Query('clientId') clientId: string) {
    return this.shopService.getAllShopWidgets(clientId);
  }

  @Get('widgets/:id')
  getShopWidget(@Param('id') id: string) {
    return this.shopService.getShopWidget(id);
  }

  @Patch('widgets/:id')
  updateShopWidget(
    @Param('id') id: string,
    @Body() updateShopWidgetDto: Partial<CreateShopWidgetDto>,
  ) {
    return this.shopService.updateShopWidget(id, updateShopWidgetDto);
  }

  @Delete('widgets/:id')
  deleteShopWidget(@Param('id') id: string) {
    return this.shopService.deleteShopWidget(id);
  }

  // Domain verification
  @Get('widgets/:id/verify-domain')
  verifyDomain(
    @Param('id') id: string,
    @Query('domain') domain: string,
  ) {
    if (!domain) {
      throw new BadRequestException('Domain parameter is required');
    }
    return this.shopService.verifyDomain(id, domain);
  }
} 