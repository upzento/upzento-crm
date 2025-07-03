'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { agenciesApi } from '@/lib/api/api-client';
import { Search, Plus } from 'lucide-react';

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoading(true);
        const response = await agenciesApi.getAgencies();
        setAgencies(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch agencies:', err);
        setError('Failed to load agencies. Please try again later.');
        setAgencies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  // Filter agencies based on search query
  const filteredAgencies = agencies.filter(agency => 
    agency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Agency Management</h1>
        <Button variant="cosmic">
          <Plus className="mr-2 h-4 w-4" /> Add Agency
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Agencies</h2>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search agencies..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-text-secondary">Loading agencies...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-error">
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : filteredAgencies.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <p>No agencies found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Clients</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Created</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgencies.map((agency) => (
                    <tr key={agency.id} className="border-b">
                      <td className="p-4 font-medium">{agency.name}</td>
                      <td className="p-4">{agency.clients?.length || 0}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-success/20 text-success">
                          Active
                        </span>
                      </td>
                      <td className="p-4">{new Date(agency.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="text-primary">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-error">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 