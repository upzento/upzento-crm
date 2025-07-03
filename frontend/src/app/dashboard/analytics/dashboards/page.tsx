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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  PlusCircle,
  MoreHorizontal,
  Copy,
  Trash2,
  Share2,
  LineChart,
  BarChart3,
  PieChart,
  LayoutDashboard,
  Clock,
  Users,
  ShoppingCart,
  Globe,
  Search,
  BarChart,
} from "lucide-react";
import Link from "next/link";

// Sample dashboards data
const sampleDashboards = [
  {
    id: 1,
    name: "Marketing Overview",
    description: "Key marketing metrics and campaign performance",
    type: "marketing",
    widgets: 8,
    lastEdited: "2 days ago",
    shared: true,
    favorite: true,
  },
  {
    id: 2,
    name: "Sales Performance",
    description: "Sales metrics, revenue, and product performance",
    type: "sales",
    widgets: 6,
    lastEdited: "1 week ago",
    shared: true,
    favorite: false,
  },
  {
    id: 3,
    name: "Website Analytics",
    description: "Traffic sources, user behavior, and conversions",
    type: "website",
    widgets: 10,
    lastEdited: "3 days ago",
    shared: false,
    favorite: true,
  },
  {
    id: 4,
    name: "Customer Insights",
    description: "Customer demographics, behavior, and retention",
    type: "customers",
    widgets: 7,
    lastEdited: "5 days ago",
    shared: false,
    favorite: false,
  },
  {
    id: 5,
    name: "Social Media Performance",
    description: "Social engagement, followers, and content metrics",
    type: "social",
    widgets: 9,
    lastEdited: "Yesterday",
    shared: true,
    favorite: true,
  },
];

// Sample widget templates
const widgetTemplates = [
  {
    id: 1,
    name: "Traffic Overview",
    type: "line",
    category: "website",
    description: "Website traffic over time",
    icon: <LineChart className="h-8 w-8" />,
  },
  {
    id: 2,
    name: "Conversion Funnel",
    type: "bar",
    category: "conversions",
    description: "Visitor journey through conversion steps",
    icon: <BarChart3 className="h-8 w-8" />,
  },
  {
    id: 3,
    name: "Traffic Sources",
    type: "pie",
    category: "website",
    description: "Distribution of traffic sources",
    icon: <PieChart className="h-8 w-8" />,
  },
  {
    id: 4,
    name: "Revenue by Product",
    type: "bar",
    category: "sales",
    description: "Revenue breakdown by product",
    icon: <BarChart3 className="h-8 w-8" />,
  },
  {
    id: 5,
    name: "Customer Demographics",
    type: "pie",
    category: "customers",
    description: "Customer age and gender distribution",
    icon: <PieChart className="h-8 w-8" />,
  },
  {
    id: 6,
    name: "Campaign Performance",
    type: "bar",
    category: "marketing",
    description: "Marketing campaign metrics",
    icon: <BarChart3 className="h-8 w-8" />,
  },
  {
    id: 7,
    name: "Customer Retention",
    type: "line",
    category: "customers",
    description: "Customer retention over time",
    icon: <LineChart className="h-8 w-8" />,
  },
  {
    id: 8,
    name: "Sales Trends",
    type: "line",
    category: "sales",
    description: "Sales performance over time",
    icon: <LineChart className="h-8 w-8" />,
  },
];

// Dashboard templates
const dashboardTemplates = [
  {
    id: 1,
    name: "Marketing Dashboard",
    description: "Track campaign performance and marketing ROI",
    widgets: 6,
    icon: <BarChart className="h-10 w-10" />,
  },
  {
    id: 2,
    name: "Sales Dashboard",
    description: "Monitor sales performance and revenue metrics",
    widgets: 7,
    icon: <ShoppingCart className="h-10 w-10" />,
  },
  {
    id: 3,
    name: "Website Performance",
    description: "Analyze website traffic and user behavior",
    widgets: 8,
    icon: <Globe className="h-10 w-10" />,
  },
  {
    id: 4,
    name: "Customer Analytics",
    description: "Understand customer behavior and demographics",
    widgets: 6,
    icon: <Users className="h-10 w-10" />,
  },
  {
    id: 5,
    name: "SEO Dashboard",
    description: "Track search rankings and organic performance",
    widgets: 5,
    icon: <Search className="h-10 w-10" />,
  },
];

