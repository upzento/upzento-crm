import apiClient from '../api-client';
import { ApiResponse } from '@/types/api/common';

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

export interface ShippingRate {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimatedDays: { min: number; max: number };
  provider: string;
  providerLogo?: string;
  metadata?: Record<string, any>;
}

export interface ShippingLabel {
  id: string;
  trackingNumber: string;
  trackingUrl?: string;
  labelUrl: string;
  price: number;
  provider: string;
  createdAt: string;
}

export interface ShippingProvider {
  id: string;
  name: string;
  logo?: string;
  isActive: boolean;
  credentials: Record<string, any>;
  settings: Record<string, any>;
}

export const shippingApi = {
  // Shipping rates
  getShippingRates: (data: {
    items: Array<{ productId: string; variantId?: string; quantity: number }>;
    address: ShippingAddress;
  }): Promise<ApiResponse<ShippingRate[]>> => 
    apiClient.post('/shop/shipping/rates', data)
      .then(response => response.data),
  
  // Shipping labels
  createShippingLabel: (orderId: string, data: {
    provider: string;
    service: string;
    fromAddress?: ShippingAddress;
    toAddress: ShippingAddress;
    packageDetails: {
      weight: number;
      dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: 'cm' | 'in';
      };
      value?: number;
      description?: string;
    };
  }): Promise<ApiResponse<ShippingLabel>> => 
    apiClient.post(`/shop/orders/${orderId}/shipping/label`, data)
      .then(response => response.data),
  
  getShippingLabel: (labelId: string): Promise<ApiResponse<ShippingLabel>> => 
    apiClient.get(`/shop/shipping/labels/${labelId}`)
      .then(response => response.data),
  
  // Tracking
  getTrackingInfo: (trackingNumber: string, provider?: string): Promise<ApiResponse<{
    trackingNumber: string;
    status: string;
    estimatedDelivery?: string;
    events: Array<{
      date: string;
      status: string;
      location?: string;
      description?: string;
    }>;
  }>> => 
    apiClient.get('/shop/shipping/tracking', { params: { trackingNumber, provider } })
      .then(response => response.data),
  
  // Shipping providers
  getShippingProviders: (): Promise<ApiResponse<ShippingProvider[]>> => 
    apiClient.get('/shop/shipping/providers')
      .then(response => response.data),
  
  getShippingProvider: (id: string): Promise<ApiResponse<ShippingProvider>> => 
    apiClient.get(`/shop/shipping/providers/${id}`)
      .then(response => response.data),
  
  updateShippingProvider: (id: string, data: Partial<ShippingProvider>): Promise<ApiResponse<ShippingProvider>> => 
    apiClient.patch(`/shop/shipping/providers/${id}`, data)
      .then(response => response.data),
  
  // Shipping settings
  getShippingSettings: (): Promise<ApiResponse<{
    defaultProvider?: string;
    returnAddress?: ShippingAddress;
    freeShippingThreshold?: number;
    internationalShipping: boolean;
    restrictedCountries?: string[];
    taxSettings: {
      collectTax: boolean;
      taxRate?: number;
      automaticTax?: boolean;
    };
  }>> => 
    apiClient.get('/shop/shipping/settings')
      .then(response => response.data),
  
  updateShippingSettings: (data: any): Promise<ApiResponse<any>> => 
    apiClient.patch('/shop/shipping/settings', data)
      .then(response => response.data),
};

export default shippingApi; 