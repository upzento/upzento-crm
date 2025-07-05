'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormRenderer } from '@/components/forms/form-renderer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Eye, BarChart } from 'lucide-react';

// Mock data - replace with actual API calls
const mockForm = {
  id: '1',
  name: 'Contact Form',
  description: 'General contact form for inquiries',
  isActive: true,
  fields: [
    {
      id: 'field-1',
      label: 'Full Name',
      type: 'text',
      isRequired: true,
      placeholder: 'Enter your full name',
    },
    {
      id: 'field-2',
      label: 'Email',
      type: 'email',
      isRequired: true,
      placeholder: 'Enter your email address',
    },
    {
      id: 'field-3',
      label: 'Message',
      type: 'textarea',
      isRequired: true,
      placeholder: 'Enter your message',
    },
  ],
};

const mockSubmissions = [
  {
    id: '1',
    submittedAt: '2024-02-25T15:30:00Z',
    data: {
      'field-1': 'John Doe',
      'field-2': 'john@example.com',
      'field-3': 'Hello, I would like to inquire about your services.',
    },
  },
  {
    id: '2',
    submittedAt: '2024-02-24T10:15:00Z',
    data: {
      'field-1': 'Jane Smith',
      'field-2': 'jane@example.com',
      'field-3': 'Could you please provide more information about pricing?',
    },
  },
];

export default function FormViewPage({ params }: { params: { id: string } }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/forms">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forms
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{mockForm.name}</h1>
            <p className="text-gray-500">{mockForm.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/forms/${params.id}/analytics`}>
            <Button variant="outline">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </Link>
          <Link href={`/dashboard/forms/${params.id}/edit`}>
            <Button>Edit Form</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={mockForm.isActive ? "default" : "secondary"}>
              {mockForm.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Form URL</CardTitle>
          </CardHeader>
          <CardContent className="truncate">
            <code className="text-sm">
              https://example.com/forms/{params.id}
            </code>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <FormRenderer
                formId={params.id}
                name={mockForm.name}
                description={mockForm.description}
                fields={mockForm.fields}
                onSubmit={async (data) => {
                  console.log('Form submitted:', data);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="submissions" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Form Submissions</CardTitle>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    {mockForm.fields.map((field) => (
                      <TableHead key={field.id}>{field.label}</TableHead>
                    ))}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                      {mockForm.fields.map((field) => (
                        <TableCell key={field.id}>
                          {submission.data[field.id]}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 