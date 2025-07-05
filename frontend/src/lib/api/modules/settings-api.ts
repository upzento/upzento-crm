import apiClient from '../api-client';

// Define TypeScript interfaces for settings data
export interface GeneralSettings {
  companyName: string;
  website: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  preferences: {
    darkMode: boolean;
    emailUpdates: boolean;
    timezone: string;
  };
}

export interface Domain {
  id: string;
  domain: string;
  verified: boolean;
  primary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  formSubmissions: boolean;
  reviewAlerts: boolean;
  appointmentReminders: boolean;
  chatMessages: boolean;
  marketingUpdates: boolean;
  systemUpdates: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  config?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number; // in minutes
  passwordExpiration: number; // in days, 0 means never
  dataRetention: number; // in months, 0 means forever
  activityLogging: boolean;
  dataSharing: boolean;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ip: string;
}

export interface ModuleSettings {
  [module: string]: {
    enabled: boolean;
    config: Record<string, any>;
  };
}

// Settings API client
export const settingsApi = {
  // General settings
  getGeneralSettings: () => 
    apiClient.get<GeneralSettings>('/settings/general'),
  
  updateGeneralSettings: (data: Partial<GeneralSettings>) => 
    apiClient.patch<GeneralSettings>('/settings/general', data),
  
  // Domain settings
  getDomains: () => 
    apiClient.get<Domain[]>('/settings/domains'),
  
  getDomain: (id: string) => 
    apiClient.get<Domain>(`/settings/domains/${id}`),
  
  createDomain: (domain: string) => 
    apiClient.post<Domain>('/settings/domains', { domain }),
  
  verifyDomain: (id: string) => 
    apiClient.post<Domain>(`/settings/domains/${id}/verify`),
  
  setPrimaryDomain: (id: string) => 
    apiClient.post<Domain>(`/settings/domains/${id}/primary`),
  
  deleteDomain: (id: string) => 
    apiClient.delete(`/settings/domains/${id}`),
  
  // Notification settings
  getNotificationSettings: () => 
    apiClient.get<NotificationSettings>('/settings/notifications'),
  
  updateNotificationSettings: (data: Partial<NotificationSettings>) => 
    apiClient.patch<NotificationSettings>('/settings/notifications', data),
  
  // Team management
  getTeamMembers: () => 
    apiClient.get<TeamMember[]>('/settings/team'),
  
  getTeamMember: (id: string) => 
    apiClient.get<TeamMember>(`/settings/team/${id}`),
  
  inviteTeamMember: (email: string, role: TeamMember['role']) => 
    apiClient.post<TeamMember>('/settings/team/invite', { email, role }),
  
  updateTeamMember: (id: string, data: Partial<TeamMember>) => 
    apiClient.patch<TeamMember>(`/settings/team/${id}`, data),
  
  removeTeamMember: (id: string) => 
    apiClient.delete(`/settings/team/${id}`),
  
  // Integrations
  getIntegrations: () => 
    apiClient.get<Integration[]>('/settings/integrations'),
  
  getIntegration: (id: string) => 
    apiClient.get<Integration>(`/settings/integrations/${id}`),
  
  connectIntegration: (id: string, config: Record<string, any>) => 
    apiClient.post<Integration>(`/settings/integrations/${id}/connect`, config),
  
  disconnectIntegration: (id: string) => 
    apiClient.post<Integration>(`/settings/integrations/${id}/disconnect`),
  
  updateIntegrationConfig: (id: string, config: Record<string, any>) => 
    apiClient.patch<Integration>(`/settings/integrations/${id}/config`, config),
  
  // Security settings
  getSecuritySettings: () => 
    apiClient.get<SecuritySettings>('/settings/security'),
  
  updateSecuritySettings: (data: Partial<SecuritySettings>) => 
    apiClient.patch<SecuritySettings>('/settings/security', data),
  
  enableTwoFactor: () => 
    apiClient.post<{ secret: string; qrCode: string }>('/settings/security/2fa/enable'),
  
  verifyTwoFactor: (token: string) => 
    apiClient.post<{ success: boolean }>('/settings/security/2fa/verify', { token }),
  
  disableTwoFactor: (token: string) => 
    apiClient.post<{ success: boolean }>('/settings/security/2fa/disable', { token }),
  
  changePassword: (currentPassword: string, newPassword: string) => 
    apiClient.post<{ success: boolean }>('/settings/security/change-password', { currentPassword, newPassword }),
  
  // Audit logs
  getAuditLogs: (params?: { 
    limit?: number; 
    offset?: number; 
    startDate?: string; 
    endDate?: string; 
    user?: string;
    action?: string;
  }) => 
    apiClient.get<{ logs: AuditLog[]; total: number }>('/settings/audit-logs', { params }),
  
  exportAuditLogs: (format: 'csv' | 'json', params?: { 
    startDate?: string; 
    endDate?: string; 
    user?: string;
    action?: string;
  }) => 
    apiClient.get('/settings/audit-logs/export', { 
      params: { ...params, format },
      responseType: 'blob' 
    }),

  // Module settings
  getModuleSettings: () => 
    apiClient.get<ModuleSettings>('/settings/modules'),
  
  updateModuleSettings: (module: string, data: { enabled: boolean; config: Record<string, any> }) => 
    apiClient.patch<ModuleSettings>(`/settings/modules/${module}`, data),
};

export default settingsApi; 