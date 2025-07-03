'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SubscriptionsTab from './components/subscriptions-tab';
import InvoicesTab from './components/invoices-tab';
import PaymentMethodsTab from './components/payment-methods-tab';
import PaymentSummaryTab from './components/payment-summary-tab';

export default function PaymentPage() {
  const [activeTab, setActiveTab] = useState('subscriptions');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
      </div>

      <Tabs defaultValue="subscriptions" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:grid-cols-4 lg:w-full">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="summary">Payment Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
              <CardDescription>
                Manage your subscription plans and billing cycles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                View and manage your invoices and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvoicesTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>
                View your payment history and financial summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentSummaryTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 