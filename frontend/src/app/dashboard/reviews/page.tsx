'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Star, 
  MessageSquare, 
  MoreVertical, 
  Flag, 
  ThumbsUp, 
  ThumbsDown, 
  ExternalLink, 
  Download,
  BarChart3,
  Calendar,
  Edit
} from 'lucide-react';

// Sample data for reviews
const reviews = [
  {
    id: '1',
    customer: 'John Smith',
    rating: 5,
    text: 'Excellent service! The team was professional and responsive. Would definitely recommend to others.',
    date: '2023-06-25',
    source: 'Google',
    status: 'published',
    response: 'Thank you for your kind words, John! We appreciate your business.'
  },
  {
    id: '2',
    customer: 'Sarah Johnson',
    rating: 4,
    text: 'Great experience overall. The product works as expected and customer service was helpful.',
    date: '2023-06-22',
    source: 'Facebook',
    status: 'published',
    response: ''
  },
  {
    id: '3',
    customer: 'Michael Brown',
    rating: 2,
    text: 'The product is okay, but I had some issues with delivery. It took longer than expected.',
    date: '2023-06-20',
    source: 'Yelp',
    status: 'published',
    response: 'We apologize for the delay, Michael. We\'ve been working to improve our delivery process.'
  },
  {
    id: '4',
    customer: 'Emily Davis',
    rating: 5,
    text: 'Absolutely love the service! The team went above and beyond to help me with my request.',
    date: '2023-06-18',
    source: 'Google',
    status: 'published',
    response: 'Thank you, Emily! We\'re so glad to hear about your positive experience.'
  },
  {
    id: '5',
    customer: 'Robert Wilson',
    rating: 1,
    text: 'Disappointed with the quality. Not what I expected based on the description.',
    date: '2023-06-15',
    source: 'Trustpilot',
    status: 'flagged',
    response: ''
  },
  {
    id: '6',
    customer: 'Jennifer Lee',
    rating: 4,
    text: 'Very satisfied with my purchase. Would buy from this company again.',
    date: '2023-06-12',
    source: 'Facebook',
    status: 'published',
    response: 'We appreciate your business, Jennifer! Looking forward to serving you again.'
  },
  {
    id: '7',
    customer: 'David Miller',
    rating: 3,
    text: 'Average experience. Nothing special but no major issues either.',
    date: '2023-06-10',
    source: 'Google',
    status: 'published',
    response: ''
  }
];

