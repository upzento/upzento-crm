"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  PlusCircle,
  Code,
  Copy,
  ExternalLink,
  Settings,
  Store,
  Trash2,
  Grid2x2,
  LayoutGrid,
  LayoutList,
  Palette,
} from "lucide-react";
import Link from "next/link";

// Sample widget data
const sampleWidgets = [
  {
    id: 1,
    name: "Featured Products",
    type: "featured",
    products: 4,
    layout: "grid",
    domains: ["example.com", "www.example.com"],
    active: true,
  },
  {
    id: 2,
    name: "Product Carousel",
    type: "carousel",
    products: 8,
    layout: "carousel",
    domains: ["example.com"],
    active: true,
  },
  {
    id: 3,
    name: "Category Showcase",
    type: "category",
    category: "Digital Products",
    products: 6,
    layout: "grid",
    domains: [],
    active: false,
  },
];

// Sample products data
const sampleProducts = [
  { id: 1, name: "Premium Website Audit", price: 99.99, category: "Digital Services" },
  { id: 2, name: "SEO Strategy Guide", price: 49.99, category: "Digital Products" },
  { id: 3, name: "Marketing Consultation", price: 149.99, category: "Services" },
  { id: 4, name: "Logo Design Package", price: 299.99, category: "Design Services" },
  { id: 5, name: "Social Media Content Calendar", price: 29.99, category: "Digital Products" },
];

// Sample categories data
const sampleCategories = [
  { id: 1, name: "Digital Products", count: 2 },
  { id: 2, name: "Digital Services", count: 1 },
  { id: 3, name: "Services", count: 1 },
  { id: 4, name: "Design Services", count: 1 },
];

