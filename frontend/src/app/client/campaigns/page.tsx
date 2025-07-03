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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Plus,
  MoreHorizontal,
  Filter,
  Mail,
  MessageSquare,
  BarChart3,
  Calendar,
  Clock,
  Users,
  Copy,
  Trash2,
  Edit,
  Eye,
  Pause,
  Play,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  LineChart,
  Activity
} from 'lucide-react';

// Mock data for campaigns
const emailCampaigns = [
  {
    id: '1',
    name: 'Summer Sale Announcement',
    type: 'email',
    status: 'active',
    sentCount: 1250,
    openRate: 32.4,
    clickRate: 8.7,
    schedule: 'Sent on Jun 15, 2023',
    lastModified: '2023-06-14',
    segment: 'All Customers',
    author: 'Alex Johnson'
  },
  {
    id: '2',
    name: 'Product Launch Follow-up',
    type: 'email',
    status: 'draft',
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    schedule: 'Not scheduled',
    lastModified: '2023-06-20',
    segment: 'Product Interest',
    author: 'Maria Garcia'
  },
  {
    id: '3',
    name: 'Monthly Newsletter - July',
    type: 'email',
    status: 'scheduled',
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    schedule: 'Scheduled for Jul 1, 2023',
    lastModified: '2023-06-25',
    segment: 'Newsletter Subscribers',
    author: 'Alex Johnson'
  },
  {
    id: '4',
    name: 'Customer Feedback Request',
    type: 'email',
    status: 'active',
    sentCount: 875,
    openRate: 41.2,
    clickRate: 12.5,
    schedule: 'Sent on Jun 22, 2023',
    lastModified: '2023-06-21',
    segment: 'Recent Customers',
    author: 'Maria Garcia'
  },
  {
    id: '5',
    name: 'Abandoned Cart Recovery',
    type: 'email',
    status: 'active',
    sentCount: 324,
    openRate: 28.7,
    clickRate: 15.2,
    schedule: 'Automated',
    lastModified: '2023-06-10',
    segment: 'Abandoned Carts',
    author: 'Alex Johnson'
  }
];

const smsCampaigns = [
  {
    id: '6',
    name: 'Flash Sale Alert',
    type: 'sms',
    status: 'active',
    sentCount: 450,
    openRate: null,
    clickRate: 24.5,
    schedule: 'Sent on Jun 18, 2023',
    lastModified: '2023-06-17',
    segment: 'SMS Subscribers',
    author: 'Maria Garcia'
  },
  {
    id: '7',
    name: 'Appointment Reminder',
    type: 'sms',
    status: 'scheduled',
    sentCount: 0,
    openRate: null,
    clickRate: 0,
    schedule: 'Automated',
    lastModified: '2023-06-15',
    segment: 'Appointment Customers',
    author: 'Alex Johnson'
  },
  {
    id: '8',
    name: 'Order Delivery Update',
    type: 'sms',
    status: 'active',
    sentCount: 187,
    openRate: null,
    clickRate: 5.3,
    schedule: 'Automated',
    lastModified: '2023-06-12',
    segment: 'Recent Orders',
    author: 'Maria Garcia'
  }
];

const automationCampaigns = [
  {
    id: '9',
    name: 'Welcome Series',
    type: 'automation',
    status: 'active',
    sentCount: 523,
    openRate: 45.7,
    clickRate: 18.2,
    schedule: 'Automated',
    lastModified: '2023-06-05',
    segment: 'New Subscribers',
    author: 'Alex Johnson'
  },
  {
    id: '10',
    name: 'Re-engagement Workflow',
    type: 'automation',
    status: 'active',
    sentCount: 782,
    openRate: 22.3,
    clickRate: 7.5,
    schedule: 'Automated',
    lastModified: '2023-06-08',
    segment: 'Inactive Customers',
    author: 'Maria Garcia'
  },
  {
    id: '11',
    name: 'Post-Purchase Follow-up',
    type: 'automation',
    status: 'draft',
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    schedule: 'Not active',
    lastModified: '2023-06-22',
    segment: 'Recent Customers',
    author: 'Alex Johnson'
  }
];

