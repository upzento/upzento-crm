import apiClient from '../api-client';
import { ApiResponse } from '@/types/api/common';
import { ReviewSource } from '@/types/api/reviews';

export interface ExternalReviewSource {
  id: string;
  name: string;
  type: ReviewSource;
  isConnected: boolean;
  lastSyncAt?: string;
  reviewCount: number;
  averageRating: number;
  credentials?: Record<string, any>;
  settings: {
    autoSync: boolean;
    syncFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    autoRespond: boolean;
    responseTemplate?: string;
  };
}

export interface ExternalReviewSyncResult {
  success: boolean;
  source: ReviewSource;
  newReviews: number;
  updatedReviews: number;
  failedReviews: number;
  totalReviews: number;
  syncTime: string;
}

export interface AIResponseSuggestion {
  text: string;
  tone: 'PROFESSIONAL' | 'FRIENDLY' | 'APOLOGETIC' | 'THANKFUL';
  confidence: number;
}

export const externalReviewsApi = {
  // External review sources
  getSources: (): Promise<ApiResponse<ExternalReviewSource[]>> => 
    apiClient.get('/reviews/external/sources')
      .then(response => response.data),
  
  getSource: (id: string): Promise<ApiResponse<ExternalReviewSource>> => 
    apiClient.get(`/reviews/external/sources/${id}`)
      .then(response => response.data),
  
  connectSource: (type: ReviewSource, credentials: Record<string, any>): Promise<ApiResponse<ExternalReviewSource>> => 
    apiClient.post('/reviews/external/connect', { type, credentials })
      .then(response => response.data),
  
  updateSourceSettings: (id: string, settings: Partial<ExternalReviewSource['settings']>): Promise<ApiResponse<ExternalReviewSource>> => 
    apiClient.patch(`/reviews/external/sources/${id}/settings`, settings)
      .then(response => response.data),
  
  disconnectSource: (id: string): Promise<ApiResponse<{ success: boolean }>> => 
    apiClient.delete(`/reviews/external/sources/${id}`)
      .then(response => response.data),
  
  // Sync operations
  syncSource: (id: string): Promise<ApiResponse<ExternalReviewSyncResult>> => 
    apiClient.post(`/reviews/external/sources/${id}/sync`)
      .then(response => response.data),
  
  getSyncHistory: (id: string): Promise<ApiResponse<{
    source: ReviewSource;
    syncs: Array<{
      id: string;
      startTime: string;
      endTime: string;
      status: 'COMPLETED' | 'FAILED' | 'IN_PROGRESS';
      newReviews: number;
      updatedReviews: number;
      failedReviews: number;
      error?: string;
    }>;
  }>> => 
    apiClient.get(`/reviews/external/sources/${id}/sync-history`)
      .then(response => response.data),
  
  // AI response suggestions
  getResponseSuggestions: (reviewId: string, options?: {
    tone?: 'PROFESSIONAL' | 'FRIENDLY' | 'APOLOGETIC' | 'THANKFUL';
    maxSuggestions?: number;
  }): Promise<ApiResponse<AIResponseSuggestion[]>> => 
    apiClient.get(`/reviews/${reviewId}/ai-suggestions`, { params: options })
      .then(response => response.data),
  
  generateCustomResponse: (reviewId: string, prompt: string): Promise<ApiResponse<{
    text: string;
    prompt: string;
  }>> => 
    apiClient.post(`/reviews/${reviewId}/ai-generate`, { prompt })
      .then(response => response.data),
  
  // Review response templates
  getResponseTemplates: (): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    content: string;
    variables: string[];
    tone: string;
    rating?: number;
    isDefault: boolean;
  }>
>> => 
    apiClient.get('/reviews/response-templates')
      .then(response => response.data),
  
  createResponseTemplate: (data: {
    name: string;
    content: string;
    tone: string;
    rating?: number;
    isDefault?: boolean;
  }): Promise<ApiResponse<{
    id: string;
    name: string;
    content: string;
    variables: string[];
    tone: string;
    rating?: number;
    isDefault: boolean;
  }>> => 
    apiClient.post('/reviews/response-templates', data)
      .then(response => response.data),
  
  updateResponseTemplate: (id: string, data: {
    name?: string;
    content?: string;
    tone?: string;
    rating?: number;
    isDefault?: boolean;
  }): Promise<ApiResponse<{
    id: string;
    name: string;
    content: string;
    variables: string[];
    tone: string;
    rating?: number;
    isDefault: boolean;
  }>> => 
    apiClient.patch(`/reviews/response-templates/${id}`, data)
      .then(response => response.data),
  
  deleteResponseTemplate: (id: string): Promise<ApiResponse<{ success: boolean }>> => 
    apiClient.delete(`/reviews/response-templates/${id}`)
      .then(response => response.data),
};

export default externalReviewsApi; 