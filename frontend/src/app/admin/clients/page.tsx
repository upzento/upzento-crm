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
  Building2
} from 'lucide-react';

// Mock data for clients
const clients = [
  {
    id: '1',
    name: 'Acme Corporation',
    agency: 'Digital Marketing Pros',
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
    agency: 'WebGrowth Agency',
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
    agency: 'LeadGen Solutions',
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
    agency: 'Digital Marketing Pros',
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
    agency: 'Social Media Masters',
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
  const [agencyFilter, setAgencyFilter] = useState('all');
  
  // Filter clients based on search query and agency filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAgency = agencyFilter === 'all' || client.agency === agencyFilter;
    
    return matchesSearch && matchesAgency;
  });
  
  // Get unique agencies for filter dropdown
  const agencies = ['all', ...new Set(clients.map(client => client.agency))];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
        <Button variant="cosmic">
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>
      
      <Card gradient>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>
            Manage all clients across agencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-secondary" />
                <Input
                  placeholder="Search clients..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="border rounded-md px-3 py-2 bg-surface text-text-primary border-input"
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
              >
                {agencies.map((agency) => (
                  <option key={agency} value={agency}>
                    {agency === 'all' ? 'All Agencies' : agency}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Agency</TableHead>
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
                    <TableCell>
                      <div className="flex items-center">
                        <Building2 className="mr-2 h-4 w-4 text-text-secondary" />
                        {client.agency}
                      </div>
                    </TableCell>
                    <TableCell>{client.contact}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        client.status === 'active' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-error/20 text-error'
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
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Building2 className="mr-2 h-4 w-4" /> Change Agency
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-error">
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