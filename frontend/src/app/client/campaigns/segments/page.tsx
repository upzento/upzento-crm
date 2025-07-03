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
import {
  ArrowLeft,
  Search,
  Plus,
  MoreHorizontal,
  Users,
  UserPlus,
  UserMinus,
  Filter,
  Calendar,
  Clock,
  Trash2,
  Edit,
  Copy,
  Eye,
  BarChart3,
  RefreshCw,
  Tag,
  Building,
  Map,
  Mail,
  Phone,
  ShoppingCart,
  FileText,
  CalendarDays
} from 'lucide-react';

// Mock data for segments
const segments = [
  {
    id: '1',
    name: 'All Contacts',
    type: 'system',
    contactCount: 2547,
    lastUpdated: '2023-06-28',
    description: 'All contacts in the system',
    criteria: []
  },
  {
    id: '2',
    name: 'Newsletter Subscribers',
    type: 'custom',
    contactCount: 1823,
    lastUpdated: '2023-06-25',
    description: 'Contacts who have subscribed to the newsletter',
    criteria: [
      { field: 'tags', operator: 'contains', value: 'Newsletter' }
    ]
  },
  {
    id: '3',
    name: 'Recent Customers',
    type: 'custom',
    contactCount: 456,
    lastUpdated: '2023-06-27',
    description: 'Customers who made a purchase in the last 30 days',
    criteria: [
      { field: 'type', operator: 'equals', value: 'customer' },
      { field: 'lastPurchaseDate', operator: 'greater_than', value: '30 days ago' }
    ]
  },
  {
    id: '4',
    name: 'Inactive Customers',
    type: 'custom',
    contactCount: 789,
    lastUpdated: '2023-06-20',
    description: 'Customers who haven\'t made a purchase in over 90 days',
    criteria: [
      { field: 'type', operator: 'equals', value: 'customer' },
      { field: 'lastPurchaseDate', operator: 'less_than', value: '90 days ago' }
    ]
  },
  {
    id: '5',
    name: 'Product Interest - Electronics',
    type: 'custom',
    contactCount: 342,
    lastUpdated: '2023-06-22',
    description: 'Contacts who have shown interest in electronics products',
    criteria: [
      { field: 'tags', operator: 'contains', value: 'Electronics' }
    ]
  },
  {
    id: '6',
    name: 'VIP Customers',
    type: 'custom',
    contactCount: 124,
    lastUpdated: '2023-06-26',
    description: 'High-value customers with lifetime spend over $1000',
    criteria: [
      { field: 'type', operator: 'equals', value: 'customer' },
      { field: 'lifetimeValue', operator: 'greater_than', value: 1000 }
    ]
  },
  {
    id: '7',
    name: 'California Contacts',
    type: 'custom',
    contactCount: 578,
    lastUpdated: '2023-06-24',
    description: 'Contacts located in California',
    criteria: [
      { field: 'state', operator: 'equals', value: 'California' }
    ]
  },
  {
    id: '8',
    name: 'Enterprise Leads',
    type: 'custom',
    contactCount: 215,
    lastUpdated: '2023-06-23',
    description: 'Leads from enterprise companies (250+ employees)',
    criteria: [
      { field: 'type', operator: 'equals', value: 'lead' },
      { field: 'companySize', operator: 'greater_than', value: 250 }
    ]
  }
];

