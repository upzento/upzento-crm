import { useState, useEffect, useCallback } from 'react';
import { settingsApi } from '../api';
import type {
  GeneralSettings,
  Domain,
  NotificationSettings,
  TeamMember,
  Integration,
  SecuritySettings,
  AuditLog
} from '../api/modules/settings-api';

interface UseSettingsOptions {
  autoFetch?: boolean;
}

export function useSettings(options: UseSettingsOptions = {}) {
  const { autoFetch = true } = options;
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // State for different settings
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null);
  const [domains, setDomains] = useState<Domain[] | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[] | null>(null);
  const [integrations, setIntegrations] = useState<Integration[] | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[] | null>(null);
  const [totalAuditLogs, setTotalAuditLogs] = useState<number>(0);
  
  // Function to fetch general settings
  const fetchGeneralSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.getGeneralSettings();
      setGeneralSettings(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch general settings'));
      console.error('Error fetching general settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to update general settings
  const updateGeneralSettings = useCallback(async (data: Partial<GeneralSettings>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.updateGeneralSettings(data);
      setGeneralSettings(response.data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update general settings'));
      console.error('Error updating general settings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to fetch domains
  const fetchDomains = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.getDomains();
      setDomains(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch domains'));
      console.error('Error fetching domains:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to fetch notification settings
  const fetchNotificationSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.getNotificationSettings();
      setNotificationSettings(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch notification settings'));
      console.error('Error fetching notification settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to update notification settings
  const updateNotificationSettings = useCallback(async (data: Partial<NotificationSettings>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.updateNotificationSettings(data);
      setNotificationSettings(response.data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update notification settings'));
      console.error('Error updating notification settings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to fetch team members
  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.getTeamMembers();
      setTeamMembers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch team members'));
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to fetch integrations
  const fetchIntegrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.getIntegrations();
      setIntegrations(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch integrations'));
      console.error('Error fetching integrations:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to fetch security settings
  const fetchSecuritySettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.getSecuritySettings();
      setSecuritySettings(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch security settings'));
      console.error('Error fetching security settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to update security settings
  const updateSecuritySettings = useCallback(async (data: Partial<SecuritySettings>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.updateSecuritySettings(data);
      setSecuritySettings(response.data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update security settings'));
      console.error('Error updating security settings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to fetch audit logs
  const fetchAuditLogs = useCallback(async (params?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
    user?: string;
    action?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.getAuditLogs(params);
      setAuditLogs(response.data.logs);
      setTotalAuditLogs(response.data.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch audit logs'));
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Auto-fetch data on initial load
  useEffect(() => {
    if (autoFetch) {
      fetchGeneralSettings();
      fetchDomains();
      fetchNotificationSettings();
      fetchTeamMembers();
      fetchIntegrations();
      fetchSecuritySettings();
      fetchAuditLogs({ limit: 10, offset: 0 });
    }
  }, [
    autoFetch,
    fetchGeneralSettings,
    fetchDomains,
    fetchNotificationSettings,
    fetchTeamMembers,
    fetchIntegrations,
    fetchSecuritySettings,
    fetchAuditLogs
  ]);
  
  return {
    // Data
    generalSettings,
    domains,
    notificationSettings,
    teamMembers,
    integrations,
    securitySettings,
    auditLogs,
    totalAuditLogs,
    
    // State
    loading,
    error,
    
    // Actions
    fetchGeneralSettings,
    updateGeneralSettings,
    fetchDomains,
    fetchNotificationSettings,
    updateNotificationSettings,
    fetchTeamMembers,
    fetchIntegrations,
    fetchSecuritySettings,
    updateSecuritySettings,
    fetchAuditLogs,
  };
} 