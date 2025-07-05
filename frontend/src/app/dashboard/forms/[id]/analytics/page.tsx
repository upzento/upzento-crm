import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data - replace with actual API data
const mockForm = {
  id: '1',
  name: 'Contact Form',
  description: 'General contact form for inquiries',
};

const submissionsData = [
  { date: '2024-02-19', submissions: 12 },
  { date: '2024-02-20', submissions: 15 },
  { date: '2024-02-21', submissions: 8 },
  { date: '2024-02-22', submissions: 23 },
  { date: '2024-02-23', submissions: 17 },
  { date: '2024-02-24', submissions: 14 },
  { date: '2024-02-25', submissions: 19 },
];

const completionRateData = [
  { name: 'Completed', value: 85 },
  { name: 'Abandoned', value: 15 },
];

const fieldCompletionData = [
  { name: 'Full Name', completion: 98 },
  { name: 'Email', completion: 95 },
  { name: 'Phone', completion: 75 },
  { name: 'Message', completion: 85 },
];

const COLORS = ['#4ade80', '#f43f5e', '#3b82f6', '#a855f7'];

export default function FormAnalyticsPage({ params }: { params: { id: string } }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/forms/${params.id}`}>
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Form
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{mockForm.name} Analytics</h1>
            <p className="text-gray-500">{mockForm.description}</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">108</div>
            <p className="text-sm text-gray-500">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-sm text-gray-500">+5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg. Time to Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 45s</div>
            <p className="text-sm text-gray-500">-30s from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32%</div>
            <p className="text-sm text-gray-500">+8% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submissions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={submissionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value: any) => [value, 'Submissions']}
                    labelFormatter={formatDate}
                  />
                  <Line
                    type="monotone"
                    dataKey="submissions"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionRateData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value}%)`}
                  >
                    {completionRateData.map((entry, index) => (
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Field Completion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fieldCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis
                    fontSize={12}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, 'Completion Rate']}
                  />
                  <Line
                    type="monotone"
                    dataKey="completion"
                    stroke="#a855f7"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 