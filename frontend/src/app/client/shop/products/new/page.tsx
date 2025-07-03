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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Upload, Plus, Trash2, DollarSign, Package } from "lucide-react";
import Link from "next/link";

// Sample categories data
const sampleCategories = [
  { id: 1, name: "Digital Products" },
  { id: 2, name: "Digital Services" },
  { id: 3, name: "Services" },
  { id: 4, name: "Design Services" },
];

export default function NewProductPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [productType, setProductType] = useState("physical");
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productVariants, setProductVariants] = useState<any[]>([]);

  const handleAddImage = () => {
    // In a real implementation, this would open a file picker
    // For now, we'll just add a placeholder image
    setProductImages([...productImages, `/placeholder-${productImages.length + 1}.jpg`]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...productImages];
    newImages.splice(index, 1);
    setProductImages(newImages);
  };

  const handleAddVariant = () => {
    setProductVariants([
      ...productVariants,
      {
        id: Date.now(),
        name: "",
        price: 0,
        sku: "",
        inventory: 0,
      },
    ]);
  };

  const handleRemoveVariant = (id: number) => {
    setProductVariants(productVariants.filter((variant) => variant.id !== id));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/client/shop">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Save as Draft</Button>
          <Button>Publish Product</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Enter the basic information for your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productDescription">Description</Label>
                <Textarea
                  id="productDescription"
                  placeholder="Describe your product..."
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productCategory">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productType">Product Type</Label>
                  <Select
                    value={productType}
                    onValueChange={setProductType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">Physical Product</SelectItem>
                      <SelectItem value="digital">Digital Product</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>
                Add images to showcase your product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square border rounded-md bg-muted flex items-center justify-center"
                  >
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <span className="text-muted-foreground">Image {index + 1}</span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="border border-dashed rounded-md flex flex-col items-center justify-center p-4 hover:bg-muted/50 aspect-square"
                >
                  <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Add Image</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>
                Set pricing and inventory options for your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productPrice">Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="productPrice"
                          type="number"
                          placeholder="0.00"
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compareAtPrice">Compare-at Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="compareAtPrice"
                          type="number"
                          placeholder="0.00"
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productSKU">SKU (Stock Keeping Unit)</Label>
                      <Input
                        id="productSKU"
                        placeholder="SKU-12345"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productBarcode">Barcode (ISBN, UPC, GTIN, etc.)</Label>
                      <Input
                        id="productBarcode"
                        placeholder="Enter barcode"
                      />
                    </div>
                  </div>
                  {productType !== "service" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trackInventory">Track Inventory</Label>
                        <Switch id="trackInventory" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="inventoryQuantity">Quantity</Label>
                          <Input
                            id="inventoryQuantity"
                            type="number"
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                          <Input
                            id="lowStockThreshold"
                            type="number"
                            placeholder="5"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {productType === "service" && (
                    <div className="space-y-2">
                      <Label htmlFor="serviceDuration">Duration (minutes)</Label>
                      <Input
                        id="serviceDuration"
                        type="number"
                        placeholder="60"
                      />
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="variants" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Product Variants</h3>
                    <Button size="sm" onClick={handleAddVariant}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variant
                    </Button>
                  </div>
                  {productVariants.length === 0 ? (
                    <div className="border rounded-md p-8 text-center">
                      <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="text-sm font-medium mb-1">No Variants Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add variants if your product comes in different options like
                        size or color.
                      </p>
                      <Button size="sm" onClick={handleAddVariant}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variant
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {productVariants.map((variant) => (
                        <div
                          key={variant.id}
                          className="border rounded-md p-4 space-y-4"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Variant {productVariants.indexOf(variant) + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveVariant(variant.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`variant-name-${variant.id}`}>Name</Label>
                              <Input
                                id={`variant-name-${variant.id}`}
                                placeholder="e.g., Small, Red, etc."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`variant-price-${variant.id}`}>Price</Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id={`variant-price-${variant.id}`}
                                  type="number"
                                  placeholder="0.00"
                                  className="pl-8"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`variant-sku-${variant.id}`}>SKU</Label>
                              <Input
                                id={`variant-sku-${variant.id}`}
                                placeholder="SKU-VAR-12345"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`variant-inventory-${variant.id}`}>Inventory</Label>
                              <Input
                                id={`variant-inventory-${variant.id}`}
                                type="number"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {productType === "digital" && (
            <Card>
              <CardHeader>
                <CardTitle>Digital Product Files</CardTitle>
                <CardDescription>
                  Upload files that customers will receive after purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-dashed rounded-md flex flex-col items-center justify-center p-8">
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <h3 className="text-sm font-medium mb-1">Upload Files</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Drag and drop files here or click to browse
                  </p>
                  <Button size="sm">Browse Files</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="productStatus">Status</Label>
                <Select defaultValue="draft">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featuredProduct">Featured Product</Label>
                  <p className="text-sm text-muted-foreground">
                    Display prominently in your shop
                  </p>
                </div>
                <Switch id="featuredProduct" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showPrice">Show Price</Label>
                  <p className="text-sm text-muted-foreground">
                    Display product price to customers
                  </p>
                </div>
                <Switch id="showPrice" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search Engine Optimization</CardTitle>
              <CardDescription>
                Improve your product's visibility in search results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Page Title</Label>
                <Input
                  id="seoTitle"
                  placeholder="SEO title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  placeholder="Brief description for search results"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoSlug">URL Slug</Label>
                <Input
                  id="seoSlug"
                  placeholder="product-url-slug"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productTags">Tags</Label>
                <Input
                  id="productTags"
                  placeholder="Add tags separated by commas"
                />
                <p className="text-xs text-muted-foreground">
                  e.g., new, bestseller, limited
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productVendor">Vendor</Label>
                <Input
                  id="productVendor"
                  placeholder="Enter vendor name"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button variant="outline">Save as Draft</Button>
        <Button>Publish Product</Button>
      </div>
    </div>
  );
} 