// Mock data for field options
const fieldOptions = [
  { 
    category: 'Contact Info',
    icon: <Users className="h-4 w-4" />,
    fields: [
      { id: 'firstName', name: 'First Name', type: 'text' },
      { id: 'lastName', name: 'Last Name', type: 'text' },
      { id: 'email', name: 'Email', type: 'text' },
      { id: 'phone', name: 'Phone', type: 'text' },
      { id: 'type', name: 'Contact Type', type: 'select', options: ['lead', 'customer', 'partner'] }
    ]
  },
  {
    category: 'Company Info',
    icon: <Building className="h-4 w-4" />,
    fields: [
      { id: 'company', name: 'Company Name', type: 'text' },
      { id: 'jobTitle', name: 'Job Title', type: 'text' },
      { id: 'industry', name: 'Industry', type: 'select', options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Other'] },
      { id: 'companySize', name: 'Company Size', type: 'number' }
    ]
  },
  {
    category: 'Location',
    icon: <Map className="h-4 w-4" />,
    fields: [
      { id: 'city', name: 'City', type: 'text' },
      { id: 'state', name: 'State/Province', type: 'text' },
      { id: 'country', name: 'Country', type: 'text' },
      { id: 'zipCode', name: 'ZIP/Postal Code', type: 'text' }
    ]
  },
  {
    category: 'Engagement',
    icon: <Mail className="h-4 w-4" />,
    fields: [
      { id: 'emailOpens', name: 'Email Opens', type: 'number' },
      { id: 'emailClicks', name: 'Email Clicks', type: 'number' },
      { id: 'lastEmailOpen', name: 'Last Email Open', type: 'date' },
      { id: 'lastEmailClick', name: 'Last Email Click', type: 'date' },
      { id: 'emailEngagementScore', name: 'Email Engagement Score', type: 'number' }
    ]
  },
  {
    category: 'Purchase History',
    icon: <ShoppingCart className="h-4 w-4" />,
    fields: [
      { id: 'lastPurchaseDate', name: 'Last Purchase Date', type: 'date' },
      { id: 'lifetimeValue', name: 'Lifetime Value', type: 'number' },
      { id: 'orderCount', name: 'Order Count', type: 'number' },
      { id: 'averageOrderValue', name: 'Average Order Value', type: 'number' }
    ]
  },
  {
    category: 'Tags & Custom Fields',
    icon: <Tag className="h-4 w-4" />,
    fields: [
      { id: 'tags', name: 'Tags', type: 'multi-select', options: ['VIP', 'Newsletter', 'Electronics', 'Enterprise', 'SMB'] }
    ]
  }
];

export default function SegmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewSegment, setShowNewSegment] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');
  const [newSegmentDescription, setNewSegmentDescription] = useState('');
  const [criteria, setCriteria] = useState<any[]>([
    { field: '', operator: 'equals', value: '' }
  ]);
  
  // Filter segments based on search query
  const filteredSegments = segments.filter(segment => 
    segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    segment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Add new criterion
  const addCriterion = () => {
    setCriteria([...criteria, { field: '', operator: 'equals', value: '' }]);
  };
  
  // Remove criterion
  const removeCriterion = (index: number) => {
    const newCriteria = [...criteria];
    newCriteria.splice(index, 1);
    setCriteria(newCriteria);
  };
  
  // Update criterion field
  const updateCriterionField = (index: number, field: string, value: any) => {
    const newCriteria = [...criteria];
    newCriteria[index][field] = value;
    setCriteria(newCriteria);
  };
  
  // Create new segment
  const createSegment = () => {
    // In a real app, this would send a request to the server
    console.log('Creating segment:', {
      name: newSegmentName,
      description: newSegmentDescription,
      criteria
    });
    
    // Reset form
    setNewSegmentName('');
    setNewSegmentDescription('');
    setCriteria([{ field: '', operator: 'equals', value: '' }]);
    setShowNewSegment(false);
  };
  
  // Get field options for a specific field
  const getFieldOptions = (fieldId: string) => {
    for (const category of fieldOptions) {
      const field = category.fields.find(f => f.id === fieldId);
      if (field) {
        return field;
      }
    }
    return null;
  };
  
  // Get operator options based on field type
  const getOperatorOptions = (fieldType: string) => {
    switch (fieldType) {
      case 'text':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'not_equals', label: 'Does not equal' },
          { value: 'contains', label: 'Contains' },
          { value: 'not_contains', label: 'Does not contain' },
          { value: 'starts_with', label: 'Starts with' },
          { value: 'ends_with', label: 'Ends with' }
        ];
      case 'number':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'not_equals', label: 'Does not equal' },
          { value: 'greater_than', label: 'Greater than' },
          { value: 'less_than', label: 'Less than' },
          { value: 'between', label: 'Between' }
        ];
      case 'date':
        return [
          { value: 'equals', label: 'On' },
          { value: 'not_equals', label: 'Not on' },
          { value: 'greater_than', label: 'After' },
          { value: 'less_than', label: 'Before' },
          { value: 'between', label: 'Between' }
        ];
      case 'select':
      case 'multi-select':
        return [
          { value: 'equals', label: 'Is' },
          { value: 'not_equals', label: 'Is not' },
          { value: 'contains', label: 'Contains' },
          { value: 'not_contains', label: 'Does not contain' }
        ];
      default:
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'not_equals', label: 'Does not equal' }
        ];
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
        <h1 className="text-3xl font-bold tracking-tight">Contact Segments</h1>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Create and manage segments to target specific groups of contacts
        </p>
        <Button onClick={() => setShowNewSegment(!showNewSegment)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Segment
        </Button>
      </div>
      
      {showNewSegment && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Segment</CardTitle>
            <CardDescription>
              Define criteria to group contacts based on their properties or behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="segmentName" className="text-sm font-medium">Segment Name</label>
                <Input
                  id="segmentName"
                  value={newSegmentName}
                  onChange={(e) => setNewSegmentName(e.target.value)}
                  placeholder="Enter segment name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="segmentDescription" className="text-sm font-medium">Description (Optional)</label>
                <Input
                  id="segmentDescription"
                  value={newSegmentDescription}
                  onChange={(e) => setNewSegmentDescription(e.target.value)}
                  placeholder="Enter segment description"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Segment Criteria</h3>
                <div className="text-sm text-muted-foreground">
                  Contacts must match ALL of the following conditions
                </div>
              </div>
              
              {criteria.map((criterion, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-sm font-medium">Field</label>
                    <select
                      className="w-full border rounded-md px-3 py-2"
                      value={criterion.field}
                      onChange={(e) => updateCriterionField(index, 'field', e.target.value)}
                    >
                      <option value="">Select a field</option>
                      {fieldOptions.map((category) => (
                        <optgroup key={category.category} label={category.category}>
                          {category.fields.map((field) => (
                            <option key={field.id} value={field.id}>
                              {field.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-sm font-medium">Operator</label>
                    <select
                      className="w-full border rounded-md px-3 py-2"
                      value={criterion.operator}
                      onChange={(e) => updateCriterionField(index, 'operator', e.target.value)}
                      disabled={!criterion.field}
                    >
                      {criterion.field && getFieldOptions(criterion.field) ? (
                        getOperatorOptions(getFieldOptions(criterion.field)!.type).map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))
                      ) : (
                        <option value="equals">Equals</option>
                      )}
                    </select>
                  </div>
                  
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-sm font-medium">Value</label>
                    {criterion.field && getFieldOptions(criterion.field) && getFieldOptions(criterion.field)!.type === 'select' ? (
                      <select
                        className="w-full border rounded-md px-3 py-2"
                        value={criterion.value}
                        onChange={(e) => updateCriterionField(index, 'value', e.target.value)}
                      >
                        <option value="">Select a value</option>
                        {getFieldOptions(criterion.field)!.options.map((option: string) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : criterion.field && getFieldOptions(criterion.field) && getFieldOptions(criterion.field)!.type === 'date' ? (
                      <Input
                        type="date"
                        value={criterion.value}
                        onChange={(e) => updateCriterionField(index, 'value', e.target.value)}
                      />
                    ) : (
                      <Input
                        type={criterion.field && getFieldOptions(criterion.field) && getFieldOptions(criterion.field)!.type === 'number' ? 'number' : 'text'}
                        value={criterion.value}
                        onChange={(e) => updateCriterionField(index, 'value', e.target.value)}
                        placeholder="Enter value"
                      />
                    )}
                  </div>
                  
                  <div className="md:col-span-1 flex items-end justify-center h-full">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCriterion(index)}
                      disabled={criteria.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addCriterion} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Condition
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewSegment(false)}>
              Cancel
            </Button>
            <Button onClick={createSegment} disabled={!newSegmentName || criteria.some(c => !c.field || !c.value)}>
              Create Segment
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>All Segments</CardTitle>
          <CardDescription>
            Manage your contact segments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search segments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Segment Name</TableHead>
                  <TableHead className="hidden md:table-cell">Contacts</TableHead>
                  <TableHead className="hidden lg:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSegments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No segments found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSegments.map((segment) => (
                    <TableRow key={segment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{segment.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {segment.type === 'system' ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">System</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Custom</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="font-medium">{segment.contactCount.toLocaleString()}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell max-w-[300px] truncate">
                        {segment.description}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {segment.lastUpdated}
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
                              <Eye className="mr-2 h-4 w-4" /> View Contacts
                            </DropdownMenuItem>
                            {segment.type !== 'system' && (
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Count
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" /> Create Email Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" /> Create SMS Campaign
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {segment.type !== 'system' && (
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            )}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Segment Best Practices</CardTitle>
            <CardDescription>
              Tips for effective segmentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Tag className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Use clear naming conventions</p>
                  <p className="text-sm text-muted-foreground">Make segment names descriptive and consistent</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Start with broad segments</p>
                  <p className="text-sm text-muted-foreground">Then create more specific sub-segments as needed</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <RefreshCw className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Keep segments updated</p>
                  <p className="text-sm text-muted-foreground">Regularly review and refresh your segments</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Test different segments</p>
                  <p className="text-sm text-muted-foreground">Compare campaign performance across segments</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Segment Ideas</CardTitle>
            <CardDescription>
              Popular segmentation strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start h-auto py-2">
                  <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">New Contacts</p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto py-2">
                  <ShoppingCart className="mr-2 h-4 w-4 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium">Recent Buyers</p>
                    <p className="text-xs text-muted-foreground">Purchased in last 7 days</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto py-2">
                  <Mail className="mr-2 h-4 w-4 text-amber-500" />
                  <div className="text-left">
                    <p className="font-medium">Email Engaged</p>
                    <p className="text-xs text-muted-foreground">Opened or clicked recently</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto py-2">
                  <Map className="mr-2 h-4 w-4 text-purple-500" />
                  <div className="text-left">
                    <p className="font-medium">By Location</p>
                    <p className="text-xs text-muted-foreground">Geographic targeting</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto py-2">
                  <Building className="mr-2 h-4 w-4 text-indigo-500" />
                  <div className="text-left">
                    <p className="font-medium">By Industry</p>
                    <p className="text-xs text-muted-foreground">Industry-specific campaigns</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto py-2">
                  <FileText className="mr-2 h-4 w-4 text-teal-500" />
                  <div className="text-left">
                    <p className="font-medium">Custom Segments</p>
                    <p className="text-xs text-muted-foreground">Create your own</p>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 