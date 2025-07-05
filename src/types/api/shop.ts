/**
 * Shop module types
 */

export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  inventory: number;
  options: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  status: ProductStatus;
  isFeatured: boolean;
  inventory: number;
  images: string[];
  categories: ProductCategory[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  clientId: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  parent?: ProductCategory;
  children?: ProductCategory[];
  clientId: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  total: number;
  productName: string;
  variantName?: string;
  productOptions?: Record<string, string>;
  productId: string;
  variantId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: OrderStatus;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  billingAddress?: BillingAddress;
  paymentMethod?: string;
  notes?: string;
  couponCode?: string;
  contactId?: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usageCount: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopWidget {
  id: string;
  name: string;
  type: 'PRODUCTS' | 'CATEGORIES' | 'FEATURED';
  config: Record<string, any>;
  isActive: boolean;
  domains: string[];
  clientId: string;
  createdAt: string;
  updatedAt: string;
} 