'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Grid, 
  Box, 
  Copy, 
  ExternalLink, 
  Plus, 
  Pencil, 
  Trash2,
  CheckCircle,
  ChevronLeft
} from 'lucide-react';

export default function ShopWidgetsPage() {
  const [activeTab, setActiveTab] = useState('widgets');
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sample data for widgets
  const widgets = [
    { 
      id: '1', 
      name: 'Full Shop', 
      description: 'Complete shop with product listings, cart, and checkout',
      type: 'FULL_SHOP',
      domains: ['example.com', '*.client-site.com'],
      createdAt: '2023-05-15'
    },
    { 
      id: '2', 
      name: 'Featured Products Grid', 
      description: 'Grid display of featured products',
      type: 'PRODUCT_GRID',
      domains: ['example.com'],
      createdAt: '2023-05-20'
    },
    { 
      id: '3', 
      name: 'Premium Widget Showcase', 
      description: 'Single product display for the Premium Widget',
      type: 'SINGLE_PRODUCT',
      domains: ['example.com', 'landing.example.com'],
      createdAt: '2023-06-01'
    },
  ];

  const getWidgetTypeIcon = (type) => {
    switch (type) {
      case 'FULL_SHOP':
        return <ShoppingBag className="h-4 w-4" />;
      case 'PRODUCT_GRID':
        return <Grid className="h-4 w-4" />;
      case 'SINGLE_PRODUCT':
        return <Box className="h-4 w-4" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  const getWidgetTypeLabel = (type) => {
    switch (type) {
      case 'FULL_SHOP':
        return 'Full Shop';
      case 'PRODUCT_GRID':
        return 'Product Grid';
      case 'SINGLE_PRODUCT':
        return 'Single Product';
      default:
        return type;
    }
  };

  const getEmbedCode = (widget) => {
    return `<!-- Upzento Shop Widget: ${widget.name} -->
<div id="upzento-shop-widget-${widget.id}"></div>
<script src="https://api.upzento.com/shop-embed/widget/${widget.id}/script.js" defer></script>
<!-- End Upzento Shop Widget -->`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/dashboard/shop">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Shop
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop Widgets</h1>
          <p className="text-muted-foreground">
            Create and manage embeddable shop widgets for your website
          </p>
        </div>
      </div>

      <Tabs defaultValue="widgets" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="widgets">Your Widgets</TabsTrigger>
            <TabsTrigger value="create">Create Widget</TabsTrigger>
          </TabsList>
          
          {activeTab === 'widgets' && (
            <Button asChild>
              <Link href="#" onClick={() => setActiveTab('create')}>
                <Plus className="mr-2 h-4 w-4" /> New Widget
              </Link>
            </Button>
          )}
        </div>
        
        <TabsContent value="widgets" className="space-y-4">
          {widgets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No widgets yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first shop widget to embed on your website
                </p>
                <Button asChild>
                  <Link href="#" onClick={() => setActiveTab('create')}>
                    <Plus className="mr-2 h-4 w-4" /> Create Widget
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {widgets.map((widget) => (
                <Card key={widget.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{widget.name}</CardTitle>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getWidgetTypeIcon(widget.type)}
                        {getWidgetTypeLabel(widget.type)}
                      </Badge>
                    </div>
                    <CardDescription>{widget.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm">
                      <div className="font-medium text-muted-foreground mb-1">Allowed Domains</div>
                      <div className="flex flex-wrap gap-1">
                        {widget.domains.map((domain, i) => (
                          <Badge key={i} variant="secondary">{domain}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(widget.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setSelectedWidget(widget);
                        setShowEmbedCode(true);
                      }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {showEmbedCode && selectedWidget && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Embed Code: {selectedWidget.name}</CardTitle>
                <CardDescription>
                  Copy this code and paste it into your website where you want the widget to appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    readOnly
                    className="font-mono text-sm h-32"
                    value={getEmbedCode(selectedWidget)}
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(getEmbedCode(selectedWidget))}
                  >
                    {copiedCode ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowEmbedCode(false)}>
                  Close
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`https://api.upzento.com/shop-embed/widget/${selectedWidget.id}/preview`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-1" /> Preview Widget
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Shop Widget</CardTitle>
              <CardDescription>
                Configure your shop widget for embedding on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Widget Name</Label>
                  <Input id="name" placeholder="e.g., My Shop Widget" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your widget" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="type">Widget Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="FULL_SHOP">Full Shop</option>
                    <option value="PRODUCT_GRID">Product Grid</option>
                    <option value="SINGLE_PRODUCT">Single Product</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="domains">Allowed Domains</Label>
                  <Textarea 
                    id="domains" 
                    placeholder="Enter one domain per line, e.g.:&#10;example.com&#10;*.client-site.com" 
                  />
                  <p className="text-sm text-muted-foreground">
                    Use * as a wildcard for subdomains, e.g., *.example.com
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label>Widget Theme</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryColor" className="text-xs">Primary Color</Label>
                      <div className="flex gap-2 items-center">
                        <Input type="color" id="primaryColor" className="w-10 h-10 p-1" defaultValue="#6366f1" />
                        <Input type="text" defaultValue="#6366f1" className="flex-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="backgroundColor" className="text-xs">Background Color</Label>
                      <div className="flex gap-2 items-center">
                        <Input type="color" id="backgroundColor" className="w-10 h-10 p-1" defaultValue="#ffffff" />
                        <Input type="text" defaultValue="#ffffff" className="flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('widgets')}>Cancel</Button>
              <Button>Create Widget</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 