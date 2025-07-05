'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "@/components/ui/use-toast";
import { contactsApi } from '@/lib/api/api-client';
import {
  Search,
  Plus,
  MoreHorizontal,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  User,
  Users,
  Building,
  Tag,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Star,
  StarHalf,
  AlertCircle,
  FileText
} from 'lucide-react';

// Mock data for contacts
const contacts = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Inc.',
    jobTitle: 'Marketing Director',
    type: 'customer',
    tags: ['VIP', 'Enterprise'],
    leadStatus: 'customer',
    leadSource: 'Website',
    lastActivity: '2023-07-01',
    dateAdded: '2022-05-15',
    assignedTo: 'Alex Johnson',
    notes: 'Key decision maker for the enterprise account.'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 987-6543',
    company: 'XYZ Corp',
    jobTitle: 'CEO',
    type: 'lead',
    tags: ['Hot Lead'],
    leadStatus: 'qualified',
    leadSource: 'Referral',
    lastActivity: '2023-06-28',
    dateAdded: '2023-06-15',
    assignedTo: 'Maria Garcia',
    notes: 'Interested in premium plan.'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 456-7890',
    company: 'Brown & Associates',
    jobTitle: 'Consultant',
    type: 'partner',
    tags: ['Partner', 'Consultant'],
    leadStatus: 'customer',
    leadSource: 'Conference',
    lastActivity: '2023-06-25',
    dateAdded: '2022-11-10',
    assignedTo: 'Alex Johnson',
    notes: 'Strategic partner for consulting services.'
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 789-0123',
    company: 'Tech Solutions',
    jobTitle: 'CTO',
    type: 'lead',
    tags: ['Technical', 'Enterprise'],
    leadStatus: 'contacted',
    leadSource: 'LinkedIn',
    lastActivity: '2023-06-20',
    dateAdded: '2023-06-10',
    assignedTo: 'Maria Garcia',
    notes: 'Looking for enterprise solution.'
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Wilson Marketing',
    jobTitle: 'Owner',
    type: 'customer',
    tags: ['SMB'],
    leadStatus: 'customer',
    leadSource: 'Google Ads',
    lastActivity: '2023-06-18',
    dateAdded: '2022-08-22',
    assignedTo: 'Alex Johnson',
    notes: 'Small business owner, subscribed to basic plan.'
  },
  {
    id: '6',
    firstName: 'Lisa',
    lastName: 'Roberts',
    email: 'lisa.roberts@example.com',
    phone: '+1 (555) 876-5432',
    company: 'Roberts & Co',
    jobTitle: 'Sales Manager',
    type: 'lead',
    tags: ['Cold Lead'],
    leadStatus: 'new',
    leadSource: 'Email Campaign',
    lastActivity: '2023-06-15',
    dateAdded: '2023-06-15',
    assignedTo: 'Unassigned',
    notes: 'Responded to summer promotion email.'
  },
  {
    id: '7',
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@example.com',
    phone: '+1 (555) 345-6789',
    company: 'Taylor Industries',
    jobTitle: 'Procurement Manager',
    type: 'customer',
    tags: ['Enterprise'],
    leadStatus: 'customer',
    leadSource: 'Trade Show',
    lastActivity: '2023-06-10',
    dateAdded: '2022-03-05',
    assignedTo: 'Maria Garcia',
    notes: 'Enterprise customer with multiple locations.'
  }
];

// Mock data for tags
const tags = [
  { id: '1', name: 'VIP', color: '#FF6B6B' },
  { id: '2', name: 'Enterprise', color: '#4ECDC4' },
  { id: '3', name: 'SMB', color: '#FFD166' },
  { id: '4', name: 'Hot Lead', color: '#FF9F1C' },
  { id: '5', name: 'Cold Lead', color: '#6B9BFF' },
  { id: '6', name: 'Partner', color: '#A177FF' },
  { id: '7', name: 'Technical', color: '#5D576B' },
  { id: '8', name: 'Consultant', color: '#8AC926' }
];

// Mock data for lead statuses
const leadStatuses = [
  { id: '1', name: 'new', label: 'New' },
  { id: '2', name: 'contacted', label: 'Contacted' },
  { id: '3', name: 'qualified', label: 'Qualified' },
  { id: '4', name: 'proposal', label: 'Proposal' },
  { id: '5', name: 'negotiation', label: 'Negotiation' },
  { id: '6', name: 'customer', label: 'Customer' },
  { id: '7', name: 'lost', label: 'Lost' }
];

// Mock data for lead sources
const leadSources = [
  { id: '1', name: 'Website' },
  { id: '2', name: 'Referral' },
  { id: '3', name: 'Google Ads' },
  { id: '4', name: 'LinkedIn' },
  { id: '5', name: 'Conference' },
  { id: '6', name: 'Trade Show' },
  { id: '7', name: 'Email Campaign' },
  { id: '8', name: 'Cold Call' }
];