export default function DashboardsPage() {
  const [activeTab, setActiveTab] = useState("my-dashboards");
  const [isCreateDashboardOpen, setIsCreateDashboardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  // Filter dashboards based on search query
  const filteredDashboards = sampleDashboards.filter((dashboard) =>
    dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dashboard.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/analytics">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Analytics
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboards</h1>
        </div>
        <Button onClick={() => setIsCreateDashboardOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Dashboard
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="my-dashboards">My Dashboards</TabsTrigger>
            <TabsTrigger value="shared">Shared With Me</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="widgets">Widget Library</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search dashboards..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="my-dashboards" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDashboards.map((dashboard) => (
              <Card key={dashboard.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle>{dashboard.name}</CardTitle>
                        {dashboard.favorite && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 text-yellow-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <CardDescription className="mt-1">
                        {dashboard.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {dashboard.favorite ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4 mr-2 text-yellow-500"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Remove from Favorites
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 mr-2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                />
                              </svg>
                              Add to Favorites
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <LayoutDashboard className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{dashboard.widgets} widgets</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{dashboard.lastEdited}</span>
                      </div>
                    </div>
                    {dashboard.shared && (
                      <Badge variant="outline">Shared</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t">
                  <Link href={`/dashboard/analytics/dashboards/${dashboard.id}`} className="w-full">
                    <Button className="w-full">View Dashboard</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shared" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDashboards
              .filter((dashboard) => dashboard.shared)
              .map((dashboard) => (
                <Card key={dashboard.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{dashboard.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {dashboard.description}
                        </CardDescription>
                      </div>
                      <Badge>Shared</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm">
                      <div className="flex items-center mr-4">
                        <LayoutDashboard className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{dashboard.widgets} widgets</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{dashboard.lastEdited}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3 border-t">
                    <Link href={`/dashboard/analytics/dashboards/${dashboard.id}`} className="w-full">
                      <Button className="w-full">View Dashboard</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="bg-muted/40 rounded-full p-6 mb-4">
                    {template.icon}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {template.widgets} pre-configured widgets
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setIsCreateDashboardOpen(true);
                    }}
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="widgets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {widgetTemplates.map((widget) => (
              <Card key={widget.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{widget.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {widget.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-4">
                  <div className="bg-muted/40 rounded-full p-4 mb-2">
                    {widget.icon}
                  </div>
                  <Badge variant="outline" className="mt-2">
                    {widget.category.charAt(0).toUpperCase() + widget.category.slice(1)}
                  </Badge>
                </CardContent>
                <CardFooter className="pt-2 border-t">
                  <Button variant="outline" className="w-full">
                    Add to Dashboard
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Dashboard Dialog */}
      <Dialog open={isCreateDashboardOpen} onOpenChange={setIsCreateDashboardOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Dashboard</DialogTitle>
            <DialogDescription>
              {selectedTemplate
                ? `Create a dashboard using the ${
                    dashboardTemplates.find((t) => t.id === selectedTemplate)?.name
                  } template`
                : "Create a custom analytics dashboard"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Dashboard Name</Label>
              <Input
                id="name"
                placeholder={
                  selectedTemplate
                    ? dashboardTemplates.find((t) => t.id === selectedTemplate)?.name
                    : "My Custom Dashboard"
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this dashboard"
                rows={3}
                defaultValue={
                  selectedTemplate
                    ? dashboardTemplates.find((t) => t.id === selectedTemplate)?.description
                    : ""
                }
              />
            </div>
            {!selectedTemplate && (
              <div className="space-y-2">
                <Label>Dashboard Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <input
                      type="radio"
                      id="type-blank"
                      name="dashboardType"
                      className="h-4 w-4"
                      defaultChecked
                    />
                    <Label htmlFor="type-blank" className="flex-1 cursor-pointer">
                      <div className="font-medium">Blank Dashboard</div>
                      <div className="text-xs text-muted-foreground">
                        Start with an empty dashboard
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <input
                      type="radio"
                      id="type-template"
                      name="dashboardType"
                      className="h-4 w-4"
                    />
                    <Label htmlFor="type-template" className="flex-1 cursor-pointer">
                      <div className="font-medium">From Template</div>
                      <div className="text-xs text-muted-foreground">
                        Use a pre-configured template
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Sharing Options</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="private"
                  name="sharing"
                  className="h-4 w-4"
                  defaultChecked
                />
                <Label htmlFor="private">Private</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="team" name="sharing" className="h-4 w-4" />
                <Label htmlFor="team">Share with Team</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="public" name="sharing" className="h-4 w-4" />
                <Label htmlFor="public">Public</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDashboardOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateDashboardOpen(false)}>
              Create Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 