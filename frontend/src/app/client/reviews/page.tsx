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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
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
  Star, 
  Search, 
  MoreHorizontal, 
  MessageSquare, 
  ExternalLink, 
  Filter, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

// Mock data for reviews
const reviews = [
  {
    id: '1',
    customer: 'John Smith',
    email: 'john@example.com',
    rating: 5,
    title: 'Excellent service!',
    content: 'The team was very professional and delivered beyond my expectations. Would highly recommend!',
    source: 'Direct',
    date: '2023-07-01',
    status: 'published',
    response: ''
  },
  {
    id: '2',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    rating: 4,
    title: 'Great experience overall',
    content: 'Very satisfied with the service. The only minor issue was the delivery time, but everything else was perfect.',
    source: 'Google',
    date: '2023-06-28',
    status: 'published',
    response: 'Thank you for your feedback, Sarah! We appreciate your understanding regarding the delivery time and are working to improve it.'
  },
  {
    id: '3',
    customer: 'Michael Brown',
    email: 'michael@example.com',
    rating: 2,
    title: 'Disappointed with service',
    content: 'The product was good but the customer service was lacking. Had to follow up multiple times for a simple query.',
    source: 'Facebook',
    date: '2023-06-25',
    status: 'pending',
    response: ''
  },
  {
    id: '4',
    customer: 'Emily Davis',
    email: 'emily@example.com',
    rating: 5,
    title: 'Absolutely amazing!',
    content: 'Best service I\'ve ever received. The team went above and beyond to ensure everything was perfect.',
    source: 'Direct',
    date: '2023-06-22',
    status: 'published',
    response: 'Thank you so much for your kind words, Emily! We\'re thrilled to hear about your positive experience.'
  },
  {
    id: '5',
    customer: 'David Wilson',
    email: 'david@example.com',
    rating: 3,
    title: 'Average experience',
    content: 'The service was okay, nothing special. Expected more based on the reviews I had read.',
    source: 'Google',
    date: '2023-06-20',
    status: 'pending',
    response: ''
  },
  {
    id: '6',
    customer: 'Lisa Roberts',
    email: 'lisa@example.com',
    rating: 1,
    title: 'Very disappointed',
    content: 'Poor service and communication. Would not recommend.',
    source: 'Facebook',
    date: '2023-06-18',
    status: 'hidden',
    response: ''
  },
  {
    id: '7',
    customer: 'Robert Taylor',
    email: 'robert@example.com',
    rating: 5,
    title: 'Exceptional quality',
    content: 'The product quality exceeded my expectations. Will definitely be a returning customer!',
    source: 'Direct',
    date: '2023-06-15',
    status: 'published',
    response: 'Thank you for your wonderful review, Robert! We look forward to serving you again.'
  }
];

// Mock data for widgets
const widgets = [
  {
    id: '1',
    name: 'Main Website Reviews',
    type: 'Slider',
    embedCount: 1,
    views: 1245,
    created: '2023-05-10',
    status: 'active'
  },
  {
    id: '2',
    name: 'Product Page Reviews',
    type: 'Grid',
    embedCount: 3,
    views: 876,
    created: '2023-05-15',
    status: 'active'
  },
  {
    id: '3',
    name: 'Testimonials Widget',
    type: 'Carousel',
    embedCount: 2,
    views: 543,
    created: '2023-05-20',
    status: 'inactive'
  }
];

// Mock data for statistics
const stats = {
  totalReviews: reviews.length,
  averageRating: (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1),
  publishedReviews: reviews.filter(review => review.status === 'published').length,
  pendingReviews: reviews.filter(review => review.status === 'pending').length,
  responseRate: `${Math.round((reviews.filter(review => review.response).length / reviews.length) * 100)}%`
};

