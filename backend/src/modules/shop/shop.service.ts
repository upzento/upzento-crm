import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProductDto, ProductStatus } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CreateShopWidgetDto } from './dto/create-shop-widget.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  // Product methods
  async createProduct(createProductDto: CreateProductDto) {
    const { categoryIds, variants, ...productData } = createProductDto;
    
    // Create the product
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        status: productData.status || ProductStatus.ACTIVE,
      },
    });

    // Add categories if provided
    if (categoryIds && categoryIds.length > 0) {
      await this.prisma.productToCategory.createMany({
        data: categoryIds.map(categoryId => ({
          productId: product.id,
          categoryId,
        })),
      });
    }

    // Add variants if provided
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        const { options, ...variantData } = variant;
        await this.prisma.productVariant.create({
          data: {
            ...variantData,
            options: options as unknown as Prisma.JsonObject,
            productId: product.id,
          },
        });
      }
    }

    return this.getProduct(product.id);
  }

  async getAllProducts(clientId: string, params: {
    skip?: number;
    take?: number;
    status?: ProductStatus;
    categoryId?: string;
    isFeatured?: boolean;
    search?: string;
  }) {
    const { skip, take, status, categoryId, isFeatured, search } = params;
    
    const where: Prisma.ProductWhereInput = { clientId };
    
    if (status) {
      where.status = status;
    }
    
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    let query: any = {
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        variants: true,
      },
    };

    if (categoryId) {
      query = {
        where: {
          clientId,
          categories: {
            some: {
              categoryId,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          variants: true,
        },
      };
    }

    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany(query),
      this.prisma.product.count({ where: query.where }),
    ]);

    return { products, totalCount };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const { categoryIds, variants, ...productData } = updateProductDto;
    
    // Check if product exists
    await this.getProduct(id);
    
    // Update the product
    await this.prisma.product.update({
      where: { id },
      data: productData,
    });

    // Update categories if provided
    if (categoryIds !== undefined) {
      // Delete existing category relationships
      await this.prisma.productToCategory.deleteMany({
        where: { productId: id },
      });
      
      // Create new category relationships
      if (categoryIds.length > 0) {
        await this.prisma.productToCategory.createMany({
          data: categoryIds.map(categoryId => ({
            productId: id,
            categoryId,
          })),
        });
      }
    }

    // Update variants if provided
    if (variants !== undefined) {
      // Delete existing variants
      await this.prisma.productVariant.deleteMany({
        where: { productId: id },
      });
      
      // Create new variants
      if (variants.length > 0) {
        for (const variant of variants) {
          const { options, ...variantData } = variant;
          await this.prisma.productVariant.create({
            data: {
              ...variantData,
              options: options as unknown as Prisma.JsonObject,
              productId: id,
            },
          });
        }
      }
    }

    return this.getProduct(id);
  }

  async deleteProduct(id: string) {
    // Check if product exists
    await this.getProduct(id);
    
    // Delete the product (cascade will handle related entities)
    await this.prisma.product.delete({
      where: { id },
    });

    return { id };
  }

  // Category methods
  async createCategory(createCategoryDto: CreateProductCategoryDto) {
    // Check if parent category exists if provided
    if (createCategoryDto.parentId) {
      const parentCategory = await this.prisma.productCategory.findUnique({
        where: { id: createCategoryDto.parentId },
      });
      
      if (!parentCategory) {
        throw new NotFoundException(`Parent category with ID ${createCategoryDto.parentId} not found`);
      }
    }
    
    return this.prisma.productCategory.create({
      data: createCategoryDto,
    });
  }

  async getAllCategories(clientId: string) {
    return this.prisma.productCategory.findMany({
      where: { clientId },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async getCategory(id: string) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: Partial<CreateProductCategoryDto>) {
    // Check if category exists
    await this.getCategory(id);
    
    // Check if parent category exists if provided
    if (updateCategoryDto.parentId) {
      const parentCategory = await this.prisma.productCategory.findUnique({
        where: { id: updateCategoryDto.parentId },
      });
      
      if (!parentCategory) {
        throw new NotFoundException(`Parent category with ID ${updateCategoryDto.parentId} not found`);
      }
      
      // Prevent circular references
      if (updateCategoryDto.parentId === id) {
        throw new BadRequestException('A category cannot be its own parent');
      }
    }
    
    return this.prisma.productCategory.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async deleteCategory(id: string) {
    // Check if category exists
    await this.getCategory(id);
    
    // Check if category has children
    const children = await this.prisma.productCategory.findMany({
      where: { parentId: id },
    });
    
    if (children.length > 0) {
      throw new BadRequestException('Cannot delete a category with child categories');
    }
    
    // Delete the category
    await this.prisma.productCategory.delete({
      where: { id },
    });

    return { id };
  }

  // Order methods
  async createOrder(createOrderDto: CreateOrderDto) {
    const { items, ...orderData } = createOrderDto;
    
    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];
    
    // Process each item
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          variants: true,
        },
      });
      
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }
      
      // Get variant if specified
      let variant = null;
      if (item.variantId) {
        variant = product.variants.find(v => v.id === item.variantId);
        if (!variant) {
          throw new NotFoundException(`Variant with ID ${item.variantId} not found`);
        }
      }
      
      // Determine price
      const price = variant?.price || product.price;
      const itemTotal = Number(price) * item.quantity;
      subtotal += itemTotal;
      
      // Create order item
      orderItems.push({
        quantity: item.quantity,
        price,
        total: itemTotal,
        productName: product.name,
        variantName: variant?.name,
        productOptions: variant?.options,
        productId: product.id,
        variantId: variant?.id,
      });
    }
    
    // Apply coupon if provided
    let discountTotal = 0;
    if (orderData.couponCode) {
      const coupon = await this.prisma.coupon.findFirst({
        where: {
          code: orderData.couponCode,
          clientId: orderData.clientId,
          isActive: true,
          OR: [
            { endDate: null },
            { endDate: { gte: new Date() } },
          ],
          AND: [
            { startDate: null },
            { startDate: { lte: new Date() } },
          ],
        },
      });
      
      if (!coupon) {
        throw new BadRequestException(`Invalid coupon code: ${orderData.couponCode}`);
      }
      
      // Check minimum order amount
      if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
        throw new BadRequestException(`Order total does not meet minimum amount for coupon: ${coupon.code}`);
      }
      
      // Calculate discount
      switch (coupon.type) {
        case 'PERCENTAGE':
          discountTotal = subtotal * (Number(coupon.value) / 100);
          break;
        case 'FIXED_AMOUNT':
          discountTotal = Number(coupon.value);
          break;
        case 'FREE_SHIPPING':
          // Shipping is free, handled later
          break;
      }
      
      // Update coupon usage count
      await this.prisma.coupon.update({
        where: { id: coupon.id },
        data: { usageCount: { increment: 1 } },
      });
    }
    
    // Calculate final totals
    const shippingTotal = 0; // Shipping calculation would go here
    const taxTotal = 0; // Tax calculation would go here
    const total = subtotal - discountTotal + shippingTotal + taxTotal;
    
    // Create the order
    const order = await this.prisma.order.create({
      data: {
        ...orderData,
        orderNumber,
        status: orderData.status || OrderStatus.PENDING,
        subtotal,
        discountTotal,
        shippingTotal,
        taxTotal,
        total,
        items: {
          create: orderItems,
        },
        events: {
          create: {
            type: 'CREATED',
            data: { message: 'Order created' } as unknown as Prisma.JsonObject,
          },
        },
      },
      include: {
        items: true,
        events: true,
      },
    });
    
    return order;
  }

  async getAllOrders(clientId: string, params: {
    skip?: number;
    take?: number;
    status?: OrderStatus;
    search?: string;
  }) {
    const { skip, take, status, search } = params;
    
    const where: Prisma.OrderWhereInput = { clientId };
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, totalCount] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          events: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, totalCount };
  }

  async getOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        events: true,
        contact: true,
        coupon: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    // Check if order exists
    const order = await this.getOrder(id);
    
    // Create event for status change if applicable
    if (updateOrderDto.status && updateOrderDto.status !== order.status) {
      await this.prisma.orderEvent.create({
        data: {
          orderId: id,
          type: 'STATUS_CHANGED',
          data: {
            oldStatus: order.status,
            newStatus: updateOrderDto.status,
          } as unknown as Prisma.JsonObject,
        },
      });
    }
    
    // Update the order
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        items: true,
        events: true,
      },
    });
  }

  // Coupon methods
  async createCoupon(createCouponDto: CreateCouponDto) {
    const { productIds, categoryIds, ...couponData } = createCouponDto;
    
    // Create the coupon
    const coupon = await this.prisma.coupon.create({
      data: couponData,
    });

    // Add products if provided
    if (productIds && productIds.length > 0) {
      await this.prisma.couponToProduct.createMany({
        data: productIds.map(productId => ({
          couponId: coupon.id,
          productId,
        })),
      });
    }

    // Add categories if provided
    if (categoryIds && categoryIds.length > 0) {
      await this.prisma.couponToCategory.createMany({
        data: categoryIds.map(categoryId => ({
          couponId: coupon.id,
          categoryId,
        })),
      });
    }

    return this.getCoupon(coupon.id);
  }

  async getAllCoupons(clientId: string) {
    return this.prisma.coupon.findMany({
      where: { clientId },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async getCoupon(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }

    return coupon;
  }

  async updateCoupon(id: string, updateCouponDto: Partial<CreateCouponDto>) {
    const { productIds, categoryIds, ...couponData } = updateCouponDto;
    
    // Check if coupon exists
    await this.getCoupon(id);
    
    // Update the coupon
    await this.prisma.coupon.update({
      where: { id },
      data: couponData,
    });

    // Update products if provided
    if (productIds !== undefined) {
      // Delete existing product relationships
      await this.prisma.couponToProduct.deleteMany({
        where: { couponId: id },
      });
      
      // Create new product relationships
      if (productIds.length > 0) {
        await this.prisma.couponToProduct.createMany({
          data: productIds.map(productId => ({
            couponId: id,
            productId,
          })),
        });
      }
    }

    // Update categories if provided
    if (categoryIds !== undefined) {
      // Delete existing category relationships
      await this.prisma.couponToCategory.deleteMany({
        where: { couponId: id },
      });
      
      // Create new category relationships
      if (categoryIds.length > 0) {
        await this.prisma.couponToCategory.createMany({
          data: categoryIds.map(categoryId => ({
            couponId: id,
            categoryId,
          })),
        });
      }
    }

    return this.getCoupon(id);
  }

  async deleteCoupon(id: string) {
    // Check if coupon exists
    await this.getCoupon(id);
    
    // Delete the coupon
    await this.prisma.coupon.delete({
      where: { id },
    });

    return { id };
  }

  // Shop Widget methods
  async createShopWidget(createShopWidgetDto: CreateShopWidgetDto) {
    return this.prisma.shopWidget.create({
      data: {
        ...createShopWidgetDto,
        theme: createShopWidgetDto.theme as unknown as Prisma.JsonObject,
        settings: createShopWidgetDto.settings as unknown as Prisma.JsonObject,
      },
    });
  }

  async getAllShopWidgets(clientId: string) {
    return this.prisma.shopWidget.findMany({
      where: { clientId },
    });
  }

  async getShopWidget(id: string) {
    const widget = await this.prisma.shopWidget.findUnique({
      where: { id },
    });

    if (!widget) {
      throw new NotFoundException(`Shop widget with ID ${id} not found`);
    }

    return widget;
  }

  async updateShopWidget(id: string, updateShopWidgetDto: Partial<CreateShopWidgetDto>) {
    // Check if widget exists
    await this.getShopWidget(id);
    
    // Update the widget
    return this.prisma.shopWidget.update({
      where: { id },
      data: {
        ...updateShopWidgetDto,
        theme: updateShopWidgetDto.theme as unknown as Prisma.JsonObject,
        settings: updateShopWidgetDto.settings as unknown as Prisma.JsonObject,
      },
    });
  }

  async deleteShopWidget(id: string) {
    // Check if widget exists
    await this.getShopWidget(id);
    
    // Delete the widget
    await this.prisma.shopWidget.delete({
      where: { id },
    });

    return { id };
  }

  // Domain verification for widgets
  async verifyDomain(widgetId: string, domain: string) {
    const widget = await this.getShopWidget(widgetId);
    
    // Check if domain is allowed
    const isAllowed = widget.allowedDomains.some(allowedDomain => {
      // Allow exact match or wildcard subdomains
      if (allowedDomain.startsWith('*.')) {
        const baseDomain = allowedDomain.substring(2);
        return domain.endsWith(baseDomain);
      }
      return domain === allowedDomain;
    });

    return isAllowed;
  }
} 