'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiClient, { User, TenantContext } from './api/client';

interface AuthContextType {
  user: User | null;
  tenantContext: TenantContext | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ user: User; tenantContext: TenantContext } | undefined>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenantContext, setTenantContext] = useState<TenantContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        if (apiClient.isAuthenticated()) {
          // Get user profile
          const profile = await apiClient.get<{
            userId: string;
            email: string;
            role: string;
            tenantContext: TenantContext;
          }>('/auth/profile');
          
          // Get full user details
          const userData = await apiClient.get<User>(`/users/${profile.userId}`);
          
          setUser(userData);
          setTenantContext(profile.tenantContext);
        }
      } catch (error) {
        console.error('Authentication check failed', error);
        // Clear any invalid tokens
        apiClient.logout();
        setUser(null);
        setTenantContext(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await apiClient.login(email, password);
      setUser(response.user);
      setTenantContext(response.tenantContext);
      return { user: response.user, tenantContext: response.tenantContext };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    setTenantContext(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenantContext,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 