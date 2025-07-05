'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Eye, Edit, Trash2, BarChart } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// This will be replaced with actual API data
const mockForms = [
  {
    id: '1',
    name: 'Contact Form',
    description: 'General contact form for inquiries',
    isActive: true,
    submissions: 145,
    createdAt: '2024-02-20T10:00:00Z',
    lastSubmission: '2024-02-25T15:30:00Z',
  },
  {
    id: '2',
    name: 'Event Registration',
    description: 'Registration form for upcoming events',
    isActive: true,
    submissions: 89,
    createdAt: '2024-02-18T09:00:00Z',
    lastSubmission: '2024-02-24T12:15:00Z',
  },
  {
    id: '3',
    name: 'Feedback Survey',
    description: 'Customer feedback collection form',
    isActive: false,
    submissions: 256,
    createdAt: '2024-02-15T14:00:00Z',
    lastSubmission: '2024-02-22T18:45:00Z',
  },
];

export default function FormsPage() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Forms</h1>
          <p className="text-gray-500">Create and manage your forms</p>
        </div>
        <Link href="/dashboard/forms/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockForms.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockForms.filter(form => form.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockForms.reduce((acc, form) => acc + form.submissions, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Submission</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{form.name}</div>
                        <div className="text-sm text-gray-500">{form.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={form.isActive ? "success" : "secondary"}>
                      {form.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{form.submissions}</TableCell>
                  <TableCell>{formatDate(form.createdAt)}</TableCell>
                  <TableCell>{formatDate(form.lastSubmission)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/forms/${form.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/forms/${form.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/forms/${form.id}/analytics`}>
                        <Button variant="ghost" size="sm">
                          <BarChart className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 