'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Download, 
  Search, 
  Calendar, 
  Trash2, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Mock form data for development
const mockForm = {
  id: '123',
  name: 'Contact Form',
  description: 'Simple contact form for website',
  fields: [
    { id: 'field-1', label: 'Full Name', type: 'TEXT' },
    { id: 'field-2', label: 'Email Address', type: 'EMAIL' },
    { id: 'field-3', label: 'Phone Number', type: 'PHONE' },
    { id: 'field-4', label: 'Subject', type: 'SELECT' },
    { id: 'field-5', label: 'Message', type: 'TEXTAREA' },
    { id: 'field-6', label: 'Subscribe to Newsletter', type: 'CHECKBOX' },
  ],
};

// Mock submissions data for development
const mockSubmissions = [
  {
    id: 'sub-1',
    createdAt: '2023-12-05T14:22:00Z',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    responses: [
      { fieldId: 'field-1', value: 'John Doe' },
      { fieldId: 'field-2', value: 'john.doe@example.com' },
      { fieldId: 'field-3', value: '+1 (555) 123-4567' },
      { fieldId: 'field-4', value: 'general' },
      { fieldId: 'field-5', value: 'I have a question about your services.' },
      { fieldId: 'field-6', value: ['yes'] },
    ],
  },
  {
    id: 'sub-2',
    createdAt: '2023-12-04T09:15:00Z',
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    responses: [
      { fieldId: 'field-1', value: 'Jane Smith' },
      { fieldId: 'field-2', value: 'jane.smith@example.com' },
      { fieldId: 'field-3', value: '+1 (555) 987-6543' },
      { fieldId: 'field-4', value: 'support' },
      { fieldId: 'field-5', value: 'I need help with my account.' },
      { fieldId: 'field-6', value: [] },
    ],
  },
  {
    id: 'sub-3',
    createdAt: '2023-12-03T16:45:00Z',
    ipAddress: '192.168.1.3',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    responses: [
      { fieldId: 'field-1', value: 'Robert Johnson' },
      { fieldId: 'field-2', value: 'robert.johnson@example.com' },
      { fieldId: 'field-3', value: '+1 (555) 456-7890' },
      { fieldId: 'field-4', value: 'billing' },
      { fieldId: 'field-5', value: 'I have a question about my recent invoice.' },
      { fieldId: 'field-6', value: ['yes'] },
    ],
  },
];

export default function FormSubmissionsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState(mockForm);
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);
  
  // Function to handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Function to handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  // Function to view submission details
  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
  };
  
  // Function to delete submission
  const handleDeleteSubmission = (submission) => {
    setSubmissionToDelete(submission);
    setIsDeleteDialogOpen(true);
  };
  
  // Function to confirm submission deletion
  const confirmDeleteSubmission = () => {
    if (submissionToDelete) {
      // In a real app, make API call to delete the submission
      setSubmissions(submissions.filter(sub => sub.id !== submissionToDelete.id));
      
      toast({
        title: "Submission deleted",
        description: "The form submission has been successfully deleted.",
      });
      
      setIsDeleteDialogOpen(false);
      setSubmissionToDelete(null);
    }
  };
  
  // Function to export submissions as CSV
  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    toast({
      title: "Export started",
      description: "Your CSV export is being prepared for download.",
    });
    
    // Mock download after a short delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your CSV file has been downloaded.",
      });
    }, 1500);
  };
  
  // Filter submissions based on search query
  const filteredSubmissions = submissions.filter(submission => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    // Search in all response values
    return submission.responses.some(response => {
      const value = response.value;
      if (Array.isArray(value)) {
        return value.some(v => v.toLowerCase().includes(searchLower));
      } else if (typeof value === 'string') {
        return value.toLowerCase().includes(searchLower);
      }
      return false;
    });
  });
  
  // Sort submissions
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (sortField === 'createdAt') {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    // For other fields, sort by the corresponding response value
    const responseA = a.responses.find(r => r.fieldId === sortField);
    const responseB = b.responses.find(r => r.fieldId === sortField);
    
    const valueA = responseA ? responseA.value : '';
    const valueB = responseB ? responseB.value : '';
    
    if (sortDirection === 'asc') {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    } else {
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    }
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedSubmissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);
  
  // Function to get response value by field ID
  const getResponseValue = (submission, fieldId) => {
    const response = submission.responses.find(r => r.fieldId === fieldId);
    if (!response) return '-';
    
    const value = response.value;
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'No';
    }
    return value || '-';
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/forms')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Forms
          </Button>
          <h1 className="text-3xl font-bold">Submissions: {form.name}</h1>
        </div>
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search submissions..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {/* Submissions Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Date
                  {sortField === 'createdAt' && (
                    sortDirection === 'asc' ? 
                    <ChevronUp className="h-4 w-4 ml-1" /> : 
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </TableHead>
              {form.fields.slice(0, 3).map((field) => (
                <TableHead 
                  key={field.id}
                  className="cursor-pointer"
                  onClick={() => handleSort(field.id)}
                >
                  <div className="flex items-center">
                    {field.label}
                    {sortField === field.id && (
                      sortDirection === 'asc' ? 
                      <ChevronUp className="h-4 w-4 ml-1" /> : 
                      <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    {formatDate(submission.createdAt)}
                  </TableCell>
                  {form.fields.slice(0, 3).map((field) => (
                    <TableCell key={field.id}>
                      {getResponseValue(submission, field.id)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewSubmission(submission)}
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteSubmission(submission)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <p className="text-gray-500">No submissions found</p>
                  {searchQuery && (
                    <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                
                // Show first page, last page, and pages around current page
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={pageNumber === currentPage}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                // Show ellipsis for skipped pages
                if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      {/* Submission Details Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedSubmission && formatDate(selectedSubmission.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              {form.fields.map((field) => (
                <div key={field.id} className="grid grid-cols-3 gap-4 py-2 border-b">
                  <div className="font-medium">{field.label}</div>
                  <div className="col-span-2">{getResponseValue(selectedSubmission, field.id)}</div>
                </div>
              ))}
              
              <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">IP Address</div>
                <div className="col-span-2">{selectedSubmission.ipAddress}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">User Agent</div>
                <div className="col-span-2 text-xs">{selectedSubmission.userAgent}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
              Close
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                handleDeleteSubmission(selectedSubmission);
                setSelectedSubmission(null);
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this submission? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSubmission}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 