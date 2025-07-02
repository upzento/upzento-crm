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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  PlusCircle,
  Download,
  Calendar,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Settings,
  RefreshCw,
  Share2,
} from "lucide-react";
import Link from "next/link";

// Sample data for charts
const trafficData = [
  { name: "Jan", website: 4000, social: 2400, email: 1800, referral: 1200 },
  { name: "Feb", website: 3000, social: 1398, email: 2200, referral: 900 },
  { name: "Mar", website: 2000, social: 9800, email: 2200, referral: 3000 },
  { name: "Apr", website: 2780, social: 3908, email: 2000, referral: 1500 },
  { name: "May", website: 1890, social: 4800, email: 2500, referral: 2100 },
  { name: "Jun", website: 2390, social: 3800, email: 2800, referral: 2400 },
  { name: "Jul", website: 3490, social: 4300, email: 2400, referral: 1800 },
];

const conversionData = [
  { name: "Jan", rate: 2.4 },
  { name: "Feb", rate: 2.8 },
  { name: "Mar", rate: 3.2 },
  { name: "Apr", rate: 2.9 },
  { name: "May", rate: 3.5 },
  { name: "Jun", rate: 3.8 },
  { name: "Jul", rate: 4.2 },
];

const channelData = [
  { name: "Organic Search", value: 40 },
  { name: "Direct", value: 25 },
  { name: "Social", value: 20 },
  { name: "Referral", value: 10 },
  { name: "Email", value: 5 },
];

