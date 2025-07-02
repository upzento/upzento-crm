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
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CreditCard,
  Settings,
  FileText,
  MessageSquare
} from 'lucide-react';

// Mock data for clients
const clients = [
  {
    id: '1',
    name: 'Acme Corporation',
    contact: 'Jane Cooper',
    email: 'jane@acme.com',
    phone: '(555) 123-4567',
    status: 'active',
    plan: 'Premium',
    created: '2023-04-15'
  },
  {
    id: '2',
    name: 'Globex Industries',
    contact: 'Robert Johnson',
    email: 'robert@globex.com',
    phone: '(555) 234-5678',
    status: 'active',
    plan: 'Standard',
    created: '2023-05-22'
  },
  {
    id: '3',
    name: 'Soylent Corp',
    contact: 'Lisa Williams',
    email: 'lisa@soylent.com',
    phone: '(555) 345-6789',
    status: 'inactive',
    plan: 'Premium',
    created: '2023-03-10'
  },
  {
    id: '4',
    name: 'Initech Software',
    contact: 'Michael Bolton',
    email: 'michael@initech.com',
    phone: '(555) 456-7890',
    status: 'active',
    plan: 'Enterprise',
    created: '2023-06-05'
  },
  {
    id: '5',
    name: 'Umbrella Corp',
    contact: 'Alice Smith',
    email: 'alice@umbrella.com',
    phone: '(555) 567-8901',
    status: 'active',
    plan: 'Standard',
    created: '2023-07-18'
  }
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter clients based on search query and status filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Clients</CardTitle>
          <CardDescription>
            Manage your agency's clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="border rounded-md px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.contact}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        client.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell>{client.plan}</TableCell>
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
                            <Eye className="mr-2 h-4 w-4" /> View Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> Manage Forms
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" /> Chat History
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" /> Billing
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" /> Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Client
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
    </div>
  );
} 