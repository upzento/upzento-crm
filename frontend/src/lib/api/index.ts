import apiClient, { 
  authApi, 
  usersApi, 
  tenantsApi, 
  agenciesApi, 
  clientsApi
} from './api-client';
import analyticsApi from './modules/analytics-api';
import paymentApi from './modules/payment-api';
import settingsApi from './modules/settings-api';

// Export all API modules
export {
  apiClient,
  authApi,
  usersApi,
  tenantsApi,
  agenciesApi,
  clientsApi,
  analyticsApi,
  paymentApi,
  settingsApi
};

// Export default object with all APIs for convenience
export default {
  auth: authApi,
  users: usersApi,
  tenants: tenantsApi,
  agencies: agenciesApi,
  clients: clientsApi,
  analytics: analyticsApi,
  payment: paymentApi,
  settings: settingsApi,
}; 