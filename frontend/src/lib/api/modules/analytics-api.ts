import apiClient from '../api-client';

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
  id: number;
  name: string;
  type: 'marketing' | 'sales' | 'website' | 'customers';
}

// Analytics API client
export const analyticsApi = {
  // Overview data
  getOverviewData: (dateRange: string = '30d') => 
    apiClient.get('/analytics/overview', { params: { dateRange } }),
  
  // KPI metrics
  getKpiData: (dateRange: string = '30d') => 
    apiClient.get<KpiData>('/analytics/kpi', { params: { dateRange } }),
  
  // Traffic data
  getTrafficData: (dateRange: string = '30d') => 
    apiClient.get<TrafficData[]>('/analytics/traffic', { params: { dateRange } }),
  
  // Conversion data
  getConversionData: (dateRange: string = '30d') => 
    apiClient.get<ConversionData[]>('/analytics/conversions', { params: { dateRange } }),
  
  // Channel distribution
  getChannelData: (dateRange: string = '30d') => 
    apiClient.get<ChannelData[]>('/analytics/channels', { params: { dateRange } }),
  
  // Device distribution
  getDeviceData: (dateRange: string = '30d') => 
    apiClient.get<DeviceData[]>('/analytics/devices', { params: { dateRange } }),
  
  // Landing pages
  getLandingPages: (dateRange: string = '30d', limit: number = 5) => 
    apiClient.get<LandingPage[]>('/analytics/landing-pages', { params: { dateRange, limit } }),
  
  // Geography data
  getGeographyData: (dateRange: string = '30d', limit: number = 6) => 
    apiClient.get<GeographyData[]>('/analytics/geography', { params: { dateRange, limit } }),
  
  // Conversion funnel
  getConversionFunnel: (dateRange: string = '30d') => 
    apiClient.get<FunnelStep[]>('/analytics/conversion-funnel', { params: { dateRange } }),
  
  // Top converting pages
  getConvertingPages: (dateRange: string = '30d', limit: number = 5) => 
    apiClient.get<ConvertingPage[]>('/analytics/converting-pages', { params: { dateRange, limit } }),
  
  // Channel conversion rates
  getChannelConversions: (dateRange: string = '30d') => 
    apiClient.get<ChannelConversion[]>('/analytics/channel-conversions', { params: { dateRange } }),
  
  // Dashboards
  getDashboards: () => 
    apiClient.get<Dashboard[]>('/analytics/dashboards'),
  
  getDashboard: (id: number) => 
    apiClient.get(`/analytics/dashboards/${id}`),
  
  createDashboard: (data: Omit<Dashboard, 'id'>) => 
    apiClient.post('/analytics/dashboards', data),
  
  updateDashboard: (id: number, data: Partial<Dashboard>) => 
    apiClient.patch(`/analytics/dashboards/${id}`, data),
  
  deleteDashboard: (id: number) => 
    apiClient.delete(`/analytics/dashboards/${id}`),

  // Custom date range queries
  getCustomRangeData: (startDate: string, endDate: string, metrics: string[]) =>
    apiClient.get('/analytics/custom', { params: { startDate, endDate, metrics } }),
};

export default analyticsApi; 