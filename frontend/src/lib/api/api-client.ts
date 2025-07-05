import axios from 'axios';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.upzento.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (in browser environments only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const response = await axios.post(
              `${apiClient.defaults.baseURL}/auth/refresh`,
              { refreshToken }
            );

            if (response.data.token) {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              
              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
              return apiClient(originalRequest);
            }
          }
        }
      } catch (refreshError) {
        // If refresh fails, log out user
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          // Redirect to login page
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// API functions for different modules
export const authApi = {
  login: (email: string, password: string) => 
    apiClient.post('/auth/login', { email, password }),
  
  refreshToken: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
  
  logout: () => apiClient.post('/auth/logout'),
};

export const usersApi = {
  getCurrentUser: () => apiClient.get('/users/me'),
  
  getUsers: (params?: any) => apiClient.get('/users', { params }),
  
  getUser: (id: string) => apiClient.get(`/users/${id}`),
  
  createUser: (data: any) => apiClient.post('/users', data),
  
  updateUser: (id: string, data: any) => apiClient.patch(`/users/${id}`, data),
  
  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),
};

export const tenantsApi = {
  getTenants: (params?: any) => apiClient.get('/tenants', { params }),
  
  getTenant: (id: string) => apiClient.get(`/tenants/${id}`),
  
  createTenant: (data: any) => apiClient.post('/tenants', data),
  
  updateTenant: (id: string, data: any) => apiClient.patch(`/tenants/${id}`, data),
  
  deleteTenant: (id: string) => apiClient.delete(`/tenants/${id}`),
};

export const agenciesApi = {
  getAgencies: (params?: any) => apiClient.get('/agencies', { params }),
  
  getAgency: (id: string) => apiClient.get(`/agencies/${id}`),
  
  createAgency: (data: any) => apiClient.post('/agencies', data),
  
  updateAgency: (id: string, data: any) => apiClient.patch(`/agencies/${id}`, data),
  
  deleteAgency: (id: string) => apiClient.delete(`/agencies/${id}`),
};

export const clientsApi = {
  getClients: (params?: any) => apiClient.get('/clients', { params }),
  
  getClient: (id: string) => apiClient.get(`/clients/${id}`),
  
  createClient: (data: any) => apiClient.post('/clients', data),
  
  updateClient: (id: string, data: any) => apiClient.patch(`/clients/${id}`, data),
  
  deleteClient: (id: string) => apiClient.delete(`/clients/${id}`),
};