export default function ContactsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;
  
  // Action handler functions
  const handleEditContact = (contact: any) => {
    // Navigate to edit contact page or open modal
    router.push(`/client/contacts/edit/${contact.id}`);
  };
  
  const handleSendEmail = (contact: any) => {
    // For now, open default email client
    window.open(`mailto:${contact.email}`, '_blank');
    toast({
      title: "Email Client Opened",
      description: `Sending email to ${contact.firstName} ${contact.lastName}`,
    });
  };
  
  const handleSendSMS = (contact: any) => {
    // Open SMS dialog or navigate to SMS page
    router.push(`/client/phone-sms/new?contactId=${contact.id}`);
  };
  
  const handleScheduleMeeting = (contact: any) => {
    // Navigate to appointments page with contact pre-selected
    router.push(`/client/appointments/new?contactId=${contact.id}`);
  };
  
  const handleDeleteContact = (contact: any) => {
    setContactToDelete(contact);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteContact = async () => {
    if (!contactToDelete) return;
    
    setIsLoading(true);
    try {
      await contactsApi.deleteContact(contactToDelete.id);
      toast({
        title: "Contact Deleted",
        description: `${contactToDelete.firstName} ${contactToDelete.lastName} has been deleted.`,
      });
      // Refresh contacts list (in a real app, this would fetch from API)
      const updatedContacts = contacts.filter(c => c.id !== contactToDelete.id);
      // Would need to update state here in a real implementation
      
      if (selectedContact === contactToDelete.id) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };
  
  const handleImportContacts = () => {
    // Navigate to import page
    router.push('/client/contacts/import');
  };
  
  const handleExportContacts = async () => {
    setIsLoading(true);
    try {
      const tagIds = tagFilter !== 'all' ? [tagFilter] : undefined;
      const response = await contactsApi.exportContacts(tagIds);
      
      // Create a download link for the CSV
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contacts.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Contacts Exported",
        description: "Your contacts have been exported to CSV.",
      });
    } catch (error) {
      console.error('Error exporting contacts:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter contacts based on search query and filters
  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || contact.type === typeFilter;
    const matchesTag = tagFilter === 'all' || contact.tags.includes(tagFilter);
    const matchesStatus = statusFilter === 'all' || contact.leadStatus === statusFilter;
    
    return matchesSearch && matchesType && matchesTag && matchesStatus;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Get the selected contact data
  const selectedContactData = contacts.find(contact => contact.id === selectedContact);
  
  // Get tag color
  const getTagColor = (tagName: string) => {
    const tag = tags.find(t => t.name === tagName);
    return tag ? tag.color : '#CBD5E0';
  };
  
  // Get lead status badge variant
  const getLeadStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Contacted</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Qualified</Badge>;
      case 'proposal':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Proposal</Badge>;
      case 'negotiation':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Negotiation</Badge>;
      case 'customer':
        return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">Customer</Badge>;
      case 'lost':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Lost</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportContacts}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => router.push('/client/contacts/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Contacts</CardTitle>
              <CardDescription>
                Manage your contacts and leads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-1 items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search contacts..."
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
                  <Button 
                    variant="outline" 
                    onClick={handleExportContacts}
                    disabled={isLoading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isLoading ? 'Exporting...' : 'Export'}
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <select
                  className="border rounded-md px-3 py-2 text-sm"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="lead">Leads</option>
                  <option value="customer">Customers</option>
                  <option value="partner">Partners</option>
                </select>
                
                <select
                  className="border rounded-md px-3 py-2 text-sm"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                >
                  <option value="all">All Tags</option>
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.name}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                
                <select
                  className="border rounded-md px-3 py-2 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {leadStatuses.map((status) => (
                    <option key={status.id} value={status.name}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden lg:table-cell">Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedContacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No contacts found matching your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedContacts.map((contact) => (
                        <TableRow 
                          key={contact.id}
                          className={selectedContact === contact.id ? 'bg-muted/50' : ''}
                          onClick={() => setSelectedContact(contact.id)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                              <p className="text-sm text-muted-foreground">{contact.jobTitle}</p>
                            </div>
                          </TableCell>
                          <TableCell>{contact.company}</TableCell>
                          <TableCell className="hidden md:table-cell">{contact.email}</TableCell>
                          <TableCell className="hidden lg:table-cell">{contact.phone}</TableCell>
                          <TableCell>{getLeadStatusBadge(contact.leadStatus)}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendEmail(contact)}>
                                  <Mail className="mr-2 h-4 w-4" /> Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendSMS(contact)}>
                                  <MessageSquare className="mr-2 h-4 w-4" /> Send SMS
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleScheduleMeeting(contact)}>
                                  <Calendar className="mr-2 h-4 w-4" /> Schedule Meeting
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteContact(contact)}
                                >
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
                    {Math.min(currentPage * itemsPerPage, filteredContacts.length)} of {filteredContacts.length}
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
        
        {/* Contact Details */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
              <CardDescription>
                View and manage contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedContactData ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-medium">
                      {selectedContactData.firstName[0]}{selectedContactData.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{selectedContactData.firstName} {selectedContactData.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{selectedContactData.jobTitle} at {selectedContactData.company}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedContactData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedContactData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedContactData.company}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedContactData.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          style={{ backgroundColor: `${getTagColor(tag)}20`, borderColor: getTagColor(tag), color: getTagColor(tag) }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Lead Information</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <span>{getLeadStatusBadge(selectedContactData.leadStatus)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Source</span>
                        <span>{selectedContactData.leadSource}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Assigned To</span>
                        <span>{selectedContactData.assignedTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Date Added</span>
                        <span>{selectedContactData.dateAdded}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-sm">{selectedContactData.notes}</p>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditContact(selectedContactData)}
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleSendEmail(selectedContactData)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => window.open(`tel:${selectedContactData.phone}`, '_blank')}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleSendSMS(selectedContactData)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleScheduleMeeting(selectedContactData)}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <User className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Contact Selected</h3>
                  <p>Select a contact from the list to view details.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {contactToDelete?.firstName} {contactToDelete?.lastName}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteContact}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 