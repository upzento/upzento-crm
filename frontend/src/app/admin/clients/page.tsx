'use client';

import { useState, useEffect } from 'react';
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
import { clientsApi, agenciesApi } from '@/lib/api/api-client';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('all');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch clients and agencies in parallel
        const [clientsResponse, agenciesResponse] = await Promise.all([
          clientsApi.getClients(),
          agenciesApi.getAgencies()
        ]);
        
        setClients(clientsResponse.data);
        setAgencies(agenciesResponse.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please try again later.');
        setClients([]);
        setAgencies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Filter clients based on search query and agency filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAgency = agencyFilter === 'all' || client.agencyId === agencyFilter;
    
    return matchesSearch && matchesAgency;
  });
  
  // Get unique agencies for filter dropdown
  const agencyOptions = [
    { id: 'all', name: 'All Agencies' },
    ...agencies
  ];
  
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
                {agencyOptions.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-text-secondary">Loading clients...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-error">
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <p>No clients found.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => {
                    const agency = agencies.find(a => a.id === client.agencyId) || { name: 'Unknown Agency' };
                    
                    return (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building2 className="mr-2 h-4 w-4 text-text-secondary" />
                            {agency.name}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(client.createdAt).toLocaleDateString()}</TableCell>
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 