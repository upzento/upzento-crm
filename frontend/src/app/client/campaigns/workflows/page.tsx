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
import {
  ArrowLeft,
  Search,
  Plus,
  MoreHorizontal,
  Activity,
  Play,
  Pause,
  Copy,
  Trash2,
  Edit,
  Eye,
  BarChart3,
  Mail,
  MessageSquare,
  Clock,
  Calendar,
  Users,
  Filter,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Workflow
} from 'lucide-react';

// Mock data for workflows
const workflows = [
  {
    id: '1',
    name: 'Welcome Series',
    status: 'active',
    trigger: 'Contact added to segment',
    triggerDetail: 'New Subscribers',
    steps: 3,
    contactsEnrolled: 523,
    lastModified: '2023-06-15',
    author: 'Alex Johnson',
    description: 'Onboarding series for new subscribers'
  },
  {
    id: '2',
    name: 'Abandoned Cart Recovery',
    status: 'active',
    trigger: 'Event',
    triggerDetail: 'Cart Abandoned',
    steps: 4,
    contactsEnrolled: 189,
    lastModified: '2023-06-18',
    author: 'Maria Garcia',
    description: 'Follow up with customers who abandoned their cart'
  },
  {
    id: '3',
    name: 'Re-engagement Campaign',
    status: 'paused',
    trigger: 'Contact added to segment',
    triggerDetail: 'Inactive Customers',
    steps: 5,
    contactsEnrolled: 782,
    lastModified: '2023-06-10',
    author: 'Alex Johnson',
    description: 'Win back inactive customers'
  },
  {
    id: '4',
    name: 'Post-Purchase Follow-up',
    status: 'draft',
    trigger: 'Event',
    triggerDetail: 'Order Completed',
    steps: 3,
    contactsEnrolled: 0,
    lastModified: '2023-06-22',
    author: 'Maria Garcia',
    description: 'Follow up after purchase to encourage reviews and repeat purchases'
  },
  {
    id: '5',
    name: 'Birthday Rewards',
    status: 'active',
    trigger: 'Date-based',
    triggerDetail: 'Contact Birthday',
    steps: 2,
    contactsEnrolled: 1247,
    lastModified: '2023-06-05',
    author: 'Alex Johnson',
    description: 'Send birthday offers to customers'
  },
  {
    id: '6',
    name: 'Lead Nurturing',
    status: 'active',
    trigger: 'Contact added to segment',
    triggerDetail: 'New Leads',
    steps: 6,
    contactsEnrolled: 342,
    lastModified: '2023-06-20',
    author: 'Maria Garcia',
    description: 'Nurture leads through the sales funnel'
  }
];

// Mock data for workflow templates
const workflowTemplates = [
  {
    id: '1',
    name: 'Welcome Series',
    category: 'Onboarding',
    steps: 3,
    description: 'Introduce new subscribers to your business with a series of welcome emails'
  },
  {
    id: '2',
    name: 'Abandoned Cart Recovery',
    category: 'E-commerce',
    steps: 3,
    description: 'Remind customers about items left in their shopping cart'
  },
  {
    id: '3',
    name: 'Re-engagement Campaign',
    category: 'Retention',
    steps: 4,
    description: 'Win back inactive customers with targeted content and offers'
  },
  {
    id: '4',
    name: 'Post-Purchase Follow-up',
    category: 'E-commerce',
    steps: 3,
    description: 'Thank customers for their purchase and encourage reviews'
  },
  {
    id: '5',
    name: 'Birthday Rewards',
    category: 'Loyalty',
    steps: 1,
    description: 'Send special offers to customers on their birthday'
  },
  {
    id: '6',
    name: 'Lead Nurturing',
    category: 'Sales',
    steps: 5,
    description: 'Guide leads through the sales funnel with targeted content'
  }
];

export default function WorkflowsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter workflows based on search query and status filter
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = 
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.trigger.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case 'paused':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get trigger icon
  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'Contact added to segment':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'Event':
        return <Activity className="h-4 w-4 text-purple-500" />;
      case 'Date-based':
        return <Calendar className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/client/campaigns">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Automation Workflows</h1>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Create automated marketing workflows to nurture leads and engage customers
        </p>
        <Button asChild>
          <a href="/client/campaigns/workflows/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </a>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Workflows</CardTitle>
          <CardDescription>
            Manage your marketing automation workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Status</span>
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
                  <DropdownMenuItem onClick={() => setStatusFilter('paused')}>
                    Paused
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Trigger</TableHead>
                  <TableHead className="hidden lg:table-cell">Steps</TableHead>
                  <TableHead className="hidden md:table-cell">Enrolled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkflows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No workflows found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          <div>
                            <div className="font-medium">{workflow.name}</div>
                            <div className="text-sm text-muted-foreground">{workflow.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {getTriggerIcon(workflow.trigger)}
                          <div>
                            <div className="text-sm">{workflow.trigger}</div>
                            <div className="text-xs text-muted-foreground">{workflow.triggerDetail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: workflow.steps }).map((_, i) => (
                            <div 
                              key={i} 
                              className="h-2 w-2 rounded-full bg-primary" 
                            />
                          ))}
                          <span className="ml-2 text-sm">{workflow.steps} steps</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {workflow.contactsEnrolled.toLocaleString()}
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
                            {workflow.status === 'active' ? (
                              <DropdownMenuItem>
                                <Pause className="mr-2 h-4 w-4" /> Pause
                              </DropdownMenuItem>
                            ) : workflow.status === 'paused' ? (
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Workflow Templates</CardTitle>
            <CardDescription>
              Start with a pre-built workflow template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workflowTemplates.map((template) => (
                <Card key={template.id} className="border border-muted">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: template.steps }).map((_, i) => (
                        <div 
                          key={i} 
                          className="h-2 w-2 rounded-full bg-primary" 
                        />
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground">{template.steps} steps</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`/client/campaigns/workflows/create?template=${template.id}`}>
                        Use Template
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Workflow Performance</CardTitle>
            <CardDescription>
              Key metrics for your active workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {workflows
              .filter(w => w.status === 'active')
              .map((workflow) => (
                <div key={workflow.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{workflow.name}</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Enrolled</p>
                      <p className="font-medium">{workflow.contactsEnrolled}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Steps</p>
                      <p className="font-medium">{workflow.steps}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Completed</p>
                      <p className="font-medium">
                        {Math.floor(workflow.contactsEnrolled * 0.7)}
                      </p>
                    </div>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.floor(Math.random() * 40) + 50}%` }}
                    />
                  </div>
                </div>
              ))}
            
            {workflows.filter(w => w.status === 'active').length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active workflows</p>
              </div>
            )}
            
            <Button variant="outline" className="w-full" asChild>
              <a href="/client/campaigns/analytics">
                View Detailed Analytics
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with Workflows</CardTitle>
          <CardDescription>
            Learn how to create effective marketing automation workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Define Your Goal</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Start by clearly defining what you want to achieve with your workflow, such as welcoming new subscribers, recovering abandoned carts, or nurturing leads.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Identify Your Audience</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Determine which segment of your audience should enter the workflow, based on their behavior, demographics, or other criteria.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Set Up Triggers</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Define what action or event will trigger the workflow, such as joining a segment, making a purchase, or a specific date.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Create Content</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Develop compelling content for each step in your workflow, tailored to your audience and goal.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Set Timing</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Determine the optimal timing between steps to maximize engagement without overwhelming your audience.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Monitor & Optimize</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Regularly review workflow performance and make adjustments to improve results over time.
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button asChild>
              <a href="/client/campaigns/workflows/create">
                Create Your First Workflow <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 