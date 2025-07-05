'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { BarChart3, LineChart, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAnalytics } from '@/lib/hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ClientAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use our analytics data fetching hook
  const { 
    kpiData, 
    trafficData, 
    conversionData, 
    channelData, 
    deviceData,
    loading, 
    error,
    dateRange, 
    updateDateRange,
    fetchAllData
  } = useAnalytics();
  
  // Handle refreshing data
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };
  
  // Handle date range change
  const handleDateRangeChange = (newRange: string) => {
    updateDateRange(newRange);
  };

  // Show loading state
  if (loading && !refreshing && !kpiData) {
    return (
      <div className="container mx-auto py-6 space-y-6 flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium">Loading analytics data...</h2>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error && !kpiData) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <h2 className="text-xl font-medium text-red-800 dark:text-red-300">Error loading analytics data</h2>
          <p className="mt-2 text-red-700 dark:text-red-400">{error.message}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={handleRefresh}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <Loader2 className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:grid-cols-4 lg:w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Visitors"
              value={kpiData?.visitors.value.toLocaleString() || '0'}
              change={kpiData?.visitors.change || 0}
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <MetricCard
              title="Conversion Rate"
              value={`${kpiData?.conversionRate.value || 0}%`}
              change={kpiData?.conversionRate.change || 0}
              icon={<LineChart className="h-5 w-5" />}
            />
            <MetricCard
              title="Avg. Session"
              value="2m 32s"
              change={8.1}
              icon={<LineChart className="h-5 w-5" />}
            />
            <MetricCard
              title="Bounce Rate"
              value={`${kpiData?.bounceRate.value || 0}%`}
              change={kpiData?.bounceRate.change || 0}
              icon={<PieChart className="h-5 w-5" />}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
                <CardDescription>
                  Website traffic over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                  {loading && refreshing ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <p className="text-muted-foreground">Traffic chart will be displayed here</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Traffic Sources</CardTitle>
                <CardDescription>
                  Where your visitors are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                  {loading && refreshing ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <p className="text-muted-foreground">Source chart will be displayed here</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of your website traffic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center bg-muted/20 rounded-md">
                {loading && refreshing ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <p className="text-muted-foreground">Detailed traffic analytics will be displayed here</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Analytics</CardTitle>
              <CardDescription>
                Track your conversion goals and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center bg-muted/20 rounded-md">
                {loading && refreshing ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <p className="text-muted-foreground">Conversion analytics will be displayed here</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Analyze where your traffic is coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center bg-muted/20 rounded-md">
                {loading && refreshing ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <p className="text-muted-foreground">Traffic sources will be displayed here</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ title, value, change, icon }) {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">{title}</span>
          <span className="bg-primary/10 p-2 rounded-full text-primary">
            {icon}
          </span>
        </div>
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          <span>{Math.abs(change)}% from last period</span>
        </div>
      </CardContent>
    </Card>
  );
} 