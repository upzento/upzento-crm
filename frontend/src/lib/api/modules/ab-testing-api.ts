import apiClient from '../api-client';
import { ApiResponse, ApiListResponse } from '@/types/api/common';

export interface ABTestVariant {
  id: string;
  name: string;
  content: string;
  subject?: string;
  previewText?: string;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue?: number;
  abTestId: string;
}

export interface ABTest {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'RUNNING' | 'COMPLETED';
  variants: ABTestVariant[];
  winningVariantId?: string;
  testPercentage: number;
  testDuration: number;
  metric: 'OPEN_RATE' | 'CLICK_RATE' | 'CONVERSION_RATE' | 'REVENUE';
  campaignId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ABTestResult {
  testId: string;
  status: 'RUNNING' | 'COMPLETED';
  winningVariantId?: string;
  variants: Array<{
    id: string;
    name: string;
    metrics: {
      sent: number;
      opened: number;
      clicked: number;
      converted: number;
      revenue?: number;
      openRate: number;
      clickRate: number;
      conversionRate: number;
      revenuePerRecipient?: number;
    };
    isWinner: boolean;
    confidence: number;
  }>;
  startedAt: string;
  completedAt?: string;
  duration: number;
}

export const abTestingApi = {
  // A/B Tests
  getTests: (campaignId?: string): Promise<ApiResponse<ABTest[]>> => 
    apiClient.get('/campaigns/ab-tests', { params: { campaignId } })
      .then(response => response.data),
  
  getTest: (id: string): Promise<ApiResponse<ABTest>> => 
    apiClient.get(`/campaigns/ab-tests/${id}`)
      .then(response => response.data),
  
  createTest: (campaignId: string, data: Partial<ABTest>): Promise<ApiResponse<ABTest>> => 
    apiClient.post(`/campaigns/${campaignId}/ab-tests`, data)
      .then(response => response.data),
  
  updateTest: (id: string, data: Partial<ABTest>): Promise<ApiResponse<ABTest>> => 
    apiClient.patch(`/campaigns/ab-tests/${id}`, data)
      .then(response => response.data),
  
  deleteTest: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/campaigns/ab-tests/${id}`)
      .then(response => response.data),
  
  // Test Variants
  createVariant: (testId: string, data: Partial<ABTestVariant>): Promise<ApiResponse<ABTestVariant>> => 
    apiClient.post(`/campaigns/ab-tests/${testId}/variants`, data)
      .then(response => response.data),
  
  updateVariant: (testId: string, variantId: string, data: Partial<ABTestVariant>): Promise<ApiResponse<ABTestVariant>> => 
    apiClient.patch(`/campaigns/ab-tests/${testId}/variants/${variantId}`, data)
      .then(response => response.data),
  
  deleteVariant: (testId: string, variantId: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/campaigns/ab-tests/${testId}/variants/${variantId}`)
      .then(response => response.data),
  
  // Test Results
  getTestResults: (testId: string): Promise<ApiResponse<ABTestResult>> => 
    apiClient.get(`/campaigns/ab-tests/${testId}/results`)
      .then(response => response.data),
  
  // Test Actions
  startTest: (testId: string): Promise<ApiResponse<ABTest>> => 
    apiClient.post(`/campaigns/ab-tests/${testId}/start`)
      .then(response => response.data),
  
  stopTest: (testId: string): Promise<ApiResponse<ABTest>> => 
    apiClient.post(`/campaigns/ab-tests/${testId}/stop`)
      .then(response => response.data),
  
  declareWinner: (testId: string, variantId: string): Promise<ApiResponse<ABTest>> => 
    apiClient.post(`/campaigns/ab-tests/${testId}/winner`, { variantId })
      .then(response => response.data),
  
  // Analytics
  getTestAnalytics: (testId: string): Promise<ApiResponse<{
    variantPerformance: Array<{
      variantId: string;
      variantName: string;
      metrics: {
        sent: number;
        opened: number;
        clicked: number;
        converted: number;
        revenue?: number;
      };
      rates: {
        openRate: number;
        clickRate: number;
        conversionRate: number;
        revenuePerRecipient?: number;
      };
    }>;
    timeSeriesData: Array<{
      date: string;
      variants: Array<{
        variantId: string;
        opens: number;
        clicks: number;
        conversions: number;
        revenue?: number;
      }>;
    }>;
    statisticalSignificance: {
      hasSignificantResult: boolean;
      confidenceLevel: number;
      recommendedAction?: 'CONTINUE' | 'DECLARE_WINNER' | 'STOP';
    };
  }>> => 
    apiClient.get(`/campaigns/ab-tests/${testId}/analytics`)
      .then(response => response.data),
};

export default abTestingApi; 