const deviceData = [
  { name: "Desktop", value: 55 },
  { name: "Mobile", value: 35 },
  { name: "Tablet", value: 10 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#22c55e"];

// Sample KPI data
const kpiData = {
  visitors: {
    value: 12483,
    change: 12.5,
    trend: "up",
  },
  pageviews: {
    value: 48291,
    change: 8.2,
    trend: "up",
  },
  conversionRate: {
    value: 4.2,
    change: 0.8,
    trend: "up",
  },
  bounceRate: {
    value: 32.8,
    change: -2.1,
    trend: "down",
  },
};

// Sample dashboard list
const dashboards = [
  { id: 1, name: "Marketing Overview", type: "marketing" },
  { id: 2, name: "Sales Performance", type: "sales" },
  { id: 3, name: "Website Analytics", type: "website" },
  { id: 4, name: "Customer Insights", type: "customers" },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
        <div className="flex space-x-2">
          <Link href="/dashboard/analytics/integrations">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Integrations
            </Button>
          </Link>
          <Link href="/dashboard/analytics/dashboards">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TabsContent value="overview" className="mt-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.visitors.value.toLocaleString()}</div>
              <p className={`text-xs ${kpiData.visitors.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {kpiData.visitors.trend === "up" ? "+" : "-"}{Math.abs(kpiData.visitors.change)}% from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.pageviews.value.toLocaleString()}</div>
              <p className={`text-xs ${kpiData.pageviews.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {kpiData.pageviews.trend === "up" ? "+" : "-"}{Math.abs(kpiData.pageviews.change)}% from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20" />
                <path d="m17 5-5-3-5 3" />
                <path d="m17 19-5 3-5-3" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.conversionRate.value}%</div>
              <p className={`text-xs ${kpiData.conversionRate.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {kpiData.conversionRate.trend === "up" ? "+" : "-"}{Math.abs(kpiData.conversionRate.change)}% from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.bounceRate.value}%</div>
              <p className={`text-xs ${kpiData.bounceRate.trend === "down" ? "text-green-500" : "text-red-500"}`}>
                {kpiData.bounceRate.trend === "down" ? "-" : "+"}{Math.abs(kpiData.bounceRate.change)}% from last period
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Visitor acquisition channels over time
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trafficData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="website" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                    <Area type="monotone" dataKey="social" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                    <Area type="monotone" dataKey="email" stackId="1" stroke="#ec4899" fill="#ec4899" />
                    <Area type="monotone" dataKey="referral" stackId="1" stroke="#f97316" fill="#f97316" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
              <CardDescription>
                Website conversion rate over time
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={conversionData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rate" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Channels</CardTitle>
              <CardDescription>
                Distribution of visitor acquisition channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>
                Visitors by device type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deviceData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Percentage" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="traffic" className="mt-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown of website traffic sources and patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trafficData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="website" name="Direct" fill="#3b82f6" />
                  <Bar dataKey="social" name="Social Media" fill="#8b5cf6" />
                  <Bar dataKey="email" name="Email" fill="#ec4899" />
                  <Bar dataKey="referral" name="Referral" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Landing Pages</CardTitle>
              <CardDescription>
                Pages with the most visitor entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { url: "/home", visits: 3245, bounce: "32%" },
                  { url: "/products", visits: 2189, bounce: "28%" },
                  { url: "/blog/top-10-tips", visits: 1654, bounce: "45%" },
                  { url: "/services", visits: 1432, bounce: "39%" },
                  { url: "/contact", visits: 1021, bounce: "22%" },
                ].map((page, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{page.url}</div>
                      <div className="text-sm text-muted-foreground">
                        Bounce rate: {page.bounce}
                      </div>
                    </div>
                    <div className="font-bold">{page.visits.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Traffic Geography</CardTitle>
              <CardDescription>
                Visitor locations by country
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { country: "United States", visits: 5245, percent: "42%" },
                  { country: "United Kingdom", visits: 2189, percent: "18%" },
                  { country: "Germany", visits: 1654, percent: "13%" },
                  { country: "Canada", visits: 1432, percent: "11%" },
                  { country: "Australia", visits: 1021, percent: "8%" },
                  { country: "Other", visits: 987, percent: "8%" },
                ].map((country, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="font-medium">{country.country}</div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-muted-foreground">
                        {country.percent}
                      </div>
                      <div className="font-bold">{country.visits.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="conversions" className="mt-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>
              Visitor journey through the conversion process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { name: "Visitors", value: 12483 },
                    { name: "Product Views", value: 8245 },
                    { name: "Add to Cart", value: 3842 },
                    { name: "Checkout", value: 2105 },
                    { name: "Purchases", value: 1245 },
                  ]}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Converting Pages</CardTitle>
              <CardDescription>
                Pages with highest conversion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { url: "/products/premium-plan", rate: "8.2%", conversions: 245 },
                  { url: "/special-offer", rate: "7.5%", conversions: 189 },
                  { url: "/products/basic-plan", rate: "6.4%", conversions: 154 },
                  { url: "/services/consultation", rate: "5.9%", conversions: 132 },
                  { url: "/products/enterprise", rate: "5.2%", conversions: 121 },
                ].map((page, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="font-medium">{page.url}</div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-green-500 font-bold">
                        {page.rate}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {page.conversions} conv.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion by Channel</CardTitle>
              <CardDescription>
                Conversion rates by traffic source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Organic", rate: 3.2 },
                      { name: "Direct", rate: 4.5 },
                      { name: "Social", rate: 2.8 },
                      { name: "Referral", rate: 5.2 },
                      { name: "Email", rate: 6.4 },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rate" name="Conversion Rate (%)" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="dashboards" className="mt-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((dashboard) => (
            <Card key={dashboard.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{dashboard.name}</CardTitle>
                <CardDescription>
                  {dashboard.type.charAt(0).toUpperCase() + dashboard.type.slice(1)} Dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[160px] bg-muted/40 flex items-center justify-center">
                  {dashboard.type === "marketing" && (
                    <BarChart3 className="h-16 w-16 text-muted-foreground/60" />
                  )}
                  {dashboard.type === "sales" && (
                    <LineChartIcon className="h-16 w-16 text-muted-foreground/60" />
                  )}
                  {dashboard.type === "website" && (
                    <BarChart3 className="h-16 w-16 text-muted-foreground/60" />
                  )}
                  {dashboard.type === "customers" && (
                    <PieChartIcon className="h-16 w-16 text-muted-foreground/60" />
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Link href={`/dashboard/analytics/dashboards/${dashboard.id}`}>
                  <Button size="sm">View Dashboard</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}

          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle>Create New Dashboard</CardTitle>
              <CardDescription>
                Build a custom analytics dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[160px] bg-muted/20 flex items-center justify-center">
                <PlusCircle className="h-16 w-16 text-muted-foreground/40" />
              </div>
            </CardContent>
            <CardFooter className="pt-3">
              <Link href="/dashboard/analytics/dashboards/new" className="w-full">
                <Button className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
} 