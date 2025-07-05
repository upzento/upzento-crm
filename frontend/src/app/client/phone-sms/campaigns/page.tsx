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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare, 
  Send, 
  BarChart2, 
  Copy, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  PauseCircle, 
  PlayCircle,
  ChevronRight,
  FileText,
  Download
} from 'lucide-react';

// Mock data for campaigns
const campaigns = [
  {
    id: '1',
    name: 'Summer Sale Announcement',
    status: 'active',
    recipients: 245,
    delivered: 230,
    opened: 198,
    responded: 42,
    sentDate: '2023-06-15',
    sentTime: '10:00 AM',
    message: 'Summer sale starts today! Get 30% off all products with code SUMMER30. Shop now at example.com/sale',
    tags: ['marketing', 'sale']
  },
  {
    id: '2',
    name: 'Appointment Reminders',
    status: 'scheduled',
    recipients: 78,
    delivered: 0,
    opened: 0,
    responded: 0,
    sentDate: '2023-07-05',
    sentTime: '9:00 AM',
    message: 'Reminder: Your appointment is scheduled for tomorrow at {time}. Reply C to confirm or R to reschedule.',
    tags: ['appointment', 'reminder']
  },
  {
    id: '3',
    name: 'Customer Feedback Request',
    status: 'completed',
    recipients: 156,
    delivered: 152,
    opened: 120,
    responded: 68,
    sentDate: '2023-06-01',
    sentTime: '2:00 PM',
    message: 'We value your opinion! How was your recent experience with us? Reply with a number from 1-5 (5 being excellent).',
    tags: ['feedback', 'survey']
  },
  {
    id: '4',
    name: 'Product Launch Notification',
    status: 'draft',
    recipients: 0,
    delivered: 0,
    opened: 0,
    responded: 0,
    sentDate: '',
    sentTime: '',
    message: 'Exciting news! Our new product line is launching soon. Be the first to know when it\'s available.',
    tags: ['product', 'launch']
  },
  {
    id: '5',
    name: 'Holiday Promotion',
    status: 'paused',
    recipients: 312,
    delivered: 180,
    opened: 142,
    responded: 35,
    sentDate: '2023-05-20',
    sentTime: '11:00 AM',
    message: 'Celebrate with us! Get a special holiday discount of 25% off your next purchase with code HOLIDAY25.',
    tags: ['holiday', 'promotion']
  }
];

