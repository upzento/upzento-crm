import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseUUIDPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';
import { RequiresTenantType } from '../auth/decorators/tenant-type.decorator';
import { Shop-embedService } from './shop-embed.service';
import {
  Controller,
  Get,
  Param,
  Query,
  Headers,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ShopService } from './shop.service';

@Controller('shop-embed')
export class ShopEmbedController {
  constructor(private readonly shopService: ShopService) {}

  /**
   * Get public widget data with domain verification
   */
  @Get('widgets/:id')
  async getPublicWidget(
    @Param('id') id: string,
    @Headers('origin') origin: string,
    @Headers('referer') referer: string,
  ) {
    // Extract domain from origin or referer for verification
    let domain = '';
    
    if (origin) {
      try {
        domain = new URL(origin).hostname;
      } catch (error) {
        throw new ForbiddenException('Invalid origin header');
      }
    } else if (referer) {
      try {
        domain = new URL(referer).hostname;
      } catch (error) {
        throw new ForbiddenException('Invalid referer header');
      }
    } else {
      throw new ForbiddenException('Missing origin or referer header');
    }
    
    // Verify domain is allowed
    const isAllowed = await this.shopService.verifyDomain(id, domain);
    
    if (!isAllowed) {
      throw new ForbiddenException(`Domain ${domain} is not authorized for this widget`);
    }
    
    // Get widget data
    const widget = await this.shopService.getShopWidget(id);
    
    return widget;
  }

  /**
   * Get products for a widget
   */
  @Get('widgets/:id/products')
  async getWidgetProducts(
    @Param('id') id: string,
    @Headers('origin') origin: string,
    @Headers('referer') referer: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    // Extract domain from origin or referer for verification
    let domain = '';
    
    if (origin) {
      try {
        domain = new URL(origin).hostname;
      } catch (error) {
        throw new ForbiddenException('Invalid origin header');
      }
    } else if (referer) {
      try {
        domain = new URL(referer).hostname;
      } catch (error) {
        throw new ForbiddenException('Invalid referer header');
      }
    } else {
      throw new ForbiddenException('Missing origin or referer header');
    }
    
    // Verify domain is allowed
    const isAllowed = await this.shopService.verifyDomain(id, domain);
    
    if (!isAllowed) {
      throw new ForbiddenException(`Domain ${domain} is not authorized for this widget`);
    }
    
    // Get widget data
    const widget = await this.shopService.getShopWidget(id);
    
    // Get products based on widget settings
    const settings = widget.settings as any;
    const productIds = settings?.productIds || [];
    const widgetCategoryIds = settings?.categoryIds || [];
    
    // Determine which category to filter by (widget setting or query param)
    const filterCategoryId = categoryId || (widgetCategoryIds.length > 0 ? widgetCategoryIds[0] : undefined);
    
    // Get products for the client
    return this.shopService.getAllProducts(widget.clientId, {
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 20,
      status: 'ACTIVE',
      categoryId: filterCategoryId,
      isFeatured: widget.type === 'FEATURED_PRODUCTS' ? true : undefined,
      search,
    });
  }

  /**
   * Get a specific product
   */
  @Get('products/:id')
  async getPublicProduct(
    @Param('id') id: string,
    @Headers('origin') origin: string,
    @Headers('referer') referer: string,
  ) {
    // Get the product
    const product = await this.shopService.getProduct(id);
    
    // For public access, only return active products
    if (product.status !== 'ACTIVE') {
      throw new NotFoundException('Product not found');
    }
    
    // Extract domain from origin or referer for verification
    let domain = '';
    
    if (origin) {
      try {
        domain = new URL(origin).hostname;
      } catch (error) {
        throw new ForbiddenException('Invalid origin header');
      }
    } else if (referer) {
      try {
        domain = new URL(referer).hostname;
      } catch (error) {
        throw new ForbiddenException('Invalid referer header');
      }
    } else {
      throw new ForbiddenException('Missing origin or referer header');
    }
    
    // Find any widget for this client that allows this domain
    const widgets = await this.shopService.getAllShopWidgets(product.clientId);
    
    let isAllowed = false;
    for (const widget of widgets) {
      isAllowed = widget.allowedDomains.some(allowedDomain => {
        // Allow exact match or wildcard subdomains
        if (allowedDomain.startsWith('*.')) {
          const baseDomain = allowedDomain.substring(2);
          return domain.endsWith(baseDomain);
        }
        return domain === allowedDomain;
      });
      
      if (isAllowed) break;
    }
    
    if (!isAllowed) {
      throw new ForbiddenException(`Domain ${domain} is not authorized`);
    }
    
    return product;
  }

  /**
   * Get categories for a widget
   */
  @Get('widgets/:id/categories')
  async getWidgetCategories(
    @Param('id') id: string,
    @Headers('origin') origin: string,
    @Headers('referer') referer: string,
  ) {
    // Extract domain from origin or referer for verification
    let domain = '';
    
    if (origin) {
      try {
        domain = new URL(origin).hostname;
      } catch (error) {
        throw new ForbiddenException('Invalid origin header');
      }
    } else if (referer) {
      try {
        domain = new URL(referer).hostname;
      } catch (error) {
        throw new ForbiddenException('Invalid referer header');
      }
    } else {
      throw new ForbiddenException('Missing origin or referer header');
    }
    
    // Verify domain is allowed
    const isAllowed = await this.shopService.verifyDomain(id, domain);
    
    if (!isAllowed) {
      throw new ForbiddenException(`Domain ${domain} is not authorized for this widget`);
    }
    
    // Get widget data
    const widget = await this.shopService.getShopWidget(id);
    
    // Get categories for the client
    return this.shopService.getAllCategories(widget.clientId);
  }

  /**
   * Create an order from the widget
   */
  @Get('widgets/:id/validate-coupon')
  async validateCoupon(
    @Param('id') id: string,
    @Query('code') code: string,
    @Headers('origin') origin: string,
    @Headers('referer') referer: string,
  ) {
    if (!code) {
      throw new NotFoundException('Coupon not found');
    }
    
    // Extract domain from origin or referer for verification
    let domain = '';
    
    if (origin) {
      try {
        domain = new URL(origin).hostname;
      } catch (error) {
        throw new ForbiddenException('Invalid origin header');
      }
    } else if (referer) {
      try {
        domain = new URL(referer).hostname;
      } catch (error) {
        throw new ForbiddenException('Invalid referer header');
      }
    } else {
      throw new ForbiddenException('Missing origin or referer header');
    }
    
    // Verify domain is allowed
    const isAllowed = await this.shopService.verifyDomain(id, domain);
    
    if (!isAllowed) {
      throw new ForbiddenException(`Domain ${domain} is not authorized for this widget`);
    }
    
    // Get widget data
    const widget = await this.shopService.getShopWidget(id);
    
    // Find coupon by code
    const coupons = await this.shopService.getAllCoupons(widget.clientId);
    const coupon = coupons.find(c => 
      c.code === code && 
      c.isActive && 
      (!c.endDate || new Date(c.endDate) > new Date()) &&
      (!c.startDate || new Date(c.startDate) <= new Date())
    );
    
    if (!coupon) {
      throw new NotFoundException('Coupon not found or expired');
    }
    
    // Return coupon details (excluding sensitive info)
    return {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount,
      description: coupon.description,
    };
  }
} 