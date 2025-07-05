'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Copy, Download, Eye } from 'lucide-react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock data - replace with actual API calls
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

const formTypes = [
  { id: 'all', label: 'All Types' },
  { id: 'contact', label: 'Contact' },
  { id: 'email', label: 'Email' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'event', label: 'Event' },
  { id: 'support', label: 'Support' },
];

export default function FormsPage() {
  const router = useRouter();
  const [activeType, setActiveType] = useState('all');
  const [activeTab, setActiveTab] = useState('forms'); // 'forms' or 'submissions'

  const filteredForms = activeType === 'all' 
    ? mockForms 
    : mockForms.filter(form => form.type === activeType);

  const handleCreateForm = () => {
    router.push('/dashboard/forms/create');
  };

  const handleViewSubmissions = (id: string) => {
    router.push(`/dashboard/forms/${id}/submissions`);
  };

  const handlePreviewForm = (id: string) => {
    router.push(`/dashboard/forms/${id}/preview`);
  };

  const handleCopyEmbed = (id: string) => {
    // TODO: Implement embed code copying
    console.log('Copy embed code for form:', id);
  };

  const handleExportSubmissions = (id: string) => {
    // TODO: Implement submissions export
    console.log('Export submissions for form:', id);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Forms</h1>
          <p className="text-muted-foreground">Manage your forms and view submissions</p>
        </div>
        <Button onClick={handleCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="forms">My Forms</TabsTrigger>
          <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="forms">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2 mb-6">
                {formTypes.map(type => (
                  <Button
                    key={type.id}
                    variant={activeType === type.id ? "default" : "outline"}
                    onClick={() => setActiveType(type.id)}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>

              <div className="rounded-md border">
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
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {form.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{form.submissions}</TableCell>
                        <TableCell>{form.lastSubmission}</TableCell>
                        <TableCell>
                          <Badge variant={form.status === 'active' ? "default" : "secondary"}>
                            {form.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewSubmissions(form.id)}
                            >
                              View Submissions
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreviewForm(form.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyEmbed(form.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExportSubmissions(form.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          {/* TODO: Implement recent submissions view */}
          <Card>
            <CardContent className="p-6">
              <p>Recent form submissions will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 