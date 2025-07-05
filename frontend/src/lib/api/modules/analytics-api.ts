import { ApiClient } from '../api-client';

// Define TypeScript interfaces for analytics data
export interface TrafficData {
  name: string;
  website: number;
  social: number;
  email: number;
  referral: number;
}

export interface ConversionData {
  name: string;
  rate: number;
}

export interface ChannelData {
  name: string;
  value: number;
}

export interface DeviceData {
  name: string;
  value: number;
}

export interface KpiData {
  visitors: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  pageviews: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  conversionRate: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  bounceRate: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
}

export interface LandingPage {
  url: string;
  visits: number;
  bounce: string;
}

export interface GeographyData {
  country: string;
  visits: number;
  percent: string;
}

export interface FunnelStep {
  name: string;
  value: number;
}

export interface ConvertingPage {
  url: string;
  rate: string;
  conversions: number;
}

export interface ChannelConversion {
  name: string;
  rate: number;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  layout: Record<string, any>;
  isTemplate: boolean;
  isDefault: boolean;
  isPublic: boolean;
  clientId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  widgets?: Widget[];
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Widget {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  position: Record<string, any>;
  dashboardId: string;
  dataSourceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  dataType: string;
  query: Record<string, any>;
  cachedData?: Record<string, any>;
  lastRefresh?: string;
  integrationId: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  integration?: {
    id: string;
    name: string;
    type: string;
    status: string;
  };
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  metric: string;
  target: number;
  currentValue: number;
  period: string;
  startDate: string;
  endDate: string;
  status: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsOverview {
  summary: {
    totalIntegrations: number;
    connectedIntegrations: number;
    totalDashboards: number;
    totalDatasets: number;
    totalGoals: number;
    activeGoals: number;
  };
  integrations: Integration[];
  dashboards: Dashboard[];
  recentActivity: {
    lastSync?: string;
    errorCount: number;
  };
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync?: string;
  syncFrequency: string;
  errorMessage?: string;
  config?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIntegrationData {
  name: string;
  type: string;
  credentials: Record<string, any>;
  config?: Record<string, any>;
  syncFrequency?: string;
}

export interface UpdateIntegrationData {
  name?: string;
  credentials?: Record<string, any>;
  config?: Record<string, any>;
  status?: string;
  syncFrequency?: string;
  errorMessage?: string;
}

export class AnalyticsApi {
  constructor(private apiClient: ApiClient) {}

  // Integration methods
  async createIntegration(data: CreateIntegrationData): Promise<Integration> {
    const response = await this.apiClient.post('/analytics/integrations', data);
    return response.data;
  }

  async getIntegrations(): Promise<Integration[]> {
    const response = await this.apiClient.get('/analytics/integrations');
    return response.data;
  }

  async getIntegration(id: string): Promise<Integration> {
    const response = await this.apiClient.get(`/analytics/integrations/${id}`);
    return response.data;
  }

  async updateIntegration(id: string, data: UpdateIntegrationData): Promise<Integration> {
    const response = await this.apiClient.put(`/analytics/integrations/${id}`, data);
    return response.data;
  }

  async deleteIntegration(id: string): Promise<{ message: string }> {
    const response = await this.apiClient.delete(`/analytics/integrations/${id}`);
    return response.data;
  }

  async syncIntegration(id: string): Promise<{ message: string }> {
    const response = await this.apiClient.post(`/analytics/integrations/${id}/sync`);
    return response.data;
  }

  // Dashboard methods
  async createDashboard(data: {
    name: string;
    description?: string;
    layout?: Record<string, any>;
    isTemplate?: boolean;
    isDefault?: boolean;
    isPublic?: boolean;
  }): Promise<Dashboard> {
    const response = await this.apiClient.post('/analytics/dashboards', data);
    return response.data;
  }

  async getDashboards(): Promise<Dashboard[]> {
    const response = await this.apiClient.get('/analytics/dashboards');
    return response.data;
  }

  async getDashboard(id: string): Promise<Dashboard> {
    const response = await this.apiClient.get(`/analytics/dashboards/${id}`);
    return response.data;
  }

  async updateDashboard(id: string, data: {
    name?: string;
    description?: string;
    layout?: Record<string, any>;
    isTemplate?: boolean;
    isDefault?: boolean;
    isPublic?: boolean;
  }): Promise<Dashboard> {
    const response = await this.apiClient.put(`/analytics/dashboards/${id}`, data);
    return response.data;
  }

  async deleteDashboard(id: string): Promise<{ message: string }> {
    const response = await this.apiClient.delete(`/analytics/dashboards/${id}`);
    return response.data;
  }

  // Dataset methods
  async createDataset(data: {
    name: string;
    description?: string;
    dataType: string;
    query: Record<string, any>;
    integrationId: string;
  }): Promise<Dataset> {
    const response = await this.apiClient.post('/analytics/datasets', data);
    return response.data;
  }

  async getDatasets(): Promise<Dataset[]> {
    const response = await this.apiClient.get('/analytics/datasets');
    return response.data;
  }

  // Goal methods
  async createGoal(data: {
    name: string;
    description?: string;
    metric: string;
    target: number;
    period: string;
    startDate: string;
    endDate: string;
  }): Promise<Goal> {
    const response = await this.apiClient.post('/analytics/goals', data);
    return response.data;
  }

  async getGoals(): Promise<Goal[]> {
    const response = await this.apiClient.get('/analytics/goals');
    return response.data;
  }

    // Overview method
  async getOverview(): Promise<AnalyticsOverview> {
    const response = await this.apiClient.get('/analytics/overview');
    return response.data;
  }
}

export default AnalyticsApi; 