// Rating component
const Rating = ({ value }: { value: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  
  // Filter reviews based on search query, source, and rating
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSource = sourceFilter === 'all' || review.source === sourceFilter;
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'published' && review.status === 'published') ||
      (activeTab === 'pending' && review.status === 'pending') ||
      (activeTab === 'hidden' && review.status === 'hidden');
    
    return matchesSearch && matchesSource && matchesRating && matchesTab;
  });
  
  // Get unique sources for filter dropdown
  const sources = ['all', ...new Set(reviews.map(review => review.source))];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <Button>Create Review Form</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-2">{stats.averageRating}</div>
              <Rating value={parseFloat(stats.averageRating)} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="widgets">Review Widgets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Reviews</CardTitle>
              <CardDescription>
                View, respond to, and manage your customer reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-1 items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reviews..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filter Reviews</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <label className="text-sm font-medium">Source</label>
                        <select
                          className="w-full mt-1 border rounded-md px-3 py-2"
                          value={sourceFilter}
                          onChange={(e) => setSourceFilter(e.target.value)}
                        >
                          {sources.map((source) => (
                            <option key={source} value={source}>
                              {source === 'all' ? 'All Sources' : source}
                            </option>
                          ))}
                        </select>
                      </div>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <label className="text-sm font-medium">Rating</label>
                        <select
                          className="w-full mt-1 border rounded-md px-3 py-2"
                          value={ratingFilter}
                          onChange={(e) => setRatingFilter(e.target.value)}
                        >
                          <option value="all">All Ratings</option>
                          <option value="5">5 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="2">2 Stars</option>
                          <option value="1">1 Star</option>
                        </select>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="hidden">Hidden</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reviews found matching your filters.</p>
                  </div>
                ) : (
                  filteredReviews.map((review) => (
                    <Card key={review.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{review.customer}</h3>
                              <span className="text-xs text-muted-foreground">
                                {review.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Rating value={review.rating} />
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {review.source}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                review.status === 'published' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                  : review.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                              </span>
                            </div>
                          </div>
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
                              {review.status !== 'published' && (
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" /> Publish
                                </DropdownMenuItem>
                              )}
                              {review.status !== 'hidden' && (
                                <DropdownMenuItem>
                                  <AlertCircle className="mr-2 h-4 w-4" /> Hide
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" /> Respond
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium">{review.title}</h4>
                          <p className="mt-1 text-sm">{review.content}</p>
                        </div>
                        
                        {review.response && (
                          <div className="mt-4 bg-muted/50 p-3 rounded-md">
                            <p className="text-xs font-medium mb-1">Your Response:</p>
                            <p className="text-sm">{review.response}</p>
                          </div>
                        )}
                        
                        {!review.response && review.status !== 'hidden' && (
                          <Button variant="outline" size="sm" className="mt-4">
                            <MessageSquare className="mr-2 h-3 w-3" />
                            Write a Response
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="widgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Widgets</CardTitle>
              <CardDescription>
                Create and manage widgets to display your reviews on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Your Widgets</h3>
                <Button>Create New Widget</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {widgets.map((widget) => (
                  <Card key={widget.id}>
                    <CardHeader>
                      <CardTitle>{widget.name}</CardTitle>
                      <CardDescription>{widget.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Embeds:</span>
                          <span>{widget.embedCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Views:</span>
                          <span>{widget.views}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Created:</span>
                          <span>{widget.created}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          <span className={`${
                            widget.status === 'active' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {widget.status.charAt(0).toUpperCase() + widget.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="mr-2 h-3 w-3" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Embed
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Analytics</CardTitle>
              <CardDescription>
                Track and analyze your review performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[300px] border-2 border-dashed rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Rating trend chart will be displayed here</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rating Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => r.rating === rating).length;
                        const percentage = Math.round((count / reviews.length) * 100);
                        
                        return (
                          <div key={rating} className="flex items-center gap-2">
                            <div className="flex items-center w-12">
                              <span>{rating}</span>
                              <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="w-12 text-right text-sm text-muted-foreground">
                              {percentage}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Review Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] border-2 border-dashed rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Source distribution chart will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Review Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-4 border rounded-md">
                      <ThumbsUp className="h-8 w-8 text-green-500 mb-2" />
                      <h3 className="text-lg font-semibold">65%</h3>
                      <p className="text-sm text-muted-foreground">Positive</p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-md">
                      <Clock className="h-8 w-8 text-yellow-500 mb-2" />
                      <h3 className="text-lg font-semibold">20%</h3>
                      <p className="text-sm text-muted-foreground">Neutral</p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-md">
                      <ThumbsDown className="h-8 w-8 text-red-500 mb-2" />
                      <h3 className="text-lg font-semibold">15%</h3>
                      <p className="text-sm text-muted-foreground">Negative</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 