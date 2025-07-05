import apiClient from '../api-client';
import { ApiResponse, ApiListResponse, PaginationParams } from '@/types/api/common';
import { 
  Review,
  ReviewResponse,
  ReviewService,
  ReviewLocation,
  ReviewTag,
  ReviewWidget,
  ReviewStatistics,
  ReviewStatus,
  ReviewSource
} from '@/types/api/reviews';

interface ReviewParams extends PaginationParams {
  status?: ReviewStatus;
  source?: ReviewSource;
  minRating?: number;
  maxRating?: number;
  serviceId?: string;
  locationId?: string;
  tagIds?: string[];
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const reviewsApi = {
  // Review endpoints
  getReviews: (params?: ReviewParams): Promise<ApiListResponse<Review>> => 
    apiClient.get('/reviews', { params })
      .then(response => response.data),
  
  getReview: (id: string): Promise<ApiResponse<Review>> => 
    apiClient.get(`/reviews/${id}`)
      .then(response => response.data),
  
  createReview: (data: Partial<Review>): Promise<ApiResponse<Review>> => 
    apiClient.post('/reviews', data)
      .then(response => response.data),
  
  updateReview: (id: string, data: Partial<Review>): Promise<ApiResponse<Review>> => 
    apiClient.patch(`/reviews/${id}`, data)
      .then(response => response.data),
  
  deleteReview: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/reviews/${id}`)
      .then(response => response.data),
  
  updateReviewStatus: (id: string, status: ReviewStatus): Promise<ApiResponse<Review>> => 
    apiClient.patch(`/reviews/${id}/status`, { status })
      .then(response => response.data),
  
  // Review Response endpoints
  createResponse: (reviewId: string, data: Partial<ReviewResponse>): Promise<ApiResponse<ReviewResponse>> => 
    apiClient.post(`/reviews/${reviewId}/response`, data)
      .then(response => response.data),
  
  updateResponse: (reviewId: string, data: Partial<ReviewResponse>): Promise<ApiResponse<ReviewResponse>> => 
    apiClient.patch(`/reviews/${reviewId}/response`, data)
      .then(response => response.data),
  
  deleteResponse: (reviewId: string): Promise<ApiResponse<{ success: boolean }>> => 
    apiClient.delete(`/reviews/${reviewId}/response`)
      .then(response => response.data),
  
  // Review Service endpoints
  getServices: (): Promise<ApiResponse<ReviewService[]>> => 
    apiClient.get('/reviews/services')
      .then(response => response.data),
  
  getService: (id: string): Promise<ApiResponse<ReviewService>> => 
    apiClient.get(`/reviews/services/${id}`)
      .then(response => response.data),
  
  createService: (data: Partial<ReviewService>): Promise<ApiResponse<ReviewService>> => 
    apiClient.post('/reviews/services', data)
      .then(response => response.data),
  
  updateService: (id: string, data: Partial<ReviewService>): Promise<ApiResponse<ReviewService>> => 
    apiClient.patch(`/reviews/services/${id}`, data)
      .then(response => response.data),
  
  deleteService: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/reviews/services/${id}`)
      .then(response => response.data),
  
  // Review Location endpoints
  getLocations: (): Promise<ApiResponse<ReviewLocation[]>> => 
    apiClient.get('/reviews/locations')
      .then(response => response.data),
  
  getLocation: (id: string): Promise<ApiResponse<ReviewLocation>> => 
    apiClient.get(`/reviews/locations/${id}`)
      .then(response => response.data),
  
  createLocation: (data: Partial<ReviewLocation>): Promise<ApiResponse<ReviewLocation>> => 
    apiClient.post('/reviews/locations', data)
      .then(response => response.data),
  
  updateLocation: (id: string, data: Partial<ReviewLocation>): Promise<ApiResponse<ReviewLocation>> => 
    apiClient.patch(`/reviews/locations/${id}`, data)
      .then(response => response.data),
  
  deleteLocation: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/reviews/locations/${id}`)
      .then(response => response.data),
  
  // Review Tag endpoints
  getTags: (): Promise<ApiResponse<ReviewTag[]>> => 
    apiClient.get('/reviews/tags')
      .then(response => response.data),
  
  getTag: (id: string): Promise<ApiResponse<ReviewTag>> => 
    apiClient.get(`/reviews/tags/${id}`)
      .then(response => response.data),
  
  createTag: (data: Partial<ReviewTag>): Promise<ApiResponse<ReviewTag>> => 
    apiClient.post('/reviews/tags', data)
      .then(response => response.data),
  
  updateTag: (id: string, data: Partial<ReviewTag>): Promise<ApiResponse<ReviewTag>> => 
    apiClient.patch(`/reviews/tags/${id}`, data)
      .then(response => response.data),
  
  deleteTag: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/reviews/tags/${id}`)
      .then(response => response.data),
  
  // Review Widget endpoints
  getWidgets: (): Promise<ApiResponse<ReviewWidget[]>> => 
    apiClient.get('/reviews/widgets')
      .then(response => response.data),
  
  getWidget: (id: string): Promise<ApiResponse<ReviewWidget>> => 
    apiClient.get(`/reviews/widgets/${id}`)
      .then(response => response.data),
  
  createWidget: (data: Partial<ReviewWidget>): Promise<ApiResponse<ReviewWidget>> => 
    apiClient.post('/reviews/widgets', data)
      .then(response => response.data),
  
  updateWidget: (id: string, data: Partial<ReviewWidget>): Promise<ApiResponse<ReviewWidget>> => 
    apiClient.patch(`/reviews/widgets/${id}`, data)
      .then(response => response.data),
  
  deleteWidget: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/reviews/widgets/${id}`)
      .then(response => response.data),
  
  // External review sources
  syncExternalReviews: (source: ReviewSource, config: Record<string, any>): Promise<ApiResponse<{ success: boolean; count: number }>> => 
    apiClient.post('/reviews/sync', { source, config })
      .then(response => response.data),
  
  // AI-powered response suggestions
  getResponseSuggestions: (reviewId: string): Promise<ApiResponse<string[]>> => 
    apiClient.get(`/reviews/${reviewId}/suggestions`)
      .then(response => response.data),
  
  // Review statistics
  getStatistics: (params?: {
    startDate?: string;
    endDate?: string;
    serviceId?: string;
    locationId?: string;
  }): Promise<ApiResponse<ReviewStatistics>> => 
    apiClient.get('/reviews/statistics', { params })
      .then(response => response.data),
};

export default reviewsApi; 