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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  CreditCard, 
  Truck, 
  Package, 
  Tag, 
  Globe, 
  Save, 
  RefreshCw,
  Plus 
} from 'lucide-react';

export default function ShopSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Shop Settings</h1>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-4xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your shop's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input id="shopName" defaultValue="Cosmic Gadgets" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopUrl">Shop URL</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">https://</span>
                    <Input id="shopUrl" defaultValue="cosmicgadgets.upzento.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input id="supportEmail" type="email" defaultValue="support@cosmicgadgets.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input id="supportPhone" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shopDescription">Shop Description</Label>
                <textarea 
                  id="shopDescription" 
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                  defaultValue="Cosmic Gadgets offers the latest tech gadgets with a futuristic, space-inspired design."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC">UTC</option>
                    <option value="UTC+1">Central European Time (UTC+1)</option>
                    <option value="UTC+8">China Standard Time (UTC+8)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shopActive">Shop Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable your shop
                  </p>
                </div>
                <Switch id="shopActive" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Configure search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" defaultValue="Cosmic Gadgets - Futuristic Tech Devices" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <textarea 
                  id="metaDescription" 
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                  defaultValue="Discover futuristic tech gadgets with space-inspired design at Cosmic Gadgets. Free shipping on orders over $50."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure payment options for your shop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">Credit Card Payments</h3>
                      <p className="text-sm text-muted-foreground">Accept Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-4">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                      <path d="M7 15H17V17H7v-2zm0-4h10v2H7v-2zm0-4h10v2H7V7zm12-4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="currentColor" />
                    </svg>
                    <div>
                      <h3 className="font-medium">PayPal</h3>
                      <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-4">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                      <path d="M12 0L4.8 4.8v14.4L12 24l7.2-4.8V4.8L12 0zm0 2.88l5.76 3.84v9.6L12 20.16l-5.76-3.84v-9.6L12 2.88z" fill="currentColor" />
                    </svg>
                    <div>
                      <h3 className="font-medium">Cryptocurrency</h3>
                      <p className="text-sm text-muted-foreground">Accept Bitcoin, Ethereum, etc.</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Options</CardTitle>
              <CardDescription>
                Configure shipping methods and rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-4">
                    <Truck className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">Standard Shipping</h3>
                      <p className="text-sm text-muted-foreground">3-5 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>$5.99</span>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">Express Shipping</h3>
                      <p className="text-sm text-muted-foreground">1-2 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>$12.99</span>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-4">
                    <Globe className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">International Shipping</h3>
                      <p className="text-sm text-muted-foreground">7-14 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>$19.99</span>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md bg-muted/50">
                <div>
                  <h3 className="font-medium">Free Shipping Threshold</h3>
                  <p className="text-sm text-muted-foreground">Offer free shipping on orders above</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input className="w-24" defaultValue="50" />
                  <span>USD</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="taxes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>
                Configure tax rates and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableTaxes">Enable Tax Calculation</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically calculate taxes on orders
                  </p>
                </div>
                <Switch id="enableTaxes" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label>Tax Provider</Label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option value="automatic">Automatic Tax (Recommended)</option>
                  <option value="manual">Manual Tax Rates</option>
                  <option value="external">External Tax Provider</option>
                </select>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tax Regions</h3>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left">Region</th>
                        <th className="py-3 px-4 text-left">Tax Rate</th>
                        <th className="py-3 px-4 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">United States - California</td>
                        <td className="py-3 px-4">7.25%</td>
                        <td className="py-3 px-4">
                          <Switch defaultChecked />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">United States - New York</td>
                        <td className="py-3 px-4">8.875%</td>
                        <td className="py-3 px-4">
                          <Switch defaultChecked />
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Canada</td>
                        <td className="py-3 px-4">5% (GST)</td>
                        <td className="py-3 px-4">
                          <Switch defaultChecked />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tax Region
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email notifications for your shop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New Order Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive an email when a new order is placed
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Order Status Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Send emails to customers when order status changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Abandoned Cart Reminders</h3>
                    <p className="text-sm text-muted-foreground">
                      Send reminder emails for abandoned carts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Low Stock Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when product stock is low
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Emails</h3>
                    <p className="text-sm text-muted-foreground">
                      Send promotional emails to customers
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input id="notificationEmail" type="email" defaultValue="notifications@cosmicgadgets.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
