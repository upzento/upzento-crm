'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, FileText, Code, Download, MoreHorizontal, Plus } from 'lucide-react';

// Form types for filtering
const FORM_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'contact', label: 'Contact' },
  { value: 'email', label: 'Email' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'event', label: 'Event' },
  { value: 'support', label: 'Support' },
];

// Mock data - replace with API call
const mockForms = [
  {
    id: '1',
    name: 'Contact Form',
    type: 'contact',
    submissions: 24,
    lastSubmission: '2 hours ago',
    status: 'active',
  },
  {
    id: '2',
    name: 'Newsletter Signup',
    type: 'email',
    submissions: 187,
    lastSubmission: '5 minutes ago',
    status: 'active',
  },
  {
    id: '3',
    name: 'Product Feedback',
    type: 'feedback',
    submissions: 56,
    lastSubmission: '1 day ago',
    status: 'active',
  },
  {
    id: '4',
    name: 'Event Registration',
    type: 'event',
    submissions: 42,
    lastSubmission: '3 days ago',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Support Request',
    type: 'support',
    submissions: 18,
    lastSubmission: '1 week ago',
    status: 'active',
  },
];

export default function ClientFormsPage() {
  const [selectedType, setSelectedType] = useState('all');

  const filteredForms = selectedType === 'all'
    ? mockForms
    : mockForms.filter(form => form.type === selectedType);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Forms</h1>
          <p className="text-gray-500">Manage your forms and view submissions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>

      <Tabs defaultValue="my-forms">
        <TabsList>
          <TabsTrigger value="my-forms">My Forms</TabsTrigger>
          <TabsTrigger value="recent-submissions">Recent Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="my-forms" className="space-y-6">
          <div className="flex gap-2">
            {FORM_TYPES.map(type => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                onClick={() => setSelectedType(type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Last Submission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.name}</TableCell>
                      <TableCell className="capitalize">{form.type}</TableCell>
                      <TableCell>{form.submissions}</TableCell>
                      <TableCell>{form.lastSubmission}</TableCell>
                      <TableCell>
                        <Badge variant={form.status === 'active' ? "default" : "secondary"}>
                          {form.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              View Submissions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview Form
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Code className="h-4 w-4 mr-2" />
                              Copy Embed Code
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Export Submissions
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent-submissions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Form Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add recent submissions table here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 