// Combine all campaign types
const allCampaigns = [...emailCampaigns, ...smsCampaigns, ...automationCampaigns];

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  
  // Filter campaigns based on search query, status, and type
  const filterCampaigns = (campaigns: any[]) => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           campaign.segment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           campaign.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  };
  
  // Get campaigns based on current tab
  const getCampaigns = () => {
    switch (currentTab) {
      case 'email':
        return filterCampaigns(emailCampaigns);
      case 'sms':
        return filterCampaigns(smsCampaigns);
      case 'automation':
        return filterCampaigns(automationCampaigns);
      default:
        return filterCampaigns(allCampaigns);
    }
  };
  
  const filteredCampaigns = getCampaigns();
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
      case 'paused':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Paused</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get campaign type icon
  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'automation':
        return <Activity className="h-4 w-4 text-purple-500" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };
  
  // Calculate campaign stats
  const campaignStats = {
    total: allCampaigns.length,
    active: allCampaigns.filter(c => c.status === 'active').length,
    draft: allCampaigns.filter(c => c.status === 'draft').length,
    scheduled: allCampaigns.filter(c => c.status === 'scheduled').length,
    totalSent: allCampaigns.reduce((sum, c) => sum + c.sentCount, 0),
    avgOpenRate: emailCampaigns.filter(c => c.sentCount > 0).reduce((sum, c) => sum + c.openRate, 0) / 
                emailCampaigns.filter(c => c.sentCount > 0).length || 0,
    avgClickRate: allCampaigns.filter(c => c.sentCount > 0).reduce((sum, c) => sum + c.clickRate, 0) / 
                 allCampaigns.filter(c => c.sentCount > 0).length || 0
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Marketing Campaigns</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href="/client/campaigns/templates">
              Templates
            </a>
          </Button>
          <Button asChild>
            <a href="/client/campaigns/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </a>
          </Button>
        </div>
      </div>
      
      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignStats.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {campaignStats.active} active, {campaignStats.draft} drafts, {campaignStats.scheduled} scheduled
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignStats.totalSent.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Across all campaigns
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignStats.avgOpenRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              For email campaigns
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Click Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignStats.avgClickRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Across all campaigns
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Campaign List */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            Manage your marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="all" onValueChange={setCurrentTab}>
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    className="pl-8 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('scheduled')}>
                      Scheduled
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('paused')}>
                      Paused
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                      Completed
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter('email')}>
                      Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter('sms')}>
                      SMS
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter('automation')}>
                      Automation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Tabs>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Segment</TableHead>
                  <TableHead className="hidden lg:table-cell">Performance</TableHead>
                  <TableHead className="hidden md:table-cell">Schedule</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No campaigns found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCampaignTypeIcon(campaign.type)}
                          <div>
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {campaign.type === 'email' ? 'Email' : campaign.type === 'sms' ? 'SMS' : 'Automation'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{campaign.segment}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {campaign.sentCount > 0 ? (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Open Rate</span>
                              <span>{campaign.type === 'sms' ? 'N/A' : `${campaign.openRate}%`}</span>
                            </div>
                            {campaign.type !== 'sms' && (
                              <Progress value={campaign.openRate} className="h-1" />
                            )}
                            <div className="flex justify-between text-xs">
                              <span>Click Rate</span>
                              <span>{campaign.clickRate}%</span>
                            </div>
                            <Progress value={campaign.clickRate} className="h-1" />
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No data yet</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {campaign.schedule === 'Automated' ? (
                            <Activity className="h-4 w-4 text-muted-foreground" />
                          ) : campaign.schedule.includes('Scheduled') ? (
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          ) : campaign.schedule === 'Not scheduled' ? (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">{campaign.schedule}</span>
                        </div>
                      </TableCell>
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
                              <Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {campaign.status === 'active' ? (
                              <DropdownMenuItem>
                                <Pause className="mr-2 h-4 w-4" /> Pause
                              </DropdownMenuItem>
                            ) : campaign.status === 'paused' ? (
                              <DropdownMenuItem>
                                <Play className="mr-2 h-4 w-4" /> Resume
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Recent campaign metrics over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] border-2 border-dashed rounded-md flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Performance chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
            <CardDescription>
              Based on engagement rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...allCampaigns]
                .filter(c => c.sentCount > 0)
                .sort((a, b) => (b.openRate || 0) + b.clickRate - ((a.openRate || 0) + a.clickRate))
                .slice(0, 5)
                .map((campaign, index) => (
                  <div key={campaign.id} className="flex items-start gap-2">
                    <div className="rounded-full bg-muted w-8 h-8 flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.type === 'sms' ? 'SMS' : 'Email'}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {campaign.type !== 'sms' ? `${campaign.openRate}% open, ` : ''}{campaign.clickRate}% click rate
                      </div>
                      <Progress 
                        value={campaign.type !== 'sms' ? (campaign.openRate + campaign.clickRate) / 2 : campaign.clickRate} 
                        className="h-1 mt-2" 
                      />
                    </div>
                  </div>
                ))}
              
              {allCampaigns.filter(c => c.sentCount > 0).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No campaign performance data yet</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href="/client/campaigns/analytics">
                View All Analytics <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common campaign tasks and templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Create Email Campaign</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Design and send targeted email campaigns to your audience.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <a href="/client/campaigns/create?type=email">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Send SMS Campaign</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Reach customers directly with SMS marketing messages.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <a href="/client/campaigns/create?type=sms">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Build Automation</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Create automated workflows to nurture leads and customers.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <a href="/client/campaigns/workflows/create">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 