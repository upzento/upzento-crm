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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, MoreVertical, ArrowLeft, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Sample services data
const sampleServices = [
  {
    id: 1,
    name: "Website Consultation",
    description: "In-depth analysis of your current website with recommendations for improvement.",
    duration: 60,
    price: 99.99,
    category: "Consulting",
    color: "#3b82f6",
    onlineBookingEnabled: true,
    bufferTimeBefore: 15,
    bufferTimeAfter: 15,
  },
  {
    id: 2,
    name: "SEO Review",
    description: "Comprehensive review of your website's search engine optimization.",
    duration: 90,
    price: 149.99,
    category: "Consulting",
    color: "#8b5cf6",
    onlineBookingEnabled: true,
    bufferTimeBefore: 0,
    bufferTimeAfter: 0,
  },
  {
    id: 3,
    name: "Logo Design Feedback",
    description: "Expert feedback on your logo design with suggestions for improvement.",
    duration: 60,
    price: 79.99,
    category: "Design",
    color: "#ec4899",
    onlineBookingEnabled: true,
    bufferTimeBefore: 10,
    bufferTimeAfter: 5,
  },
  {
    id: 4,
    name: "Marketing Strategy",
    description: "Develop a comprehensive marketing strategy for your business.",
    duration: 120,
    price: 199.99,
    category: "Marketing",
    color: "#f97316",
    onlineBookingEnabled: true,
    bufferTimeBefore: 15,
    bufferTimeAfter: 15,
  },
];

// Sample categories data
const sampleCategories = [
  { id: 1, name: "Consulting", description: "Business and technical consulting services" },
  { id: 2, name: "Design", description: "Design and creative services" },
  { id: 3, name: "Marketing", description: "Marketing and promotional services" },
];

export default function ServicesManagementPage() {
  const [services, setServices] = useState(sampleServices);
  const [categories, setCategories] = useState(sampleCategories);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("services");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/client/appointments">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Appointments
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
        </div>
        <div className="flex space-x-2">
          {activeTab === "services" ? (
            <Button onClick={() => setIsAddServiceOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          ) : (
            <Button onClick={() => setIsAddCategoryOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: service.color }}
                        ></div>
                        {service.name}
                      </CardTitle>
                      <CardDescription>{service.category}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Service</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete Service
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration} minutes
                    </div>
                    <div className="flex items-center text-sm font-medium">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {service.price.toFixed(2)}
                    </div>
                  </div>
                  {(service.bufferTimeBefore > 0 || service.bufferTimeAfter > 0) && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Buffer time: {service.bufferTimeBefore > 0 ? `${service.bufferTimeBefore} min before` : ""}
                      {service.bufferTimeBefore > 0 && service.bufferTimeAfter > 0 ? ", " : ""}
                      {service.bufferTimeAfter > 0 ? `${service.bufferTimeAfter} min after` : ""}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-1 flex justify-between items-center">
                  <div className="text-sm flex items-center">
                    <span className="mr-2">Online Booking:</span>
                    <Switch
                      checked={service.onlineBookingEnabled}
                      onCheckedChange={() => {}}
                    />
                  </div>
                  <Badge variant={service.onlineBookingEnabled ? "default" : "outline"}>
                    {service.onlineBookingEnabled ? "Active" : "Disabled"}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
              <CardDescription>
                Organize your services into categories for easier management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.description}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">
                        {
                          services.filter(
                            (service) => service.category === category.name
                          ).length
                        }{" "}
                        services
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Service Dialog */}
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
            <DialogDescription>
              Create a new service that clients can book appointments for.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Service Name</Label>
                <Input id="name" placeholder="Name of the service" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this service includes"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex space-x-2 mt-2">
                  {["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#f59e0b"].map(
                    (color) => (
                      <div
                        key={color}
                        className="w-8 h-8 rounded-full cursor-pointer border-2 border-transparent hover:border-gray-300"
                        style={{ backgroundColor: color }}
                      ></div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="Duration in minutes"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="price" type="number" className="pl-8" placeholder="0.00" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bufferBefore">Buffer Time Before (minutes)</Label>
                <Input
                  id="bufferBefore"
                  type="number"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="bufferAfter">Buffer Time After (minutes)</Label>
                <Input
                  id="bufferAfter"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="onlineBooking" />
              <Label htmlFor="onlineBooking">Enable Online Booking</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddServiceOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your services.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input id="categoryName" placeholder="Name of the category" />
            </div>
            <div>
              <Label htmlFor="categoryDescription">Description</Label>
              <Textarea
                id="categoryDescription"
                placeholder="Brief description of this category"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddCategoryOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 