export default function ShopWidgetsPage() {
  const [activeTab, setActiveTab] = useState("widgets");
  const [selectedWidget, setSelectedWidget] = useState<number | null>(null);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleAddDomain = (widgetId: number) => {
    // Implementation would add the domain to the widget's allowed domains
    setIsAddDomainOpen(false);
  };

  const handleRemoveDomain = (widgetId: number, domain: string) => {
    // Implementation would remove the domain from the widget's allowed domains
  };

  const getEmbedCode = (widget: any) => {
    return `<script src="https://upzento.com/widgets/shop/${widget.id}.js"></script>\n<div id="upzento-shop-widget-${widget.id}"></div>`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/client/shop">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Shop Widgets</h1>
        </div>
        <Button onClick={() => setIsAddWidgetOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Widget
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="widgets">My Widgets</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="widgets" className="space-y-6">
          {sampleWidgets.map((widget) => (
            <Card key={widget.id} className={!widget.active ? "opacity-70" : ""}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {widget.name}
                      {!widget.active && (
                        <Badge variant="outline" className="ml-2">
                          Draft
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {widget.type === "featured"
                        ? "Featured Products"
                        : widget.type === "carousel"
                        ? "Product Carousel"
                        : `${widget.category} Category`}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWidget(widget.id)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Link href={`/client/shop/widgets/${widget.id}/preview`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Widget Type</h3>
                    <div className="flex items-center">
                      {widget.type === "featured" ? (
                        <Grid2x2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      ) : widget.type === "carousel" ? (
                        <LayoutGrid className="h-4 w-4 mr-2 text-muted-foreground" />
                      ) : (
                        <LayoutList className="h-4 w-4 mr-2 text-muted-foreground" />
                      )}
                      <span className="text-sm capitalize">
                        {widget.type} ({widget.layout})
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Products</h3>
                    <span className="text-sm">
                      {widget.products} products displayed
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Status</h3>
                    <Badge variant={widget.active ? "default" : "outline"}>
                      {widget.active ? "Active" : "Draft"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start border-t pt-4">
                <div className="w-full mb-3">
                  <h3 className="text-sm font-medium mb-2">Embed Code</h3>
                  <div className="relative">
                    <Textarea
                      readOnly
                      value={getEmbedCode(widget)}
                      rows={2}
                      className="font-mono text-xs pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopyCode(getEmbedCode(widget))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Allowed Domains</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedWidget(widget.id);
                        setIsAddDomainOpen(true);
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Domain
                    </Button>
                  </div>
                  {widget.domains.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {widget.domains.map((domain, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-muted px-3 py-1 rounded-md text-sm"
                        >
                          <span className="mr-2">{domain}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => handleRemoveDomain(widget.id, domain)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No domain restrictions (widget can be embedded anywhere)
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}

          {sampleWidgets.length === 0 && (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Store className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Widgets Yet</h3>
                <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
                  Create shop widgets to showcase your products on your website or
                  other platforms.
                </p>
                <Button onClick={() => setIsAddWidgetOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Widget
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Widget Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your shop widgets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme Colors</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="primaryColor"
                          value="#3b82f6"
                          className="w-10 h-10 rounded-md"
                        />
                        <Input value="#3b82f6" className="font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="accentColor"
                          value="#8b5cf6"
                          className="w-10 h-10 rounded-md"
                        />
                        <Input value="#8b5cf6" className="font-mono" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="textColor"
                          value="#1f2937"
                          className="w-10 h-10 rounded-md"
                        />
                        <Input value="#1f2937" className="font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="backgroundColor"
                          value="#ffffff"
                          className="w-10 h-10 rounded-md"
                        />
                        <Input value="#ffffff" className="font-mono" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Typography</h3>
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select defaultValue="inter">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="opensans">Open Sans</SelectItem>
                        <SelectItem value="lato">Lato</SelectItem>
                        <SelectItem value="montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleSize">Title Size</Label>
                      <Select defaultValue="md">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="md">Medium</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priceSize">Price Size</Label>
                      <Select defaultValue="md">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="md">Medium</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Layout Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="borderRadius">Border Radius</Label>
                    <Select defaultValue="md">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spacing">Element Spacing</Label>
                    <Select defaultValue="md">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sm">Compact</SelectItem>
                        <SelectItem value="md">Standard</SelectItem>
                        <SelectItem value="lg">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shadow">Shadow Style</Label>
                    <Select defaultValue="md">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="sm">Subtle</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Pronounced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <div className="border rounded-md p-4 bg-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-2">
                      <div className="aspect-square bg-muted rounded-md mb-2"></div>
                      <div className="font-medium">Product Name</div>
                      <div className="text-sm font-bold text-primary">$99.99</div>
                    </div>
                    <div className="border rounded-md p-2">
                      <div className="aspect-square bg-muted rounded-md mb-2"></div>
                      <div className="font-medium">Product Name</div>
                      <div className="text-sm font-bold text-primary">$49.99</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Appearance Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Widget Settings</CardTitle>
              <CardDescription>
                Configure global settings for all shop widgets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showPrices">Show Prices</Label>
                  <p className="text-sm text-muted-foreground">
                    Display product prices in widgets
                  </p>
                </div>
                <Switch id="showPrices" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showAddToCart">Show Add to Cart Button</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to add products to cart directly from widgets
                  </p>
                </div>
                <Switch id="showAddToCart" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="openInNewTab">Open Products in New Tab</Label>
                  <p className="text-sm text-muted-foreground">
                    Open product links in a new browser tab
                  </p>
                </div>
                <Switch id="openInNewTab" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showOutOfStock">Show Out of Stock Products</Label>
                  <p className="text-sm text-muted-foreground">
                    Display products that are out of stock in widgets
                  </p>
                </div>
                <Switch id="showOutOfStock" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currencyFormat">Currency Format</Label>
                <Select defaultValue="usd">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (â¬)</SelectItem>
                    <SelectItem value="gbp">GBP (Â£)</SelectItem>
                    <SelectItem value="cad">CAD ($)</SelectItem>
                    <SelectItem value="aud">AUD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultSorting">Default Product Sorting</Label>
                <Select defaultValue="featured">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="bestselling">Best Selling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure technical settings for shop widgets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cacheTime">Cache Duration (minutes)</Label>
                <Input
                  id="cacheTime"
                  type="number"
                  defaultValue="60"
                />
                <p className="text-xs text-muted-foreground">
                  How long widget content is cached before refreshing
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="lazyLoad">Lazy Load Images</Label>
                  <p className="text-sm text-muted-foreground">
                    Load images only when they scroll into view
                  </p>
                </div>
                <Switch id="lazyLoad" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackAnalytics">Track Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Collect usage data from embedded widgets
                  </p>
                </div>
                <Switch id="trackAnalytics" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="responsiveDesign">Responsive Design</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically adjust layout for different screen sizes
                  </p>
                </div>
                <Switch id="responsiveDesign" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Advanced Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Widget Dialog */}
      <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Shop Widget</DialogTitle>
            <DialogDescription>
              Create a new widget to showcase your products on your website.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="widgetName">Widget Name</Label>
              <Input id="widgetName" placeholder="Enter widget name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="widgetType">Widget Type</Label>
              <Select defaultValue="featured">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured Products</SelectItem>
                  <SelectItem value="carousel">Product Carousel</SelectItem>
                  <SelectItem value="category">Category Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="widgetCategory">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {sampleCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Only required for Category type widgets
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productCount">Number of Products</Label>
                <Input id="productCount" type="number" defaultValue="4" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="widgetLayout">Layout</Label>
                <Select defaultValue="grid">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="widgetActive" defaultChecked />
              <Label htmlFor="widgetActive">Make widget active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddWidgetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddWidgetOpen(false)}>Create Widget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Domain Dialog */}
      <Dialog open={isAddDomainOpen} onOpenChange={setIsAddDomainOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Allowed Domain</DialogTitle>
            <DialogDescription>
              Add a domain where this widget can be embedded.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="domain">Domain Name</Label>
            <Input
              id="domain"
              placeholder="example.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Enter the domain without http:// or https:// (e.g., example.com)
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDomainOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedWidget) handleAddDomain(selectedWidget);
              }}
            >
              Add Domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 