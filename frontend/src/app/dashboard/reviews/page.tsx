'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Star,
  Filter,
  Plus,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
} from 'lucide-react';

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for demonstration
  const reviews = [
    {
      id: '1',
      rating: 5,
      title: 'Excellent Service',
      content: 'The team was very professional and delivered beyond our expectations.',
      authorName: 'John Smith',
      source: 'DIRECT',
      status: 'APPROVED',
      createdAt: '2023-06-15T10:30:00Z',
      responseContent: 'Thank you for your kind words!',
      service: 'Web Design',
      location: 'Main Office',
    },
    {
      id: '2',
      rating: 4,
      title: 'Good Experience',
      content: 'Overall a good experience, but there were some delays in communication.',
      authorName: 'Jane Doe',
      source: 'GOOGLE',
      status: 'PENDING',
      createdAt: '2023-06-10T14:20:00Z',
      responseContent: null,
      service: 'SEO Services',
      location: 'Main Office',
    },
    {
      id: '3',
      rating: 2,
      title: 'Disappointing Results',
      content: 'The results were not what we expected based on the initial promises.',
      authorName: 'Mike Johnson',
      source: 'FACEBOOK',
      status: 'REJECTED',
      createdAt: '2023-05-22T09:15:00Z',
      responseContent: null,
      service: 'Social Media Management',
      location: 'Downtown Branch',
    },
  ];

  // Filter reviews based on active tab
  const filteredReviews = reviews.filter(review => {
    if (activeTab === 'all') return true;
    return review.status.toLowerCase() === activeTab;
  });

  // Helper function to render stars based on rating
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ));
  };

  // Helper function to get badge variant based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">
            Manage and respond to customer reviews
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Widgets
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Review
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reviews..."
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TabsContent value={activeTab} className="mt-0">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>
              {activeTab === 'all'
                ? 'All Reviews'
                : activeTab === 'pending'
                ? 'Pending Reviews'
                : activeTab === 'approved'
                ? 'Approved Reviews'
                : 'Rejected Reviews'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'all'
                ? 'Manage all customer reviews'
                : activeTab === 'pending'
                ? 'Reviews waiting for moderation'
                : activeTab === 'approved'
                ? 'Reviews approved and visible to customers'
                : 'Reviews that have been rejected'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReviews.length > 0 ? (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm font-medium">{review.title}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          By {review.authorName} • {formatDate(review.createdAt)} • 
                          <Badge variant="outline" className="ml-2 text-xs">
                            {review.source}
                          </Badge>
                          {review.service && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {review.service}
                            </Badge>
                          )}
                          {review.location && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {review.location}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{review.content}</p>
                        {review.responseContent && (
                          <div className="mt-2 pl-4 border-l-2 border-primary/20">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Response:</span> {review.responseContent}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(review.status)}
                        <div className="flex gap-1 mt-2">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Respond
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No reviews found</h3>
                <p className="text-muted-foreground mt-1">
                  {activeTab === 'all'
                    ? "You don't have any reviews yet"
                    : activeTab === 'pending'
                    ? 'No reviews waiting for moderation'
                    : activeTab === 'approved'
                    ? 'No approved reviews'
                    : 'No rejected reviews'}
                </p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Review
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
} 