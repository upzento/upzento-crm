'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MoreHorizontal,
  Search,
  Eye,
  Download,
  Copy,
  ExternalLink,
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';

// Mock data for forms
const forms = [
  {
    id: '1',
    name: 'Contact Form',
    type: 'Contact',
    submissions: 24,
    lastSubmission: '2 hours ago',
    created: '2023-05-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Newsletter Signup',
    type: 'Email',
    submissions: 187,
    lastSubmission: '5 minutes ago',
    created: '2023-04-22',
    status: 'active'
  },
  {
    id: '3',
    name: 'Product Feedback',
    type: 'Feedback',
    submissions: 56,
    lastSubmission: '1 day ago',
    created: '2023-06-10',
    status: 'active'
  },
  {
    id: '4',
    name: 'Event Registration',
    type: 'Event',
    submissions: 42,
    lastSubmission: '3 days ago',
    created: '2023-07-05',
    status: 'inactive'
  },
  {
    id: '5',
    name: 'Support Request',
    type: 'Support',
    submissions: 18,
    lastSubmission: '1 week ago',
    created: '2023-03-18',
    status: 'active'
  }
];

// Mock data for submissions
const submissions = [
  {
    id: '1',
    formName: 'Contact Form',
    submittedBy: 'John Smith',
    email: 'john@example.com',
    date: '2023-07-02 14:32',
    status: 'new'
  },
  {
    id: '2',
    formName: 'Contact Form',
    submittedBy: 'Sarah Johnson',
    email: 'sarah@example.com',
    date: '2023-07-01 09:15',
    status: 'viewed'
  },
  {
    id: '3',
    formName: 'Newsletter Signup',
    submittedBy: 'Michael Brown',
    email: 'michael@example.com',
    date: '2023-07-01 08:45',
    status: 'new'
  },
  {
    id: '4',
    formName: 'Product Feedback',
    submittedBy: 'Emily Davis',
    email: 'emily@example.com',
    date: '2023-06-30 16:22',
    status: 'viewed'
  },
  {
    id: '5',
    formName: 'Support Request',
    submittedBy: 'David Wilson',
    email: 'david@example.com',
    date: '2023-06-29 11:05',
    status: 'new'
  },
  {
    id: '6',
    formName: 'Newsletter Signup',
    submittedBy: 'Lisa Roberts',
    email: 'lisa@example.com',
    date: '2023-06-29 10:17',
    status: 'viewed'
  },
  {
    id: '7',
    formName: 'Contact Form',
    submittedBy: 'Robert Taylor',
    email: 'robert@example.com',
    date: '2023-06-28 15:30',
    status: 'viewed'
  }
];

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState('forms');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Filter forms based on search query and type filter
  const filteredForms = forms.filter(form => {
    const matchesSearch = 
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || form.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  // Filter submissions based on search query
  const filteredSubmissions = submissions.filter(submission => 
    submission.formName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get unique form types for filter dropdown
  const formTypes = ['all', ...new Set(forms.map(form => form.type))];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
      </div>
      
      <Tabs defaultValue="forms" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="forms">My Forms</TabsTrigger>
          <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Forms</CardTitle>
              <CardDescription>
                Manage your forms and view submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search forms..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="border rounded-md px-3 py-2"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    {formTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </option>
                    ))}
                  </select>
                </div>
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
                        <TableCell>{form.type}</TableCell>
                        <TableCell>{form.submissions}</TableCell>
                        <TableCell>{form.lastSubmission}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            form.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {form.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> View Submissions
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="mr-2 h-4 w-4" /> Preview Form
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" /> Copy Embed Code
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" /> Export Submissions
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                View and manage form submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search submissions..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Form</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.formName}</TableCell>
                        <TableCell>{submission.submittedBy}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {submission.status === 'new' ? (
                              <Clock className="mr-2 h-4 w-4 text-blue-500" />
                            ) : (
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            )}
                            <span className="capitalize">{submission.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" /> View Form
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" /> Download
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 