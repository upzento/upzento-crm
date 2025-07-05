'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  DollarSign, 
  Download, 
  FileText, 
  Inbox, 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { usePayment } from '@/lib/hooks';

export default function ClientPaymentPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Use our payment data fetching hook
  const {
    summary,
    transactions,
    paymentMethods,
    loading,
    error,
    fetchTransactions,
    fetchPaymentMethods,
    createPaymentMethod,
    setDefaultPaymentMethod,
    deletePaymentMethod,
  } = usePayment();

  // Show loading state for initial load
  if (loading && !summary && !transactions && !paymentMethods) {
    return (
      <div className="container mx-auto py-6 space-y-6 flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium">Loading payment data...</h2>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !summary && !transactions && !paymentMethods) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <h2 className="text-xl font-medium text-red-800 dark:text-red-300">Error loading payment data</h2>
          <p className="mt-2 text-red-700 dark:text-red-400">{error.message}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Payment</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-3 lg:w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">Total Balance</span>
                  <span className="bg-primary/10 p-2 rounded-full text-primary">
                    <DollarSign className="h-5 w-5" />
                  </span>
                </div>
                <div className="text-3xl font-bold mb-2">
                  ${summary?.totalBalance?.toFixed(2) || '0.00'}
                </div>
                <div className="flex items-center text-sm text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>
                    {summary?.monthlyChange > 0 
                      ? `Up $${summary?.monthlyChange?.toFixed(2) || '0.00'} from last month`
                      : `No change from last month`}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">Outstanding Invoices</span>
                  <span className="bg-primary/10 p-2 rounded-full text-primary">
                    <FileText className="h-5 w-5" />
                  </span>
                </div>
                <div className="text-3xl font-bold mb-2">{summary?.outstandingInvoices || 0}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Total: ${summary?.outstandingAmount?.toFixed(2) || '0.00'}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">Monthly Spending</span>
                  <span className="bg-primary/10 p-2 rounded-full text-primary">
                    <CreditCard className="h-5 w-5" />
                  </span>
                </div>
                <div className="text-3xl font-bold mb-2">
                  ${summary?.monthlySpending?.toFixed(2) || '0.00'}
                </div>
                <div className={`flex items-center text-sm ${summary?.monthlyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {summary?.monthlyChange >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>
                    {summary?.monthlyChange !== 0 
                      ? `${summary?.monthlyChange > 0 ? 'Up' : 'Down'} $${Math.abs(summary?.monthlyChange || 0).toFixed(2)} from last month`
                      : 'No change from last month'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your most recent payment activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && !transactions ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Description</th>
                        <th className="text-right p-4 font-medium">Amount</th>
                        <th className="text-right p-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions && transactions.length > 0 ? (
                        transactions.slice(0, 3).map((transaction) => (
                          <tr key={transaction.id} className="border-b">
                            <td className="p-4">{new Date(transaction.date).toLocaleDateString()}</td>
                            <td className="p-4">{transaction.description}</td>
                            <td className={`p-4 text-right ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                              {transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
                            </td>
                            <td className="p-4 text-right">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                {transaction.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">
                            No transactions found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => setActiveTab('transactions')}>
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    View all your payment transactions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-8 w-[250px]"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Description</th>
                      <th className="text-right p-4 font-medium">Amount</th>
                      <th className="text-right p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="p-4">{transaction.date}</td>
                        <td className="p-4">{transaction.description}</td>
                        <td className={`p-4 text-right ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </td>
                        <td className="p-4 text-right">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment-methods" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your saved payment methods
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {method.type === 'Credit Card' ? (
                        <div className="bg-primary/10 p-3 rounded-full">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                      ) : (
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Inbox className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{method.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {method.type === 'Credit Card' 
                            ? `•••• ${method.last4} | Expires ${method.expiry}` 
                            : `•••• ${method.last4}`}
                        </div>
                        {method.isDefault && (
                          <div className="text-xs mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            Default
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm">
                          Set as Default
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 