import apiClient from '../api-client';
import { ApiResponse, ApiListResponse, PaginationParams } from '@/types/api/common';
import { 
  Product, 
  ProductCategory, 
  Order, 
  Coupon, 
  ShopWidget,
  ProductStatus,
  OrderStatus
} from '@/types/api/shop';

interface ProductParams extends PaginationParams {
  status?: ProductStatus;
  categoryId?: string;
  isFeatured?: boolean;
  search?: string;
}

interface OrderParams extends PaginationParams {
  status?: OrderStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const shopApi = {
  // Product endpoints
  getProducts: (params?: ProductParams): Promise<ApiResponse<Product[]>> => 
    apiClient.get('/shop/products', { params })
      .then(response => response.data),
  
  getProduct: (id: string): Promise<ApiResponse<Product>> => 
    apiClient.get(`/shop/products/${id}`)
      .then(response => response.data),
  
  createProduct: (data: Partial<Product>): Promise<ApiResponse<Product>> => 
    apiClient.post('/shop/products', data)
      .then(response => response.data),
  
  updateProduct: (id: string, data: Partial<Product>): Promise<ApiResponse<Product>> => 
    apiClient.patch(`/shop/products/${id}`, data)
      .then(response => response.data),
  
  deleteProduct: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/shop/products/${id}`)
      .then(response => response.data),
  
  // Category endpoints
  getCategories: (): Promise<ApiResponse<ProductCategory[]>> => 
    apiClient.get('/shop/categories')
      .then(response => response.data),
  
  getCategory: (id: string): Promise<ApiResponse<ProductCategory>> => 
    apiClient.get(`/shop/categories/${id}`)
      .then(response => response.data),
  
  createCategory: (data: Partial<ProductCategory>): Promise<ApiResponse<ProductCategory>> => 
    apiClient.post('/shop/categories', data)
      .then(response => response.data),
  
  updateCategory: (id: string, data: Partial<ProductCategory>): Promise<ApiResponse<ProductCategory>> => 
    apiClient.patch(`/shop/categories/${id}`, data)
      .then(response => response.data),
  
  deleteCategory: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/shop/categories/${id}`)
      .then(response => response.data),
  
  // Order endpoints
  getOrders: (params?: OrderParams): Promise<ApiListResponse<Order>> => 
    apiClient.get('/shop/orders', { params })
      .then(response => response.data),
  
  getOrder: (id: string): Promise<ApiResponse<Order>> => 
    apiClient.get(`/shop/orders/${id}`)
      .then(response => response.data),
  
  createOrder: (data: Partial<Order>): Promise<ApiResponse<Order>> => 
    apiClient.post('/shop/orders', data)
      .then(response => response.data),
  
  updateOrderStatus: (id: string, status: OrderStatus): Promise<ApiResponse<Order>> => 
    apiClient.patch(`/shop/orders/${id}/status`, { status })
      .then(response => response.data),
  
  // Coupon endpoints
  getCoupons: (): Promise<ApiResponse<Coupon[]>> => 
    apiClient.get('/shop/coupons')
      .then(response => response.data),
  
  getCoupon: (id: string): Promise<ApiResponse<Coupon>> => 
    apiClient.get(`/shop/coupons/${id}`)
      .then(response => response.data),
  
  createCoupon: (data: Partial<Coupon>): Promise<ApiResponse<Coupon>> => 
    apiClient.post('/shop/coupons', data)
      .then(response => response.data),
  
  updateCoupon: (id: string, data: Partial<Coupon>): Promise<ApiResponse<Coupon>> => 
    apiClient.patch(`/shop/coupons/${id}`, data)
      .then(response => response.data),
  
  deleteCoupon: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/shop/coupons/${id}`)
      .then(response => response.data),
  
  // Shop Widget endpoints
  getWidgets: (): Promise<ApiResponse<ShopWidget[]>> => 
    apiClient.get('/shop/widgets')
      .then(response => response.data),
  
  getWidget: (id: string): Promise<ApiResponse<ShopWidget>> => 
    apiClient.get(`/shop/widgets/${id}`)
      .then(response => response.data),
  
  createWidget: (data: Partial<ShopWidget>): Promise<ApiResponse<ShopWidget>> => 
    apiClient.post('/shop/widgets', data)
      .then(response => response.data),
  
  updateWidget: (id: string, data: Partial<ShopWidget>): Promise<ApiResponse<ShopWidget>> => 
    apiClient.patch(`/shop/widgets/${id}`, data)
      .then(response => response.data),
  
  deleteWidget: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/shop/widgets/${id}`)
      .then(response => response.data),
  
  // Shipping methods
  getShippingRates: (data: {
    items: Array<{ productId: string; variantId?: string; quantity: number }>;
    address: {
      postalCode: string;
      country: string;
      state?: string;
    };
  }): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    estimatedDays: { min: number; max: number };
  }>>> => 
    apiClient.post('/shop/shipping/rates', data)
      .then(response => response.data),
};

export default shopApi; 