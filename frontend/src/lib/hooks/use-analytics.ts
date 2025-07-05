import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../api';
import type { 
  KpiData, 
  TrafficData, 
  ConversionData, 
  ChannelData, 
  DeviceData, 
  Dashboard 
} from '../api/modules/analytics-api';

interface UseAnalyticsOptions {
  initialDateRange?: string;
  autoFetch?: boolean;
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { initialDateRange = '30d', autoFetch = true } = options;
  
  const [dateRange, setDateRange] = useState<string>(initialDateRange);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // State for different data types
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData[] | null>(null);
  const [conversionData, setConversionData] = useState<ConversionData[] | null>(null);
  const [channelData, setChannelData] = useState<ChannelData[] | null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData[] | null>(null);
  const [dashboards, setDashboards] = useState<Dashboard[] | null>(null);
  
  // Function to fetch all analytics data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        kpiResponse,
        trafficResponse,
        conversionResponse,
        channelResponse,
        deviceResponse,
        dashboardsResponse
      ] = await Promise.all([
        analyticsApi.getKpiData(dateRange),
        analyticsApi.getTrafficData(dateRange),
        analyticsApi.getConversionData(dateRange),
        analyticsApi.getChannelData(dateRange),
        analyticsApi.getDeviceData(dateRange),
        analyticsApi.getDashboards()
      ]);
      
      setKpiData(kpiResponse.data);
      setTrafficData(trafficResponse.data);
      setConversionData(conversionResponse.data);
      setChannelData(channelResponse.data);
      setDeviceData(deviceResponse.data);
      setDashboards(dashboardsResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics data'));
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);
  
  // Function to update date range and refresh data
  const updateDateRange = useCallback((newRange: string) => {
    setDateRange(newRange);
  }, []);
  
  // Auto-fetch data on initial load and when date range changes
  useEffect(() => {
    if (autoFetch) {
      fetchAllData();
    }
  }, [fetchAllData, autoFetch]);
  
  // Individual fetch functions for specific data types
  const fetchKpiData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await analyticsApi.getKpiData(dateRange);
      setKpiData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch KPI data'));
      console.error('Error fetching KPI data:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);
  
  const fetchTrafficData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await analyticsApi.getTrafficData(dateRange);
      setTrafficData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch traffic data'));
      console.error('Error fetching traffic data:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);
  
  const fetchConversionData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await analyticsApi.getConversionData(dateRange);
      setConversionData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversion data'));
      console.error('Error fetching conversion data:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);
  
  const fetchChannelData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await analyticsApi.getChannelData(dateRange);
      setChannelData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch channel data'));
      console.error('Error fetching channel data:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);
  
  const fetchDeviceData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await analyticsApi.getDeviceData(dateRange);
      setDeviceData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch device data'));
      console.error('Error fetching device data:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);
  
  const fetchDashboards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await analyticsApi.getDashboards();
      setDashboards(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboards'));
      console.error('Error fetching dashboards:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    // Data
    kpiData,
    trafficData,
    conversionData,
    channelData,
    deviceData,
    dashboards,
    
    // State
    dateRange,
    loading,
    error,
    
    // Actions
    fetchAllData,
    updateDateRange,
    fetchKpiData,
    fetchTrafficData,
    fetchConversionData,
    fetchChannelData,
    fetchDeviceData,
    fetchDashboards,
  };
} 