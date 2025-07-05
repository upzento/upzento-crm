'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, FileText, Code, Download, MoreHorizontal, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
    embedCode: '<iframe src="https://app.upzento.com/embed/forms/1"></iframe>',
  },
  {
    id: '2',
    name: 'Newsletter Signup',
    type: 'email',
    submissions: 187,
    lastSubmission: '5 minutes ago',
    status: 'active',
    embedCode: '<iframe src="https://app.upzento.com/embed/forms/2"></iframe>',
  },
  {
    id: '3',
    name: 'Product Feedback',
    type: 'feedback',
    submissions: 56,
    lastSubmission: '1 day ago',
    status: 'active',
    embedCode: '<iframe src="https://app.upzento.com/embed/forms/3"></iframe>',
  },
  {
    id: '4',
    name: 'Event Registration',
    type: 'event',
    submissions: 42,
    lastSubmission: '3 days ago',
    status: 'inactive',
    embedCode: '<iframe src="https://app.upzento.com/embed/forms/4"></iframe>',
  },
  {
    id: '5',
    name: 'Support Request',
    type: 'support',
    submissions: 18,
    lastSubmission: '1 week ago',
    status: 'active',
    embedCode: '<iframe src="https://app.upzento.com/embed/forms/5"></iframe>',
  },
];

export default function ClientFormsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  const filteredForms = selectedType === 'all'
    ? mockForms
    : mockForms.filter(form => form.type === selectedType);

  const handleCreateForm = () => {
    router.push('/client/forms/create');
  };

  const handleViewSubmissions = (formId: string) => {
    router.push(`/client/forms/${formId}/submissions`);
  };

  const handlePreviewForm = (formId: string) => {
    // Open in new tab
    window.open(`/client/forms/${formId}/preview`, '_blank');
  };

  const handleCopyEmbedCode = (form: any) => {
    setSelectedForm(form);
    setShowEmbedCode(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: "Embed code copied to clipboard",
      });
      setShowEmbedCode(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy embed code",
        variant: "destructive",
      });
    }
  };

  const handleExportSubmissions = async (formId: string) => {
    try {
      // In real app, make API call to get CSV
      const response = await fetch(`/api/forms/${formId}/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `form-${formId}-submissions.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export submissions",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Forms</h1>
          <p className="text-gray-500">Manage your forms and view submissions</p>
        </div>
        <Button onClick={handleCreateForm}>
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
                            <DropdownMenuItem onClick={() => handleViewSubmissions(form.id)}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Submissions
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePreviewForm(form.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview Form
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyEmbedCode(form)}>
                              <Code className="h-4 w-4 mr-2" />
                              Copy Embed Code
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportSubmissions(form.id)}>
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

      {/* Embed Code Dialog */}
      <Dialog open={showEmbedCode} onOpenChange={setShowEmbedCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Embed Code</DialogTitle>
            <DialogDescription>
              Copy this code to embed the form on your website
            </DialogDescription>
          </DialogHeader>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{selectedForm?.embedCode}</code>
          </pre>
          <DialogFooter>
            <Button onClick={() => copyToClipboard(selectedForm?.embedCode)}>
              Copy Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 