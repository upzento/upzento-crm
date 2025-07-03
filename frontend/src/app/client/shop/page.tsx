"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Package,
  ShoppingCart,
  Tag,
  Store,
  Percent,
  BarChart3,
  ExternalLink,
  Settings,
} from "lucide-react";
import Link from "next/link";

// Sample products data
const sampleProducts = [
  {
    id: 1,
    name: "Premium Website Audit",
    price: 99.99,
    category: "Digital Services",
    status: "active",
    inventory: "unlimited",
    sales: 24,
    image: "/products/website-audit.jpg",
  },
  {
    id: 2,
    name: "SEO Strategy Guide",
    price: 49.99,
    category: "Digital Products",
    status: "active",
    inventory: 150,
    sales: 78,
    image: "/products/seo-guide.jpg",
  },
  {
    id: 3,
    name: "Marketing Consultation (1 hour)",
    price: 149.99,
    category: "Services",
    status: "active",
    inventory: "limited",
    sales: 12,
    image: "/products/marketing-consultation.jpg",
  },
  {
    id: 4,
    name: "Logo Design Package",
    price: 299.99,
    category: "Design Services",
    status: "draft",
    inventory: "unlimited",
    sales: 0,
    image: "/products/logo-design.jpg",
  },
  {
    id: 5,
    name: "Social Media Content Calendar",
    price: 29.99,
    category: "Digital Products",
    status: "active",
    inventory: 200,
    sales: 45,
    image: "/products/content-calendar.jpg",
  },
];

// Sample orders data
const sampleOrders = [
  {
    id: "ORD-1234",
    customer: "John Smith",
    email: "john@example.com",
    date: "2023-07-01",
    status: "completed",
    total: 99.99,
    items: 1,
  },
  {
    id: "ORD-1235",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    date: "2023-07-02",
    status: "processing",
    total: 149.99,
    items: 1,
  },
  {
    id: "ORD-1236",
    customer: "Michael Brown",
    email: "michael@example.com",
    date: "2023-07-03",
    status: "completed",
    total: 79.98,
    items: 2,
  },
  {
    id: "ORD-1237",
    customer: "Emily Davis",
    email: "emily@example.com",
    date: "2023-07-04",
    status: "pending",
    total: 299.99,
    items: 1,
  },
  {
    id: "ORD-1238",
    customer: "David Wilson",
    email: "david@example.com",
    date: "2023-07-05",
    status: "completed",
    total: 49.99,
    items: 1,
  },
];

// Sample categories data
const sampleCategories = [
  { id: 1, name: "Digital Products", count: 2 },
  { id: 2, name: "Digital Services", count: 1 },
  { id: 3, name: "Services", count: 1 },
  { id: 4, name: "Design Services", count: 1 },
];

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter products based on search query and filters
  const filteredProducts = sampleProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate total sales
  const totalSales = sampleProducts.reduce(
    (sum, product) => sum + product.sales * product.price,
    0
  );

  // Calculate total products
  const totalProducts = sampleProducts.length;

  // Calculate active products
  const activeProducts = sampleProducts.filter(
    (product) => product.status === "active"
  ).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
        <div className="flex space-x-2">
          <Link href="/client/shop/widgets">
            <Button variant="outline">
              <Store className="h-4 w-4 mr-2" />
              Shop Widgets
            </Button>
          </Link>
          <Link href="/client/shop/settings">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Link href="/client/shop/products/new">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {activeProducts} active products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              {
                sampleOrders.filter((order) => order.status === "completed")
                  .length
              }{" "}
              completed orders
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {sampleCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Link href="/client/shop/categories">
              <Button variant="outline" size="sm">
                <Tag className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-md bg-muted"></div>
                          <div>{product.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {product.inventory === "unlimited" ? (
                          <Badge variant="outline">Unlimited</Badge>
                        ) : product.inventory === "limited" ? (
                          <Badge variant="outline">Limited</Badge>
                        ) : (
                          product.inventory
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.status === "active" ? "default" : "secondary"}
                        >
                          {product.status === "active" ? "Active" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit Product</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>View Analytics</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {sampleProducts.length} products
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>{order.customer}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.email}
                        </div>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "processing"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {sampleOrders.length} orders
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="pl-8 w-[300px]"
              />
            </div>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>
                    {category.count} product{category.count !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Products
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Category</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete Category
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coupons" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search coupons..."
                className="pl-8 w-[300px]"
              />
            </div>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </div>

          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Percent className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Coupons Yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
                Create discount coupons to offer special promotions to your
                customers. You can set percentage or fixed amount discounts.
              </p>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Coupon
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Shop Overview</CardTitle>
          <CardDescription>
            View your shop performance and manage your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
                <Button variant="outline" className="justify-start">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Orders
                </Button>
                <Button variant="outline" className="justify-start">
                  <Percent className="h-4 w-4 mr-2" />
                  Create Coupon
                </Button>
                <Button variant="outline" className="justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Shop
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>New order received</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Just now</span>
                </div>
                <div className="flex justify-between items-center p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Product "SEO Strategy Guide" updated</span>
                  </div>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex justify-between items-center p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Order #ORD-1234 completed</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 