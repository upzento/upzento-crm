'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Copy, 
  Edit, 
  Eye, 
  Globe, 
  Layout, 
  Plus, 
  Settings, 
  Star, 
  Trash2 
} from 'lucide-react';

export default function ReviewWidgetsPage() {
  // Mock data for demonstration
  const widgets = [
    {
      id: '1',
      name: 'Homepage Testimonials',
      displayType: 'CAROUSEL',
      theme: { primaryColor: '#3498db', backgroundColor: '#ffffff' },
      allowedDomains: ['example.com', '*.example.org'],
      showRating: true,
      showDate: true,
      maxReviews: 5,
      createdAt: '2023-06-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Product Reviews',
      displayType: 'GRID',
      theme: { primaryColor: '#e74c3c', backgroundColor: '#f9f9f9' },
      allowedDomains: ['shop.example.com'],
      showRating: true,
      showDate: false,
      maxReviews: 10,
      createdAt: '2023-05-22T09:15:00Z',
    },
    {
      id: '3',
      name: 'Sidebar Reviews',
      displayType: 'LIST',
      theme: { primaryColor: '#2ecc71', backgroundColor: '#ffffff' },
      allowedDomains: ['blog.example.com', 'www.example.com'],
      showRating: true,
      showDate: true,
      maxReviews: 3,
      createdAt: '2023-04-10T14:20:00Z',
    },
  ];

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper function to get display type badge
  const getDisplayTypeBadge = (type) => {
    switch (type) {
      case 'CAROUSEL':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Layout className="h-3 w-3" />
            Carousel
          </Badge>
        );
      case 'GRID':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Layout className="h-3 w-3" />
            Grid
          </Badge>
        );
      case 'LIST':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Layout className="h-3 w-3" />
            List
          </Badge>
        );
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Widgets</h1>
          <p className="text-muted-foreground">
            Create and manage embeddable review widgets
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Widget
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Widgets</CardTitle>
          <CardDescription>
            Manage your review widgets for embedding on websites
          </CardDescription>
        </CardHeader>
        <CardContent>
          {widgets.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Domains</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {widgets.map((widget) => (
                  <TableRow key={widget.id}>
                    <TableCell className="font-medium">{widget.name}</TableCell>
                    <TableCell>{getDisplayTypeBadge(widget.displayType)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {widget.allowedDomains.map((domain, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {domain}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(widget.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Get Embed Code">
                          <Code className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <Star className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No widgets found</h3>
              <p className="text-muted-foreground mt-1">
                Create a widget to display reviews on your website
              </p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Widget
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Embed Example</CardTitle>
          <CardDescription>
            How to embed review widgets on your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">JavaScript Embed Code</h3>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
              {`<script src="https://upzento.com/widgets/reviews/${widgets[0]?.id || 'widget-id'}" async></script>
<div id="upzento-reviews" data-widget-id="${widgets[0]?.id || 'widget-id'}"></div>`}
            </pre>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">iFrame Embed Code</h3>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
              {`<iframe 
  src="https://upzento.com/embed/reviews/${widgets[0]?.id || 'widget-id'}" 
  width="100%" 
  height="400" 
  frameborder="0"
></iframe>`}
            </pre>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Domain Verification</h3>
              <Button variant="outline" size="sm" className="h-8">
                Verify Domain
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              To ensure security, widgets will only work on domains you've authorized. Add your domains in the widget settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 