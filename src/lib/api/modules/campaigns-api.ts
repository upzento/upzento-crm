import apiClient from '../api-client';
import { ApiResponse, ApiListResponse, PaginationParams } from '@/types/api/common';
import { 
  Campaign,
  CampaignSegment,
  CampaignMessage,
  CampaignTemplate,
  CampaignAnalytics,
  ABTest,
  AutomationWorkflow,
  CampaignStatus,
  CampaignType
} from '@/types/api/campaigns';

interface CampaignParams extends PaginationParams {
  status?: CampaignStatus;
  type?: CampaignType;
  search?: string;
}

export const campaignsApi = {
  // Campaign endpoints
  getCampaigns: (params?: CampaignParams): Promise<ApiListResponse<Campaign>> => 
    apiClient.get('/campaigns', { params })
      .then(response => response.data),
  
  getCampaign: (id: string): Promise<ApiResponse<Campaign>> => 
    apiClient.get(`/campaigns/${id}`)
      .then(response => response.data),
  
  createCampaign: (data: Partial<Campaign>): Promise<ApiResponse<Campaign>> => 
    apiClient.post('/campaigns', data)
      .then(response => response.data),
  
  updateCampaign: (id: string, data: Partial<Campaign>): Promise<ApiResponse<Campaign>> => 
    apiClient.patch(`/campaigns/${id}`, data)
      .then(response => response.data),
  
  deleteCampaign: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/campaigns/${id}`)
      .then(response => response.data),
  
  updateCampaignStatus: (id: string, status: CampaignStatus): Promise<ApiResponse<Campaign>> => 
    apiClient.patch(`/campaigns/${id}/status`, { status })
      .then(response => response.data),
  
  // Segment endpoints
  getSegments: (): Promise<ApiResponse<CampaignSegment[]>> => 
    apiClient.get('/campaigns/segments')
      .then(response => response.data),
  
  getSegment: (id: string): Promise<ApiResponse<CampaignSegment>> => 
    apiClient.get(`/campaigns/segments/${id}`)
      .then(response => response.data),
  
  createSegment: (data: Partial<CampaignSegment>): Promise<ApiResponse<CampaignSegment>> => 
    apiClient.post('/campaigns/segments', data)
      .then(response => response.data),
  
  updateSegment: (id: string, data: Partial<CampaignSegment>): Promise<ApiResponse<CampaignSegment>> => 
    apiClient.patch(`/campaigns/segments/${id}`, data)
      .then(response => response.data),
  
  deleteSegment: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/campaigns/segments/${id}`)
      .then(response => response.data),
  
  // Message endpoints
  getMessage: (id: string): Promise<ApiResponse<CampaignMessage>> => 
    apiClient.get(`/campaigns/messages/${id}`)
      .then(response => response.data),
  
  createMessage: (campaignId: string, data: Partial<CampaignMessage>): Promise<ApiResponse<CampaignMessage>> => 
    apiClient.post(`/campaigns/${campaignId}/messages`, data)
      .then(response => response.data),
  
  updateMessage: (id: string, data: Partial<CampaignMessage>): Promise<ApiResponse<CampaignMessage>> => 
    apiClient.patch(`/campaigns/messages/${id}`, data)
      .then(response => response.data),
  
  // Template endpoints
  getTemplates: (type?: CampaignType): Promise<ApiResponse<CampaignTemplate[]>> => 
    apiClient.get('/campaigns/templates', { params: { type } })
      .then(response => response.data),
  
  getTemplate: (id: string): Promise<ApiResponse<CampaignTemplate>> => 
    apiClient.get(`/campaigns/templates/${id}`)
      .then(response => response.data),
  
  createTemplate: (data: Partial<CampaignTemplate>): Promise<ApiResponse<CampaignTemplate>> => 
    apiClient.post('/campaigns/templates', data)
      .then(response => response.data),
  
  updateTemplate: (id: string, data: Partial<CampaignTemplate>): Promise<ApiResponse<CampaignTemplate>> => 
    apiClient.patch(`/campaigns/templates/${id}`, data)
      .then(response => response.data),
  
  deleteTemplate: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/campaigns/templates/${id}`)
      .then(response => response.data),
  
  // A/B Test endpoints
  getABTests: (campaignId: string): Promise<ApiResponse<ABTest[]>> => 
    apiClient.get(`/campaigns/${campaignId}/ab-tests`)
      .then(response => response.data),
  
  getABTest: (id: string): Promise<ApiResponse<ABTest>> => 
    apiClient.get(`/campaigns/ab-tests/${id}`)
      .then(response => response.data),
  
  createABTest: (campaignId: string, data: Partial<ABTest>): Promise<ApiResponse<ABTest>> => 
    apiClient.post(`/campaigns/${campaignId}/ab-tests`, data)
      .then(response => response.data),
  
  updateABTest: (id: string, data: Partial<ABTest>): Promise<ApiResponse<ABTest>> => 
    apiClient.patch(`/campaigns/ab-tests/${id}`, data)
      .then(response => response.data),
  
  deleteABTest: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/campaigns/ab-tests/${id}`)
      .then(response => response.data),
  
  // Automation Workflow endpoints
  getWorkflows: (): Promise<ApiResponse<AutomationWorkflow[]>> => 
    apiClient.get('/campaigns/workflows')
      .then(response => response.data),
  
  getWorkflow: (id: string): Promise<ApiResponse<AutomationWorkflow>> => 
    apiClient.get(`/campaigns/workflows/${id}`)
      .then(response => response.data),
  
  createWorkflow: (data: Partial<AutomationWorkflow>): Promise<ApiResponse<AutomationWorkflow>> => 
    apiClient.post('/campaigns/workflows', data)
      .then(response => response.data),
  
  updateWorkflow: (id: string, data: Partial<AutomationWorkflow>): Promise<ApiResponse<AutomationWorkflow>> => 
    apiClient.patch(`/campaigns/workflows/${id}`, data)
      .then(response => response.data),
  
  deleteWorkflow: (id: string): Promise<ApiResponse<{ id: string }>> => 
    apiClient.delete(`/campaigns/workflows/${id}`)
      .then(response => response.data),
  
  toggleWorkflow: (id: string, isActive: boolean): Promise<ApiResponse<AutomationWorkflow>> => 
    apiClient.patch(`/campaigns/workflows/${id}/toggle`, { isActive })
      .then(response => response.data),
  
  // Analytics endpoints
  getCampaignAnalytics: (campaignId: string): Promise<ApiResponse<CampaignAnalytics>> => 
    apiClient.get(`/campaigns/${campaignId}/analytics`)
      .then(response => response.data),
  
  trackEvent: (campaignId: string, recipientId: string, event: string, data?: any): Promise<ApiResponse<{ success: boolean }>> => 
    apiClient.post(`/campaigns/${campaignId}/track`, { recipientId, event, data })
      .then(response => response.data),
};

export default campaignsApi; 