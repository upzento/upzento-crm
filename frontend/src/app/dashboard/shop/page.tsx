'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Package, 
  Tag, 
  Truck, 
  BarChart3, 
  Settings, 
  Plus, 
  ExternalLink 
} from 'lucide-react';

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for the dashboard
  const stats = [
    { title: 'Total Products', value: '124', icon: <Package className="h-5 w-5 text-muted-foreground" /> },
    { title: 'Total Orders', value: '38', icon: <ShoppingBag className="h-5 w-5 text-muted-foreground" /> },
    { title: 'Active Coupons', value: '7', icon: <Tag className="h-5 w-5 text-muted-foreground" /> },
    { title: 'Revenue (30d)', value: '$4,285', icon: <BarChart3 className="h-5 w-5 text-muted-foreground" /> },
  ];

  // Sample recent orders
  const recentOrders = [
    { id: 'ORD-1234', customer: 'John Doe', date: '2023-06-15', total: '$129.99', status: 'Completed' },
    { id: 'ORD-1233', customer: 'Jane Smith', date: '2023-06-14', total: '$89.50', status: 'Processing' },
    { id: 'ORD-1232', customer: 'Bob Johnson', date: '2023-06-13', total: '$249.99', status: 'Shipped' },
    { id: 'ORD-1231', customer: 'Alice Brown', date: '2023-06-12', total: '$45.00', status: 'Completed' },
    { id: 'ORD-1230', customer: 'Charlie Wilson', date: '2023-06-11', total: '$199.99', status: 'Pending' },
  ];

  // Sample top products
  const topProducts = [
    { name: 'Premium Widget Pro', sales: 42, revenue: '$4,199.58' },
    { name: 'Basic Widget', sales: 38, revenue: '$1,899.00' },
    { name: 'Widget Accessory Pack', sales: 27, revenue: '$809.73' },
    { name: 'Widget Stand', sales: 22, revenue: '$659.78' },
    { name: 'Widget Case', sales: 19, revenue: '$379.81' },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop Management</h1>
          <p className="text-muted-foreground">
            Manage your products, orders, and e-commerce settings
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/dashboard/shop/products/create">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/shop/widgets">
              <ExternalLink className="mr-2 h-4 w-4" /> Manage Widgets
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Your 5 most recent orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 text-sm text-muted-foreground">
                    <div>Order ID</div>
                    <div>Customer</div>
                    <div>Date</div>
                    <div>Total</div>
                    <div>Status</div>
                  </div>
                  {recentOrders.map((order, i) => (
                    <div key={i} className="grid grid-cols-5 text-sm">
                      <div className="font-medium">{order.id}</div>
                      <div>{order.customer}</div>
                      <div>{order.date}</div>
                      <div>{order.total}</div>
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/shop/orders">View all orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>
                  Your 5 best-selling products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 text-sm text-muted-foreground">
                    <div>Product</div>
                    <div>Sales</div>
                    <div>Revenue</div>
                  </div>
                  {topProducts.map((product, i) => (
                    <div key={i} className="grid grid-cols-3 text-sm">
                      <div className="font-medium">{product.name}</div>
                      <div>{product.sales}</div>
                      <div>{product.revenue}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/shop/products">View all products</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/shop/products/create">
                    <Plus className="mr-2 h-4 w-4" /> Add New Product
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/shop/orders">
                    <Truck className="mr-2 h-4 w-4" /> Process Orders
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/shop/widgets">
                    <ExternalLink className="mr-2 h-4 w-4" /> Manage Shop Widgets
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/shop/settings">
                    <Settings className="mr-2 h-4 w-4" /> Shop Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your product catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  View and manage your products
                </p>
                <Button asChild>
                  <Link href="/dashboard/shop/products">
                    Go to Products
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                Manage customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  View and process customer orders
                </p>
                <Button asChild>
                  <Link href="/dashboard/shop/orders">
                    Go to Orders
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupons">
          <Card>
            <CardHeader>
              <CardTitle>Coupons</CardTitle>
              <CardDescription>
                Manage discount coupons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  Create and manage discount coupons
                </p>
                <Button asChild>
                  <Link href="/dashboard/shop/coupons">
                    Go to Coupons
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 