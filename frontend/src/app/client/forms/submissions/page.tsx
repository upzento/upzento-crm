'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock submission data
const mockSubmissions = [
  {
    id: '1',
    formName: 'Contact Form',
    submittedBy: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    date: '2023-07-02 14:32',
    status: 'new',
    data: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      subject: 'General Inquiry',
      message: 'I would like to learn more about your services. Can someone contact me?',
      newsletter: true,
      updates: false
    }
  },
  {
    id: '2',
    formName: 'Contact Form',
    submittedBy: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 987-6543',
    date: '2023-07-01 09:15',
    status: 'viewed',
    data: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 987-6543',
      subject: 'Technical Support',
      message: 'I am having trouble with my account. Can someone help me?',
      newsletter: false,
      updates: true
    }
  },
  {
    id: '3',
    formName: 'Newsletter Signup',
    submittedBy: 'Michael Brown',
    email: 'michael@example.com',
    phone: null,
    date: '2023-07-01 08:45',
    status: 'new',
    data: {
      name: 'Michael Brown',
      email: 'michael@example.com',
      interests: ['technology', 'business']
    }
  },
  {
    id: '4',
    formName: 'Product Feedback',
    submittedBy: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1 (555) 456-7890',
    date: '2023-06-30 16:22',
    status: 'viewed',
    data: {
      name: 'Emily Davis',
      email: 'emily@example.com',
      product: 'Premium Plan',
      rating: 4,
      feedback: 'I love the product overall, but would like to see more customization options.'
    }
  },
  {
    id: '5',
    formName: 'Support Request',
    submittedBy: 'David Wilson',
    email: 'david@example.com',
    phone: '+1 (555) 234-5678',
    date: '2023-06-29 11:05',
    status: 'flagged',
    data: {
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1 (555) 234-5678',
      issue: 'Billing',
      urgency: 'High',
      description: 'I was charged twice for my subscription this month. Please help resolve this issue.'
    }
  },
  {
    id: '6',
    formName: 'Newsletter Signup',
    submittedBy: 'Lisa Roberts',
    email: 'lisa@example.com',
    phone: null,
    date: '2023-06-29 10:17',
    status: 'viewed',
    data: {
      name: 'Lisa Roberts',
      email: 'lisa@example.com',
      interests: ['marketing', 'design']
    }
  },
  {
    id: '7',
    formName: 'Contact Form',
    submittedBy: 'Robert Taylor',
    email: 'robert@example.com',
    phone: '+1 (555) 876-5432',
    date: '2023-06-28 15:30',
    status: 'archived',
    data: {
      name: 'Robert Taylor',
      email: 'robert@example.com',
      phone: '+1 (555) 876-5432',
      subject: 'Partnership Opportunity',
      message: 'I would like to discuss a potential partnership with your company.',
      newsletter: true,
      updates: true
    }
  }
];

export default function SubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formFilter, setFormFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Get unique form names for filter
  const formNames = ['all', ...new Set(mockSubmissions.map(sub => sub.formName))];
  
  // Filter submissions based on search query, status, and form
  const filteredSubmissions = mockSubmissions.filter(submission => {
    const matchesSearch = 
      submission.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (submission.phone && submission.phone.includes(searchQuery));
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesForm = formFilter === 'all' || submission.formName === formFilter;
    
    return matchesSearch && matchesStatus && matchesForm;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Get the selected submission data
  const selectedSubmissionData = mockSubmissions.find(sub => sub.id === selectedSubmission);
  
  // Status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> New
          </Badge>
        );
      case 'viewed':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Viewed
          </Badge>
        );
      case 'flagged':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Flagged
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
            <Archive className="h-3 w-3" /> Archived
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/client/forms">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Form Submissions</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>
                View and manage form submissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-1 items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search submissions..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="border rounded-md px-3 py-2"
                    value={formFilter}
                    onChange={(e) => setFormFilter(e.target.value)}
                  >
                    {formNames.map((name) => (
                      <option key={name} value={name}>
                        {name === 'all' ? 'All Forms' : name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="border rounded-md px-3 py-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="viewed">Viewed</option>
                    <option value="flagged">Flagged</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Form</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSubmissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No submissions found matching your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedSubmissions.map((submission) => (
                        <TableRow 
                          key={submission.id}
                          className={selectedSubmission === submission.id ? 'bg-muted/50' : ''}
                          onClick={() => setSelectedSubmission(submission.id)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{submission.submittedBy}</p>
                              <p className="text-sm text-muted-foreground">{submission.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{submission.formName}</TableCell>
                          <TableCell>{submission.date}</TableCell>
                          <TableCell>{getStatusBadge(submission.status)}</TableCell>
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
                                <DropdownMenuItem onClick={() => setSelectedSubmission(submission.id)}>
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" /> Reply
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" /> Export
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} of {filteredSubmissions.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Submission Details */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
              <CardDescription>
                View the details of the selected submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSubmissionData ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium">{selectedSubmissionData.submittedBy}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{selectedSubmissionData.email}</span>
                    </div>
                    {selectedSubmissionData.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{selectedSubmissionData.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedSubmissionData.date}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Form Data</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedSubmissionData.data).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <p className="text-sm font-medium capitalize">{key}</p>
                          <div className="bg-muted/50 p-2 rounded-md">
                            {typeof value === 'boolean' ? (
                              value ? 'Yes' : 'No'
                            ) : Array.isArray(value) ? (
                              value.join(', ')
                            ) : key === 'rating' ? (
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < (value as number) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm break-words">{value as string}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 flex justify-between">
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Eye className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Submission Selected</h3>
                  <p>Select a submission from the list to view its details.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 