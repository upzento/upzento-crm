'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { addDays, format, subDays } from 'date-fns';

// Mock data - replace with API calls
const mockData = {
  overview: {
    totalForms: 12,
    activeForms: 8,
    totalSubmissions: 342,
    conversionRate: 28.5,
  },
  formPerformance: [
    { name: 'Contact Form', submissions: 145, views: 512, conversion: 28.3 },
    { name: 'Newsletter', submissions: 87, views: 245, conversion: 35.5 },
    { name: 'Survey', submissions: 56, views: 189, conversion: 29.6 },
    { name: 'Event Registration', submissions: 34, views: 156, conversion: 21.8 },
    { name: 'Support Request', submissions: 20, views: 98, conversion: 20.4 },
  ],
  submissionsByDate: [
    { date: '2024-02-20', submissions: 24, views: 85 },
    { date: '2024-02-21', submissions: 31, views: 92 },
    { date: '2024-02-22', submissions: 28, views: 88 },
    { date: '2024-02-23', submissions: 35, views: 110 },
    { date: '2024-02-24', submissions: 42, views: 125 },
    { date: '2024-02-25', submissions: 38, views: 115 },
    { date: '2024-02-26', submissions: 45, views: 142 },
  ],
  submissionsBySource: [
    { name: 'Website', value: 45 },
    { name: 'Email', value: 25 },
    { name: 'Social Media', value: 20 },
    { name: 'Direct', value: 10 },
  ],
  submissionsByDevice: [
    { name: 'Desktop', value: 55 },
    { name: 'Mobile', value: 35 },
    { name: 'Tablet', value: 10 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedForm, setSelectedForm] = useState('all');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track form performance and submissions</p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedForm} onValueChange={setSelectedForm}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select form" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Forms</SelectItem>
              {mockData.formPerformance.map((form) => (
                <SelectItem key={form.name} value={form.name.toLowerCase()}>
                  {form.name}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.totalForms}</div>
            <p className="text-xs text-muted-foreground">
              {mockData.overview.activeForms} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg. Time to Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 45s</div>
            <p className="text-xs text-muted-foreground">
              -15s from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Submissions Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData.submissionsByDate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="submissions"
                        stroke="#8884d8"
                        name="Submissions"
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#82ca9d"
                        name="Views"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockData.formPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="conversion"
                        fill="#8884d8"
                        name="Conversion Rate (%)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forms">
          <Card>
            <CardContent className="p-6">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-muted">Form Name</th>
                      <th className="px-6 py-3 bg-muted">Views</th>
                      <th className="px-6 py-3 bg-muted">Submissions</th>
                      <th className="px-6 py-3 bg-muted">Conversion</th>
                      <th className="px-6 py-3 bg-muted">Avg. Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData.formPerformance.map((form) => (
                      <tr key={form.name} className="border-b">
                        <td className="px-6 py-4 font-medium">{form.name}</td>
                        <td className="px-6 py-4">{form.views}</td>
                        <td className="px-6 py-4">{form.submissions}</td>
                        <td className="px-6 py-4">{form.conversion}%</td>
                        <td className="px-6 py-4">2m 30s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Submissions by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockData.submissionsBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockData.submissionsBySource.map((entry, index) => (
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

            <Card>
              <CardHeader>
                <CardTitle>Submissions by Device</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockData.submissionsByDevice}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockData.submissionsByDevice.map((entry, index) => (
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

        <TabsContent value="sources">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Top Referrers</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2">Source</th>
                        <th className="text-left py-2">Submissions</th>
                        <th className="text-left py-2">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2">example.com</td>
                        <td className="py-2">145</td>
                        <td className="py-2">32.5%</td>
                      </tr>
                      <tr>
                        <td className="py-2">google.com</td>
                        <td className="py-2">98</td>
                        <td className="py-2">28.4%</td>
                      </tr>
                      <tr>
                        <td className="py-2">facebook.com</td>
                        <td className="py-2">76</td>
                        <td className="py-2">24.8%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Campaign Performance</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2">Campaign</th>
                        <th className="text-left py-2">Views</th>
                        <th className="text-left py-2">Submissions</th>
                        <th className="text-left py-2">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2">Spring Sale</td>
                        <td className="py-2">512</td>
                        <td className="py-2">145</td>
                        <td className="py-2">28.3%</td>
                      </tr>
                      <tr>
                        <td className="py-2">Email Newsletter</td>
                        <td className="py-2">245</td>
                        <td className="py-2">87</td>
                        <td className="py-2">35.5%</td>
                      </tr>
                      <tr>
                        <td className="py-2">Social Media</td>
                        <td className="py-2">189</td>
                        <td className="py-2">56</td>
                        <td className="py-2">29.6%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 