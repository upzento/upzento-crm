'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Calendar as CalendarIcon,
  ChevronDown,
  Check,
  Copy,
  Mail,
  FileDown,
  FileUp,
} from 'lucide-react';
import { addDays, format, subDays } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

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
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isCreateDashboardOpen, setIsCreateDashboardOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [filters, setFilters] = useState({
    channels: [],
    metrics: [],
    minRevenue: '',
    maxRevenue: '',
    showTrends: true,
  });
  const [newDashboard, setNewDashboard] = useState({
    name: '',
    description: '',
    isPublic: false,
    layout: 'grid',
  });
  const { toast } = useToast();

  const handleExport = (format: 'pdf' | 'csv' | 'xlsx') => {
    toast({
      title: "Exporting Analytics",
      description: `Your analytics data will be exported as ${format.toUpperCase()}`,
    });
    // In real implementation, this would trigger the export API call
  };

  const handleShare = async (method: 'copy' | 'email') => {
    if (method === 'copy') {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Dashboard link has been copied to clipboard",
      });
    } else {
      window.location.href = `mailto:?subject=Analytics Dashboard&body=Check out this dashboard: ${window.location.href}`;
    }
  };

  const handleCreateDashboard = () => {
    toast({
      title: "Dashboard Created",
      description: `Dashboard "${newDashboard.name}" has been created successfully`,
    });
    setIsCreateDashboardOpen(false);
    // In real implementation, this would create the dashboard via API
  };

  const handleApplyFilters = () => {
    toast({
      title: "Filters Applied",
      description: "The dashboard has been updated with your filters",
    });
    setIsFilterDialogOpen(false);
    // In real implementation, this would refresh the data with filters
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

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
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filter Analytics</DialogTitle>
                  <DialogDescription>
                    Customize your analytics view with filters
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Revenue Range</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min"
                        value={filters.minRevenue}
                        onChange={(e) => setFilters({ ...filters, minRevenue: e.target.value })}
                      />
                      <Input
                        placeholder="Max"
                        value={filters.maxRevenue}
                        onChange={(e) => setFilters({ ...filters, maxRevenue: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Show Trends</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={filters.showTrends}
                        onCheckedChange={(checked) => setFilters({ ...filters, showTrends: checked })}
                      />
                      <Label>Include trend indicators</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleApplyFilters}>Apply Filters</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Share Dashboard</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleShare('copy')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('email')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Share via Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isCreateDashboardOpen} onOpenChange={setIsCreateDashboardOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Dashboard
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Dashboard</DialogTitle>
                  <DialogDescription>
                    Create a custom dashboard to track specific metrics
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Dashboard Name</Label>
                    <Input
                      id="name"
                      value={newDashboard.name}
                      onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
                      placeholder="My Custom Dashboard"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newDashboard.description}
                      onChange={(e) => setNewDashboard({ ...newDashboard, description: e.target.value })}
                      placeholder="Track specific metrics and KPIs"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public"
                      checked={newDashboard.isPublic}
                      onCheckedChange={(checked) => setNewDashboard({ ...newDashboard, isPublic: checked })}
                    />
                    <Label htmlFor="public">Make dashboard public</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDashboardOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDashboard}>Create Dashboard</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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

        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                  </>
                ) : (
                  formatDate(dateRange.from)
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={(range: any) => {
                setDateRange(range);
                if (range?.from && range?.to) {
                  setIsDatePickerOpen(false);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
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