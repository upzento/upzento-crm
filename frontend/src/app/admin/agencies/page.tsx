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
  UserPlus 
} from 'lucide-react';

// Mock data for agencies
const agencies = [
  {
    id: '1',
    name: 'Digital Marketing Pros',
    owner: 'John Smith',
    email: 'john@dmpros.com',
    clients: 24,
    status: 'active',
    plan: 'Enterprise',
    created: '2023-05-12'
  },
  {
    id: '2',
    name: 'WebGrowth Agency',
    owner: 'Sarah Johnson',
    email: 'sarah@webgrowth.com',
    clients: 18,
    status: 'active',
    plan: 'Professional',
    created: '2023-06-23'
  },
  {
    id: '3',
    name: 'LeadGen Solutions',
    owner: 'Michael Brown',
    email: 'michael@leadgen.com',
    clients: 32,
    status: 'active',
    plan: 'Enterprise',
    created: '2023-04-08'
  },
  {
    id: '4',
    name: 'Social Media Masters',
    owner: 'Emily Davis',
    email: 'emily@socialmm.com',
    clients: 15,
    status: 'active',
    plan: 'Professional',
    created: '2023-07-14'
  },
  {
    id: '5',
    name: 'Growth Hackers',
    owner: 'David Wilson',
    email: 'david@growthhackers.com',
    clients: 9,
    status: 'inactive',
    plan: 'Starter',
    created: '2023-08-02'
  }
];

export default function AgenciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter agencies based on search query
  const filteredAgencies = agencies.filter(agency => 
    agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Agency Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Agency
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Agencies</CardTitle>
          <CardDescription>
            Manage all agencies on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agencies..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Clients</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell className="font-medium">{agency.name}</TableCell>
                    <TableCell>{agency.owner}</TableCell>
                    <TableCell>{agency.clients}</TableCell>
                    <TableCell>{agency.plan}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        agency.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {agency.status}
                      </span>
                    </TableCell>
                    <TableCell>{agency.created}</TableCell>
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
                            <Edit className="mr-2 h-4 w-4" /> Edit Agency
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="mr-2 h-4 w-4" /> Manage Users
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Agency
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