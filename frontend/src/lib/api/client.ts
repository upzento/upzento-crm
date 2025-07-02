'use client';

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// API client configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const TOKEN_COOKIE_NAME = 'upzento_token';
const REFRESH_TOKEN_COOKIE_NAME = 'upzento_refresh_token';

// Types
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  tenantContext: TenantContext;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  agencyId?: string;
  clientId?: string;
}

export interface TenantContext {
  isAdmin?: boolean;
  agencyId?: string;
  isAgencyUser?: boolean;
  isAgencyAdmin?: boolean;
  clientId?: string;
  isClientUser?: boolean;
  isClientAdmin?: boolean;
}

// API client class
class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh the token yet
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          this.getRefreshToken()
        ) {
          originalRequest._retry = true;

          try {
            // Get a new token
            const newToken = await this.refreshToken();
            
            // Update the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // Retry the original request
            return this.client(originalRequest);
          } catch (refreshError) {
            // If refresh fails, log out
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Get stored token
  private getToken(): string | null {
    return getCookie(TOKEN_COOKIE_NAME) as string | null;
  }

  // Get stored refresh token
  private getRefreshToken(): string | null {
    return getCookie(REFRESH_TOKEN_COOKIE_NAME) as string | null;
  }

  // Store tokens
  private storeTokens(accessToken: string, refreshToken: string): void {
    setCookie(TOKEN_COOKIE_NAME, accessToken, { maxAge: 60 * 60 * 24 }); // 1 day
    setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, { maxAge: 60 * 60 * 24 * 7 }); // 7 days
  }

  // Clear tokens
  private clearTokens(): void {
    deleteCookie(TOKEN_COOKIE_NAME);
    deleteCookie(REFRESH_TOKEN_COOKIE_NAME);
  }

  // Refresh token
  private async refreshToken(): Promise<string> {
    // If there's already a refresh in progress, return that promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start a new refresh
    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const refreshToken = this.getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post<LoginResponse>(
          `${API_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        this.storeTokens(accessToken, newRefreshToken);
        
        resolve(accessToken);
      } catch (error) {
        this.clearTokens();
        reject(error);
      } finally {
        this.refreshPromise = null;
      }
    });

    return this.refreshPromise;
  }

  // Login
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    const { accessToken, refreshToken } = response.data;
    this.storeTokens(accessToken, refreshToken);

    return response.data;
  }

  // Logout
  logout(): void {
    this.clearTokens();
    // Optionally, call a logout endpoint on the server
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  // POST request
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  // PUT request
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  // PATCH request
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  // DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Export default for convenience
export default apiClient; 