// Mock data for templates
const templates = [
  {
    id: '1',
    name: 'Appointment Reminder',
    message: 'Reminder: Your appointment is scheduled for {date} at {time}. Reply C to confirm or R to reschedule.',
    usage: 78
  },
  {
    id: '2',
    name: 'Order Confirmation',
    message: 'Thank you for your order #{order_number}! Your order has been confirmed and will be shipped within 2 business days.',
    usage: 156
  },
  {
    id: '3',
    name: 'Shipping Notification',
    message: 'Good news! Your order #{order_number} has been shipped and is on its way. Track it here: {tracking_link}',
    usage: 124
  },
  {
    id: '4',
    name: 'Feedback Request',
    message: 'We value your opinion! How was your recent experience with us? Reply with a number from 1-5 (5 being excellent).',
    usage: 68
  },
  {
    id: '5',
    name: 'Promotional Offer',
    message: 'Special offer just for you! Get {discount}% off your next purchase with code {code}. Valid until {expiry_date}.',
    usage: 245
  }
];

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  
  // Filter campaigns based on search query and status
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Filter templates based on search query
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.message.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get the selected campaign data
  const selectedCampaignData = campaigns.find(campaign => campaign.id === selectedCampaign);
  
  // Status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'scheduled':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'draft':
        return 'secondary';
      case 'paused':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="h-4 w-4 mr-1" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4 mr-1" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'draft':
        return <FileText className="h-4 w-4 mr-1" />;
      case 'paused':
        return <PauseCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">SMS Campaigns</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>
      
      <Tabs defaultValue="campaigns" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your SMS Campaigns</CardTitle>
              <CardDescription>
                Create and manage bulk SMS campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-1 items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Date Range</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button 
                  variant={statusFilter === 'all' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === 'active' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                >
                  <PlayCircle className="mr-1 h-3 w-3" />
                  Active
                </Button>
                <Button 
                  variant={statusFilter === 'scheduled' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter('scheduled')}
                >
                  <Calendar className="mr-1 h-3 w-3" />
                  Scheduled
                </Button>
                <Button 
                  variant={statusFilter === 'completed' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter('completed')}
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Completed
                </Button>
                <Button 
                  variant={statusFilter === 'draft' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter('draft')}
                >
                  <FileText className="mr-1 h-3 w-3" />
                  Draft
                </Button>
                <Button 
                  variant={statusFilter === 'paused' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter('paused')}
                >
                  <PauseCircle className="mr-1 h-3 w-3" />
                  Paused
                </Button>
              </div>
              
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Campaign Name</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left hidden md:table-cell">Recipients</th>
                      <th className="py-3 px-4 text-left hidden lg:table-cell">Sent Date</th>
                      <th className="py-3 px-4 text-left hidden lg:table-cell">Performance</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCampaigns.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-muted-foreground">
                          No campaigns found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredCampaigns.map((campaign) => (
                        <tr 
                          key={campaign.id} 
                          className={`border-b ${selectedCampaign === campaign.id ? 'bg-muted/50' : ''}`}
                          onClick={() => setSelectedCampaign(campaign.id)}
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{campaign.name}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {campaign.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getStatusVariant(campaign.status)} className="flex w-fit items-center">
                              {getStatusIcon(campaign.status)}
                              <span>{campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</span>
                            </Badge>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{campaign.recipients}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            {campaign.sentDate ? (
                              <div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{campaign.sentDate}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{campaign.sentTime}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Not sent</span>
                            )}
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            {campaign.status !== 'draft' && campaign.status !== 'scheduled' ? (
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col items-center">
                                  <span className="text-sm font-medium">{Math.round((campaign.delivered / campaign.recipients) * 100)}%</span>
                                  <span className="text-xs text-muted-foreground">Delivered</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-sm font-medium">{Math.round((campaign.responded / campaign.delivered) * 100)}%</span>
                                  <span className="text-xs text-muted-foreground">Responded</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No data</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {selectedCampaign && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedCampaignData?.name}</CardTitle>
                    <CardDescription>
                      Campaign details and performance
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    {selectedCampaignData?.status === 'active' && (
                      <Button variant="outline" size="sm">
                        <PauseCircle className="mr-2 h-3 w-3" />
                        Pause
                      </Button>
                    )}
                    {selectedCampaignData?.status === 'paused' && (
                      <Button variant="outline" size="sm">
                        <PlayCircle className="mr-2 h-3 w-3" />
                        Resume
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Recipients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedCampaignData?.recipients}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Delivered
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-2">
                        <div className="text-2xl font-bold">{selectedCampaignData?.delivered}</div>
                        {selectedCampaignData?.recipients > 0 && (
                          <div className="text-sm text-muted-foreground">
                            ({Math.round((selectedCampaignData.delivered / selectedCampaignData.recipients) * 100)}%)
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Responses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-2">
                        <div className="text-2xl font-bold">{selectedCampaignData?.responded}</div>
                        {selectedCampaignData?.delivered > 0 && (
                          <div className="text-sm text-muted-foreground">
                            ({Math.round((selectedCampaignData.responded / selectedCampaignData.delivered) * 100)}%)
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Campaign Message</h3>
                  <div className="p-4 border rounded-md">
                    <p>{selectedCampaignData?.message}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Performance</h3>
                  <div className="h-[200px] border-2 border-dashed rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Campaign performance chart will be displayed here</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Responses</h3>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-3 w-3" />
                      Export
                    </Button>
                  </div>
                  <div className="border rounded-md p-6 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Select a campaign to view responses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Message Templates</CardTitle>
                  <CardDescription>
                    Create and manage reusable message templates
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.length === 0 ? (
                  <div className="col-span-full py-6 text-center text-muted-foreground">
                    No templates found matching your search.
                  </div>
                ) : (
                  filteredTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{template.name}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span>Used {template.usage} times</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{template.message}</p>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Copy className="mr-2 h-3 w-3" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Send className="mr-2 h-3 w-3" />
                            Use
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMS Campaign Analytics</CardTitle>
              <CardDescription>
                Performance metrics for your SMS campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Sent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,245</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Delivery Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98.2%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Response Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24.5%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avg. Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.2m</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Campaign Performance</h3>
                <div className="h-[300px] border-2 border-dashed rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Campaign performance chart will be displayed here</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Top Performing Campaigns</h3>
                  <div className="space-y-2">
                    {campaigns
                      .filter(c => c.status === 'completed' || c.status === 'active')
                      .sort((a, b) => (b.responded / b.delivered) - (a.responded / a.delivered))
                      .slice(0, 3)
                      .map((campaign, index) => (
                        <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            <p className="text-sm text-muted-foreground">{campaign.sentDate}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">{Math.round((campaign.responded / campaign.delivered) * 100)}%</span>
                            <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Response Time Distribution</h3>
                  <div className="h-[200px] border-2 border-dashed rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Response time chart will be displayed here</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 