// Sample analytics data
const analyticsData = {
  averageRating: 3.4,
  totalReviews: 124,
  ratingDistribution: [
    { rating: 5, count: 45, percentage: 36 },
    { rating: 4, count: 32, percentage: 26 },
    { rating: 3, count: 18, percentage: 15 },
    { rating: 2, count: 15, percentage: 12 },
    { rating: 1, count: 14, percentage: 11 }
  ],
  sources: [
    { name: 'Google', count: 68 },
    { name: 'Facebook', count: 32 },
    { name: 'Yelp', count: 15 },
    { name: 'Trustpilot', count: 9 }
  ]
};

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterSource, setFilterSource] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  
  // Filter reviews based on search query and filters
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating === null || review.rating === filterRating;
    const matchesSource = filterSource === null || review.source === filterSource;
    
    return matchesSearch && matchesRating && matchesSource;
  });
  
  // Get the selected review data
  const selectedReviewData = reviews.find(review => review.id === selectedReview);
  
  // Render stars for rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Customer Reviews</h1>
        <Button>
          <ExternalLink className="mr-2 h-4 w-4" />
          Review Widget
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Customer Reviews</CardTitle>
              <CardDescription>
                Manage and respond to customer reviews across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button 
                  variant={filterRating === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterRating(null)}
                >
                  All Ratings
                </Button>
                {[5, 4, 3, 2, 1].map(rating => (
                  <Button 
                    key={rating}
                    variant={filterRating === rating ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilterRating(rating)}
                    className="flex items-center gap-1"
                  >
                    {rating}
                    <Star className={`h-3 w-3 ${filterRating === rating ? 'text-white' : 'text-yellow-400 fill-yellow-400'}`} />
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button 
                  variant={filterSource === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterSource(null)}
                >
                  All Sources
                </Button>
                {['Google', 'Facebook', 'Yelp', 'Trustpilot'].map(source => (
                  <Button 
                    key={source}
                    variant={filterSource === source ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilterSource(source)}
                  >
                    {source}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No reviews found matching your criteria.
                  </div>
                ) : (
                  filteredReviews.map((review) => (
                    <Card 
                      key={review.id} 
                      className={`cursor-pointer ${selectedReview === review.id ? 'border-primary' : ''}`}
                      onClick={() => setSelectedReview(review.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{review.customer}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={review.status === 'flagged' ? 'destructive' : 'outline'}>
                              {review.status}
                            </Badge>
                            <Badge variant="outline">{review.source}</Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm">{review.text}</p>
                        {review.response && (
                          <div className="mt-3 pl-4 border-l-2 border-muted">
                            <p className="text-sm font-medium">Your response:</p>
                            <p className="text-sm text-muted-foreground">{review.response}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Flag className="h-3 w-3 mr-1" />
                            Flag
                          </Button>
                        </div>
                        <Button variant="outline" size="sm" className="h-7">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {review.response ? 'Edit Response' : 'Respond'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Published Reviews</CardTitle>
              <CardDescription>
                Reviews that are publicly visible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews
                  .filter(review => review.status === 'published')
                  .map((review) => (
                    <Card 
                      key={review.id} 
                      className="cursor-pointer"
                      onClick={() => setSelectedReview(review.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{review.customer}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{review.source}</Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm">{review.text}</p>
                        {review.response && (
                          <div className="mt-3 pl-4 border-l-2 border-muted">
                            <p className="text-sm font-medium">Your response:</p>
                            <p className="text-sm text-muted-foreground">{review.response}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Flag className="h-3 w-3 mr-1" />
                            Flag
                          </Button>
                        </div>
                        <Button variant="outline" size="sm" className="h-7">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {review.response ? 'Edit Response' : 'Respond'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="flagged" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Reviews</CardTitle>
              <CardDescription>
                Reviews that require attention or moderation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews
                  .filter(review => review.status === 'flagged')
                  .map((review) => (
                    <Card 
                      key={review.id} 
                      className="cursor-pointer border-destructive/50"
                      onClick={() => setSelectedReview(review.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{review.customer}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">Flagged</Badge>
                            <Badge variant="outline">{review.source}</Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm">{review.text}</p>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-7">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="h-7">
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                        <Button variant="outline" size="sm" className="h-7">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Respond
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                
                {reviews.filter(review => review.status === 'flagged').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No flagged reviews at the moment.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{analyticsData.averageRating}</div>
                  <div className="flex">
                    {renderStars(Math.round(analyticsData.averageRating))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalReviews}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Response Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2 days</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>
                  Breakdown of ratings by star level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.ratingDistribution.map((item) => (
                    <div key={item.rating} className="flex items-center gap-2">
                      <div className="w-12 flex items-center">
                        <span className="font-medium">{item.rating}</span>
                        <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm text-muted-foreground">
                        {item.count} ({item.percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Reviews by Source</CardTitle>
                <CardDescription>
                  Distribution of reviews across platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.sources.map((source) => (
                    <div key={source.name} className="flex items-center justify-between">
                      <div className="font-medium">{source.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-primary rounded-full" style={{ width: `${(source.count / analyticsData.totalReviews) * 100}px` }} />
                        <div className="text-sm text-muted-foreground">
                          {source.count} reviews
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Review Trends</CardTitle>
                  <CardDescription>
                    Review volume and ratings over time
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last 30 Days
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
                <div className="text-center space-y-2">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Review trend chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedReview && selectedReviewData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Review Details</CardTitle>
                <CardDescription>
                  View and manage the selected review
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedReview(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Review Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer</p>
                    <p>{selectedReviewData.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(selectedReviewData.rating)}
                      </div>
                      <span>{selectedReviewData.rating}/5</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                    <p>{selectedReviewData.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Source</p>
                    <p>{selectedReviewData.source}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={selectedReviewData.status === 'flagged' ? 'destructive' : 'outline'}>
                      {selectedReviewData.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Review Content</h3>
                <div className="p-4 border rounded-md">
                  <p>{selectedReviewData.text}</p>
                </div>
                
                <h3 className="text-lg font-medium mt-4 mb-2">Response</h3>
                {selectedReviewData.response ? (
                  <div className="p-4 border rounded-md">
                    <p>{selectedReviewData.response}</p>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit Response
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea 
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                      placeholder="Write your response here..."
                    />
                    <div className="flex justify-end">
                      <Button size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Submit Response
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline">
                  <Flag className="h-4 w-4 mr-2" />
                  {selectedReviewData.status === 'flagged' ? 'Unflag' : 'Flag'}
                </Button>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on {selectedReviewData.source}
                </Button>
              </div>
              
              {selectedReviewData.status === 'flagged' && (
                <div className="flex gap-2">
                  <Button variant="destructive">
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="default">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 