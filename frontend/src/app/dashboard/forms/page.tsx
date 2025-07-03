'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  Search, 
  FileText, 
  Edit, 
  Trash2, 
  Copy, 
  BarChart3,
  Eye,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

// Mock data for initial development
const mockForms = [
  {
    id: '1',
    name: 'Contact Form',
    description: 'Simple contact form for website',
    status: 'ACTIVE',
    submissions: 124,
    createdAt: '2023-11-15T10:30:00Z',
    updatedAt: '2023-12-05T14:22:00Z',
  },
  {
    id: '2',
    name: 'Event Registration',
    description: 'Registration form for upcoming events',
    status: 'ACTIVE',
    submissions: 56,
    createdAt: '2023-10-20T09:15:00Z',
    updatedAt: '2023-12-01T11:45:00Z',
  },
  {
    id: '3',
    name: 'Customer Feedback',
    description: 'Form to collect customer feedback and suggestions',
    status: 'INACTIVE',
    submissions: 89,
    createdAt: '2023-09-05T15:20:00Z',
    updatedAt: '2023-11-10T16:30:00Z',
  },
  {
    id: '4',
    name: 'Product Survey',
    description: 'Survey about new product features',
    status: 'DRAFT',
    submissions: 0,
    createdAt: '2023-12-01T08:45:00Z',
    updatedAt: '2023-12-01T08:45:00Z',
  },
];

export default function FormsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [forms, setForms] = useState(mockForms);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);
  
  // Filter forms based on search query
  const filteredForms = forms.filter(form => 
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    form.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle form creation
  const handleCreateForm = () => {
    router.push('/dashboard/forms/create');
  };

  // Function to handle form editing
  const handleEditForm = (id: string) => {
    router.push(`/dashboard/forms/${id}/edit`);
  };

  // Function to handle form deletion
  const handleDeleteForm = (id: string) => {
    setFormToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Function to confirm form deletion
  const confirmDeleteForm = () => {
    if (formToDelete) {
      // In a real app, make API call to delete the form
      setForms(forms.filter(form => form.id !== formToDelete));
      
      toast({
        title: "Form deleted",
        description: "The form has been successfully deleted.",
      });
      
      setIsDeleteDialogOpen(false);
      setFormToDelete(null);
    }
  };

  // Function to handle form duplication
  const handleDuplicateForm = (id: string) => {
    const formToDuplicate = forms.find(form => form.id === id);
    if (formToDuplicate) {
      const newForm = {
        ...formToDuplicate,
        id: `${Date.now()}`, // Generate a temporary ID
        name: `${formToDuplicate.name} (Copy)`,
        submissions: 0,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setForms([...forms, newForm]);
      
      toast({
        title: "Form duplicated",
        description: "A copy of the form has been created.",
      });
    }
  };

  // Function to handle viewing form submissions
  const handleViewSubmissions = (id: string) => {
    router.push(`/dashboard/forms/${id}/submissions`);
  };

  // Function to handle viewing form preview
  const handleViewPreview = (id: string) => {
    router.push(`/dashboard/forms/${id}/preview`);
  };

  // Function to handle viewing form embed code
  const handleViewEmbedCode = (id: string) => {
    router.push(`/dashboard/forms/${id}/embed`);
  };

  // Function to handle viewing form analytics
  const handleViewAnalytics = (id: string) => {
    router.push(`/dashboard/forms/${id}/analytics`);
  };

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'INACTIVE':
        return 'bg-amber-500';
      case 'DRAFT':
        return 'bg-slate-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forms</h1>
        <Button onClick={handleCreateForm} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Form
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search forms..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <Card key={form.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{form.name}</CardTitle>
                  <CardDescription className="mt-1">{form.description}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(form.status)} text-white`}>
                  {form.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                <span>{form.submissions} submissions</span>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Created: {new Date(form.createdAt).toLocaleDateString()}
                <br />
                Last updated: {new Date(form.updatedAt).toLocaleDateString()}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-3">
              <Button variant="outline" size="sm" onClick={() => handleViewPreview(form.id)}>
                <Eye className="h-4 w-4 mr-1" /> Preview
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Form Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleEditForm(form.id)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Form
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleViewSubmissions(form.id)}>
                    <FileText className="h-4 w-4 mr-2" /> View Submissions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleViewAnalytics(form.id)}>
                    <BarChart3 className="h-4 w-4 mr-2" /> Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleViewEmbedCode(form.id)}>
                    <Code className="h-4 w-4 mr-2" /> Embed Code
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicateForm(form.id)}>
                    <Copy className="h-4 w-4 mr-2" /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDeleteForm(form.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredForms.length === 0 && (
        <div className="text-center py-10">
          <FileText className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No forms found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchQuery ? 'Try a different search term' : 'Create your first form to get started'}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreateForm} className="mt-4">
              Create Form
            </Button>
          )}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this form? This action cannot be undone and all submissions will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteForm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 