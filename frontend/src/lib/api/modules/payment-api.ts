import apiClient from '../api-client';

// Define TypeScript interfaces for payment data
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded' | 'Paid';
  metadata?: Record<string, any>;
}

export interface PaymentMethod {
  id: string;
  type: 'Credit Card' | 'Bank Account' | 'PayPal' | 'Other';
  last4: string;
  expiry?: string;
  routingNumber?: string;
  isDefault: boolean;
  brand?: string;
  name?: string;
  billingAddress?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  subtotal: number;
  tax: number;
  total: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate?: number;
  taxAmount?: number;
}

export interface PaymentSummary {
  totalBalance: number;
  outstandingInvoices: number;
  outstandingAmount: number;
  monthlySpending: number;
  monthlyChange: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isActive: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status: 'Active' | 'Canceled' | 'Past Due' | 'Pending';
  startDate: string;
  endDate?: string;
  renewalDate: string;
  amount: number;
  interval: 'month' | 'year';
  paymentMethodId: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

// Payment API client
export const paymentApi = {
  // Transactions
  getTransactions: (params?: { limit?: number; offset?: number; startDate?: string; endDate?: string; status?: string }) => 
    apiClient.get<Transaction[]>('/payment/transactions', { params }),
  
  getTransaction: (id: string) => 
    apiClient.get<Transaction>(`/payment/transactions/${id}`),
  
  // Payment Methods
  getPaymentMethods: () => 
    apiClient.get<PaymentMethod[]>('/payment/methods'),
  
  getPaymentMethod: (id: string) => 
    apiClient.get<PaymentMethod>(`/payment/methods/${id}`),
  
  createPaymentMethod: (data: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<PaymentMethod>('/payment/methods', data),
  
  updatePaymentMethod: (id: string, data: Partial<PaymentMethod>) => 
    apiClient.patch<PaymentMethod>(`/payment/methods/${id}`, data),
  
  deletePaymentMethod: (id: string) => 
    apiClient.delete(`/payment/methods/${id}`),
  
  setDefaultPaymentMethod: (id: string) => 
    apiClient.post(`/payment/methods/${id}/default`),
  
  // Invoices
  getInvoices: (params?: { limit?: number; offset?: number; status?: string }) => 
    apiClient.get<Invoice[]>('/payment/invoices', { params }),
  
  getInvoice: (id: string) => 
    apiClient.get<Invoice>(`/payment/invoices/${id}`),
  
  createInvoice: (data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<Invoice>('/payment/invoices', data),
  
  updateInvoice: (id: string, data: Partial<Invoice>) => 
    apiClient.patch<Invoice>(`/payment/invoices/${id}`, data),
  
  deleteInvoice: (id: string) => 
    apiClient.delete(`/payment/invoices/${id}`),
  
  sendInvoice: (id: string, email: string) => 
    apiClient.post(`/payment/invoices/${id}/send`, { email }),
  
  markInvoiceAsPaid: (id: string) => 
    apiClient.post(`/payment/invoices/${id}/mark-paid`),
  
  // Summary
  getPaymentSummary: () => 
    apiClient.get<PaymentSummary>('/payment/summary'),
  
  // Subscriptions
  getSubscriptionPlans: () => 
    apiClient.get<SubscriptionPlan[]>('/payment/subscription-plans'),
  
  getSubscriptions: () => 
    apiClient.get<Subscription[]>('/payment/subscriptions'),
  
  getSubscription: (id: string) => 
    apiClient.get<Subscription>(`/payment/subscriptions/${id}`),
  
  createSubscription: (planId: string, paymentMethodId: string) => 
    apiClient.post<Subscription>('/payment/subscriptions', { planId, paymentMethodId }),
  
  cancelSubscription: (id: string, cancelAtPeriodEnd: boolean = true) => 
    apiClient.post(`/payment/subscriptions/${id}/cancel`, { cancelAtPeriodEnd }),
  
  updateSubscription: (id: string, data: { planId?: string; paymentMethodId?: string }) => 
    apiClient.patch<Subscription>(`/payment/subscriptions/${id}`, data),
};

export default paymentApi; 