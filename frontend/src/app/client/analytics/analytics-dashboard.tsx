'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Settings,
  Download,
  Share2,
  Plus,
  Filter,
} from 'lucide-react';
import { addDays, format, subDays } from 'date-fns';

// Mock data - replace with API calls
const mockData = {
  overview: {
    totalRevenue: 125000,
    totalLeads: 842,
    conversionRate: 28.5,
    averageOrderValue: 149,
  },
  revenueByChannel: [
    { name: 'Website', value: 45000 },
    { name: 'Social Media', value: 35000 },
    { name: 'Email', value: 25000 },
    { name: 'Direct', value: 20000 },
  ],
  leadsBySource: [
    { name: 'Organic Search', value: 320 },
    { name: 'Paid Ads', value: 280 },
    { name: 'Social Media', value: 142 },
    { name: 'Referral', value: 100 },
  ],
  performanceOverTime: [
    { date: '2024-02-20', revenue: 4200, leads: 24 },
    { date: '2024-02-21', revenue: 4800, leads: 31 },
    { date: '2024-02-22', revenue: 4500, leads: 28 },
    { date: '2024-02-23', revenue: 5100, leads: 35 },
    { date: '2024-02-24', revenue: 5800, leads: 42 },
    { date: '2024-02-25', revenue: 5200, leads: 38 },
    { date: '2024-02-26', revenue: 6100, leads: 45 },
  ],
  integrations: [
    { id: 'ga4', name: 'Google Analytics 4', status: 'connected' },
    { id: 'meta', name: 'Meta Ads', status: 'connected' },
    { id: 'linkedin', name: 'LinkedIn Ads', status: 'disconnected' },
    { id: 'google_ads', name: 'Google Ads', status: 'connected' },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedDataSource, setSelectedDataSource] = useState('all');

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track and analyze your business performance</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Date and Source Selection */}
      <div className="flex justify-between items-center">
        <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select data source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {mockData.integrations.map((integration) => (
              <SelectItem key={integration.id} value={integration.id}>
                {integration.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Calendar
          mode="range"
          selected={{ from: dateRange.from, to: dateRange.to }}
          onSelect={(range: any) => setDateRange(range)}
          numberOfMonths={2}
          className="rounded-md border"
        />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockData.overview.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              12% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.totalLeads.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              8% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.conversionRate}%</div>
            <div className="flex items-center text-xs text-red-500">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              2% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockData.overview.averageOrderValue}</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              5% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
                <CardDescription>Revenue and leads trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData.performanceOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        name="Revenue"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="leads"
                        stroke="#82ca9d"
                        name="Leads"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Channel</CardTitle>
                <CardDescription>Distribution across marketing channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockData.revenueByChannel}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={130}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockData.revenueByChannel.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Detailed revenue analysis and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData.performanceOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      name="Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Leads by Source</CardTitle>
                <CardDescription>Lead generation channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockData.leadsBySource}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" name="Leads" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Quality Distribution</CardTitle>
                <CardDescription>Lead scoring analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Hot', value: 30 },
                          { name: 'Warm', value: 45 },
                          { name: 'Cold', value: 25 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={130}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockData.leadsBySource.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Track marketing campaign effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-muted">Campaign</th>
                      <th className="px-6 py-3 bg-muted">Spend</th>
                      <th className="px-6 py-3 bg-muted">Revenue</th>
                      <th className="px-6 py-3 bg-muted">ROAS</th>
                      <th className="px-6 py-3 bg-muted">Leads</th>
                      <th className="px-6 py-3 bg-muted">CPL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-6 py-4 font-medium">Spring Sale</td>
                      <td className="px-6 py-4">$5,000</td>
                      <td className="px-6 py-4">$25,000</td>
                      <td className="px-6 py-4">5.0x</td>
                      <td className="px-6 py-4">145</td>
                      <td className="px-6 py-4">$34.48</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-6 py-4 font-medium">Summer Promotion</td>
                      <td className="px-6 py-4">$3,500</td>
                      <td className="px-6 py-4">$18,000</td>
                      <td className="px-6 py-4">5.1x</td>
                      <td className="px-6 py-4">98</td>
                      <td className="px-6 py-4">$35.71</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-6 py-4 font-medium">Product Launch</td>
                      <td className="px-6 py-4">$8,000</td>
                      <td className="px-6 py-4">$42,000</td>
                      <td className="px-6 py-4">5.25x</td>
                      <td className="px-6 py-4">235</td>
                      <td className="px-6 py-4">$34.04</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Platforms</CardTitle>
                <CardDescription>Manage your analytics integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Settings className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{integration.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Status: {integration.status}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {integration.status === 'connected' ? 'Configure' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Integrations</CardTitle>
                <CardDescription>Connect more data sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Twitter Ads</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect your Twitter Ads account
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">TikTok Ads</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect your TikTok Ads account
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 