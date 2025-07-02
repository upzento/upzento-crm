'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MoreHorizontal,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Building2,
  Users,
  CreditCard,
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// Mock data for subscriptions
const subscriptions = [
  {
    id: '1',
    tenant: 'Digital Marketing Pros',
    tenantType: 'agency',
    plan: 'Enterprise Agency',
    status: 'active',
    startDate: '2023-01-15',
    endDate: '2024-01-15',
    billingCycle: 'Monthly',
    amount: '$299.00',
    autoRenew: true
  },
  {
    id: '2',
    tenant: 'Acme Corporation',
    tenantType: 'client',
    plan: 'Premium Client',
    status: 'active',
    startDate: '2023-03-10',
    endDate: '2024-03-10',
    billingCycle: 'Annual',
    amount: '$2,388.00',
    autoRenew: true
  },
  {
    id: '3',
    tenant: 'WebGrowth Agency',
    tenantType: 'agency',
    plan: 'Professional Agency',
    status: 'active',
    startDate: '2023-02-22',
    endDate: '2024-02-22',
    billingCycle: 'Monthly',
    amount: '$199.00',
    autoRenew: true
  },
  {
    id: '4',
    tenant: 'Globex Industries',
    tenantType: 'client',
    plan: 'Standard Client',
    status: 'inactive',
    startDate: '2023-04-05',
    endDate: '2023-10-05',
    billingCycle: 'Quarterly',
    amount: '$447.00',
    autoRenew: false
  },
  {
    id: '5',
    tenant: 'LeadGen Solutions',
    tenantType: 'agency',
    plan: 'Enterprise Agency',
    status: 'active',
    startDate: '2023-01-30',
    endDate: '2024-01-30',
    billingCycle: 'Annual',
    amount: '$3,588.00',
    autoRenew: true
  }
];

// Mock data for plans
const plans = [
  {
    id: '1',
    name: 'Starter Agency',
    type: 'agency',
    price: '$99.00',
    billingCycles: ['Monthly', 'Annual'],
    features: ['Up to 5 clients', 'Basic modules', 'Email support'],
    active: true
  },
  {
    id: '2',
    name: 'Professional Agency',
    type: 'agency',
    price: '$199.00',
    billingCycles: ['Monthly', 'Annual'],
    features: ['Up to 15 clients', 'All modules', 'Priority support'],
    active: true
  },
  {
    id: '3',
    name: 'Enterprise Agency',
    type: 'agency',
    price: '$299.00',
    billingCycles: ['Monthly', 'Annual'],
    features: ['Unlimited clients', 'All modules', 'Dedicated support'],
    active: true
  },
  {
    id: '4',
    name: 'Standard Client',
    type: 'client',
    price: '$49.00',
    billingCycles: ['Monthly', 'Quarterly', 'Annual'],
    features: ['Basic modules', 'Limited features', 'Email support'],
    active: true
  },
  {
    id: '5',
    name: 'Premium Client',
    type: 'client',
    price: '$99.00',
    billingCycles: ['Monthly', 'Quarterly', 'Annual'],
    features: ['All modules', 'Full features', 'Priority support'],
    active: true
  }
];

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Filter subscriptions based on search query and type filter
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.plan.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || sub.tenantType === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  // Filter plans based on search query and type filter
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = 
      plan.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || plan.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
      </div>
      
      <Tabs defaultValue="subscriptions" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>
                Manage all subscriptions across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search subscriptions..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="border rounded-md px-3 py-2"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="agency">Agencies</option>
                    <option value="client">Clients</option>
                  </select>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Subscription
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Billing</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Renewal</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.tenant}</TableCell>
                        <TableCell>
                          {sub.tenantType === 'agency' ? (
                            <div className="flex items-center">
                              <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                              Agency
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                              Client
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{sub.plan}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            sub.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {sub.status}
                          </span>
                        </TableCell>
                        <TableCell>{sub.billingCycle}</TableCell>
                        <TableCell>{sub.amount}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {sub.autoRenew ? (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                Auto
                              </>
                            ) : (
                              <>
                                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                Manual
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit Subscription
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" /> Manage Billing
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" /> Change Renewal
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Cancel Subscription
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>
                Manage available subscription plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search plans..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="border rounded-md px-3 py-2"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="agency">Agency Plans</option>
                    <option value="client">Client Plans</option>
                  </select>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Plan
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Billing Cycles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>
                          {plan.type === 'agency' ? (
                            <div className="flex items-center">
                              <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                              Agency
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                              Client
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{plan.price}</TableCell>
                        <TableCell>{plan.billingCycles.join(', ')}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            plan.active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {plan.active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit Plan
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {plan.active ? (
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" /> Deactivate Plan
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle2 className="mr-2 h-4 w-4" /> Activate Plan
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 