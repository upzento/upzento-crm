import { useState, useEffect, useCallback } from 'react';
import { paymentApi } from '../api';
import type {
  Transaction,
  PaymentMethod,
  Invoice,
  PaymentSummary,
  SubscriptionPlan,
  Subscription
} from '../api/modules/payment-api';

interface UsePaymentOptions {
  autoFetchSummary?: boolean;
  autoFetchTransactions?: boolean;
  autoFetchPaymentMethods?: boolean;
}

export function usePayment(options: UsePaymentOptions = {}) {
  const {
    autoFetchSummary = true,
    autoFetchTransactions = true,
    autoFetchPaymentMethods = true
  } = options;
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // State for different data types
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[] | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  
  // Function to fetch payment summary
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentApi.getPaymentSummary();
      setSummary(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch payment summary'));
      console.error('Error fetching payment summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to fetch transactions
  const fetchTransactions = useCallback(async (params?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentApi.getTransactions(params);
      setTransactions(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to fetch payment methods
  const fetchPaymentMethods = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentApi.getPaymentMethods();
      setPaymentMethods(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch payment methods'));
      console.error('Error fetching payment methods:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to fetch invoices
  const fetchInvoices = useCallback(async (params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentApi.getInvoices(params);
      setInvoices(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch invoices'));
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to fetch subscription plans
  const fetchSubscriptionPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentApi.getSubscriptionPlans();
      setSubscriptionPlans(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch subscription plans'));
      console.error('Error fetching subscription plans:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to fetch subscriptions
  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentApi.getSubscriptions();
      setSubscriptions(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch subscriptions'));
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to create a payment method
  const createPaymentMethod = useCallback(async (data: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentApi.createPaymentMethod(data);
      // Refresh payment methods list
      fetchPaymentMethods();
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create payment method'));
      console.error('Error creating payment method:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPaymentMethods]);
  
  // Function to set default payment method
  const setDefaultPaymentMethod = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await paymentApi.setDefaultPaymentMethod(id);
      // Refresh payment methods list
      fetchPaymentMethods();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set default payment method'));
      console.error('Error setting default payment method:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPaymentMethods]);
  
  // Function to delete payment method
  const deletePaymentMethod = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await paymentApi.deletePaymentMethod(id);
      // Refresh payment methods list
      fetchPaymentMethods();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete payment method'));
      console.error('Error deleting payment method:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPaymentMethods]);
  
  // Auto-fetch data on initial load
  useEffect(() => {
    if (autoFetchSummary) {
      fetchSummary();
    }
    
    if (autoFetchTransactions) {
      fetchTransactions();
    }
    
    if (autoFetchPaymentMethods) {
      fetchPaymentMethods();
    }
  }, [autoFetchSummary, autoFetchTransactions, autoFetchPaymentMethods, fetchSummary, fetchTransactions, fetchPaymentMethods]);
  
  return {
    // Data
    summary,
    transactions,
    paymentMethods,
    invoices,
    subscriptionPlans,
    subscriptions,
    
    // State
    loading,
    error,
    
    // Fetch actions
    fetchSummary,
    fetchTransactions,
    fetchPaymentMethods,
    fetchInvoices,
    fetchSubscriptionPlans,
    fetchSubscriptions,
    
    // Mutation actions
    createPaymentMethod,
    setDefaultPaymentMethod,
    deletePaymentMethod,
  };
} 