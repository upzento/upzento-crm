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
  ShieldCheck,
  Mail,
  Key,
  UserCog
} from 'lucide-react';

// Mock data for team members
const teamMembers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@agency.com',
    role: 'Admin',
    status: 'active',
    lastActive: '2 hours ago',
    joined: '2022-03-15'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@agency.com',
    role: 'Manager',
    status: 'active',
    lastActive: '5 minutes ago',
    joined: '2022-04-22'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@agency.com',
    role: 'Support',
    status: 'active',
    lastActive: '1 day ago',
    joined: '2022-06-10'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@agency.com',
    role: 'Marketing',
    status: 'inactive',
    lastActive: '2 weeks ago',
    joined: '2022-08-05'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@agency.com',
    role: 'Sales',
    status: 'active',
    lastActive: '3 hours ago',
    joined: '2023-01-18'
  }
];

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Filter team members based on search query and role filter
  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // Get unique roles for filter dropdown
  const roles = ['all', ...new Set(teamMembers.map(member => member.role))];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Invite Team Member
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Team</CardTitle>
          <CardDescription>
            Manage your agency team members and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="border rounded-md px-3 py-2"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === 'all' ? 'All Roles' : role}
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
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {member.role === 'Admin' ? (
                          <ShieldCheck className="mr-2 h-4 w-4 text-blue-600" />
                        ) : null}
                        {member.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        member.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {member.status}
                      </span>
                    </TableCell>
                    <TableCell>{member.lastActive}</TableCell>
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
                            <Eye className="mr-2 h-4 w-4" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Member
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCog className="mr-2 h-4 w-4" /> Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="mr-2 h-4 w-4" /> Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" /> Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Remove Member
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