export const contactsApi = {
  getContacts: (params?: any) => apiClient.get('/contacts', { params }),
  
  getContact: (id: string) => apiClient.get(`/contacts/${id}`),
  
  createContact: (data: any) => apiClient.post('/contacts', data),
  
  updateContact: (id: string, data: any) => apiClient.patch(`/contacts/${id}`, data),
  
  deleteContact: (id: string) => apiClient.delete(`/contacts/${id}`),
  
  searchContacts: (query: string) => apiClient.get(`/contacts/search?query=${encodeURIComponent(query)}`),
  
  // Tags related endpoints
  getTags: () => apiClient.get('/contacts/tags'),
  
  createTag: (data: any) => apiClient.post('/contacts/tags', data),
  
  updateTag: (id: string, data: any) => apiClient.patch(`/contacts/tags/${id}`, data),
  
  deleteTag: (id: string) => apiClient.delete(`/contacts/tags/${id}`),
  
  addTagToContact: (contactId: string, tagId: string) => 
    apiClient.post(`/contacts/${contactId}/tags/${tagId}`),
  
  removeTagFromContact: (contactId: string, tagId: string) => 
    apiClient.delete(`/contacts/${contactId}/tags/${tagId}`),
  
  // Lead management
  convertToLead: (id: string, leadStatus: string, leadSource: string) => 
    apiClient.post(`/contacts/${id}/convert-to-lead`, { leadStatus, leadSource }),
  
  convertToContact: (id: string) => 
    apiClient.post(`/contacts/${id}/convert-to-contact`),
  
  assignContact: (id: string, assignedToId: string) => 
    apiClient.post(`/contacts/${id}/assign`, { assignedToId }),
  
  // Custom Fields
  getCustomFields: () => apiClient.get('/contacts/custom-fields'),
  
  getCustomField: (id: string) => apiClient.get(`/contacts/custom-fields/${id}`),
  
  createCustomField: (data: {
    name: string;
    type: string;
    isRequired: boolean;
    options?: string[];
  }) => apiClient.post('/contacts/custom-fields', data),
  
  updateCustomField: (id: string, data: {
    name: string;
    type?: string;
    isRequired?: boolean;
    options?: string[];
  }) => apiClient.patch(`/contacts/custom-fields/${id}`, data),
  
  deleteCustomField: (id: string) => apiClient.delete(`/contacts/custom-fields/${id}`),
  
  reorderCustomFields: (fieldIds: string[]) => 
    apiClient.post('/contacts/custom-fields/reorder', { fieldIds }),
  
  // Import/Export
  importContacts: (data: any) => apiClient.post('/contacts/import', data),
  
  exportContacts: (tagIds?: string[]) => {
    const query = tagIds && tagIds.length ? `?tagIds=${tagIds.join(',')}` : '';
    return apiClient.get(`/contacts/export${query}`, { responseType: 'blob' });
  },
  
  // Duplicates management
  findDuplicates: () => apiClient.get('/contacts/duplicates'),
  
  mergeContacts: (primaryId: string, secondaryIds: string[]) => 
    apiClient.post('/contacts/merge', { primaryId, secondaryIds }),
  
  // Filtering
  filterByTags: (tagIds: string[]) => 
    apiClient.get(`/contacts/filter?tagIds=${tagIds.join(',')}`),
    
  // Lead Scoring
  getLeadScore: (contactId: string) => 
    apiClient.get(`/contacts/${contactId}/lead-score`),
  
  refreshLeadScore: (contactId: string) => 
    apiClient.post(`/contacts/${contactId}/lead-score/refresh`),
  
  getLeadScoreFactors: (contactId: string) => 
    apiClient.get(`/contacts/${contactId}/lead-score/factors`),
  
  getLeadScoreHistory: (contactId: string, params?: {
    startDate?: string;
    endDate?: string;
  }) => apiClient.get(`/contacts/${contactId}/lead-score/history`, { params }),
  
  // Activities
  getContactActivities: (contactId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get(`/contacts/${contactId}/activities`, { params }),
  
  createContactActivity: (contactId: string, data: {
    type: string;
    description: string;
    metadata?: any;
  }) => apiClient.post(`/contacts/${contactId}/activities`, data),
  
  updateContactActivity: (contactId: string, activityId: string, data: {
    description?: string;
    metadata?: any;
    status?: string;
  }) => apiClient.patch(`/contacts/${contactId}/activities/${activityId}`, data),
  
  deleteContactActivity: (contactId: string, activityId: string) => 
    apiClient.delete(`/contacts/${contactId}/activities/${activityId}`),
  
  getActivityTypes: () => apiClient.get('/contacts/activity-types'),
  
  getActivityStats: (contactId: string) => 
    apiClient.get(`/contacts/${contactId}/activity-stats`),
};

export default apiClient;

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async request(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: this.headers,
      credentials: 'include',
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Set authorization token
  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  // Clear authorization token
  clearAuthToken() {
    delete this.headers['Authorization'];
  }

  // HTTP Methods
  async get(endpoint: string) {
    return this.request('GET', endpoint);
  }

  async post(endpoint: string, data?: any) {
    return this.request('POST', endpoint, data);
  }

  async put(endpoint: string, data?: any) {
    return this.request('PUT', endpoint, data);
  }

  async patch(endpoint: string, data?: any) {
    return this.request('PATCH', endpoint, data);
  }

  async delete(endpoint: string) {
    return this.request('DELETE', endpoint);
  }
} 