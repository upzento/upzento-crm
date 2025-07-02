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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Building,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  Percent,
  Users,
  FileText
} from 'lucide-react';

// Mock data for pipelines and stages
const pipelines = [
  {
    id: '1',
    name: 'Default Sales Pipeline',
    stages: [
      { id: '1-1', name: 'Qualification', color: '#3b82f6' },
      { id: '1-2', name: 'Discovery', color: '#6366f1' },
      { id: '1-3', name: 'Proposal', color: '#8b5cf6' },
      { id: '1-4', name: 'Negotiation', color: '#f59e0b' },
      { id: '1-5', name: 'Closed Won', color: '#10b981' },
      { id: '1-6', name: 'Closed Lost', color: '#ef4444' }
    ]
  },
  {
    id: '2',
    name: 'Enterprise Sales Pipeline',
    stages: [
      { id: '2-1', name: 'Initial Contact', color: '#3b82f6' },
      { id: '2-2', name: 'Needs Assessment', color: '#6366f1' },
      { id: '2-3', name: 'Solution Presentation', color: '#8b5cf6' },
      { id: '2-4', name: 'Technical Review', color: '#ec4899' },
      { id: '2-5', name: 'Business Case', color: '#f59e0b' },
      { id: '2-6', name: 'Contract Negotiation', color: '#d97706' },
      { id: '2-7', name: 'Closed Won', color: '#10b981' },
      { id: '2-8', name: 'Closed Lost', color: '#ef4444' }
    ]
  },
  {
    id: '3',
    name: 'SMB Sales Pipeline',
    stages: [
      { id: '3-1', name: 'Lead In', color: '#3b82f6' },
      { id: '3-2', name: 'Demo', color: '#8b5cf6' },
      { id: '3-3', name: 'Proposal', color: '#f59e0b' },
      { id: '3-4', name: 'Closed Won', color: '#10b981' },
      { id: '3-5', name: 'Closed Lost', color: '#ef4444' }
    ]
  }
];

// Mock data for contacts
const contacts = [
  { id: '1', name: 'John Smith', company: 'Acme Inc.', email: 'john.smith@acme.com', phone: '+1 (555) 123-4567' },
  { id: '2', name: 'Sarah Johnson', company: 'XYZ Corp', email: 'sarah.johnson@xyz.com', phone: '+1 (555) 987-6543' },
  { id: '3', name: 'Michael Brown', company: 'Brown & Associates', email: 'michael.brown@brownassoc.com', phone: '+1 (555) 456-7890' },
  { id: '4', name: 'Emily Davis', company: 'Tech Solutions', email: 'emily.davis@techsolutions.com', phone: '+1 (555) 789-0123' },
  { id: '5', name: 'David Wilson', company: 'Wilson Marketing', email: 'david.wilson@wilsonmktg.com', phone: '+1 (555) 234-5678' }
];

// Mock data for users (owners)
const users = [
  { id: '1', name: 'Alex Johnson' },
  { id: '2', name: 'Maria Garcia' },
  { id: '3', name: 'James Wilson' }
];

// Mock data for sources
const sources = [
  { id: '1', name: 'Website' },
  { id: '2', name: 'Referral' },
  { id: '3', name: 'Cold Call' },
  { id: '4', name: 'LinkedIn' },
  { id: '5', name: 'Trade Show' },
  { id: '6', name: 'Email Campaign' },
  { id: '7', name: 'Google Ads' }
];

export default function CreateDealPage() {
  const [dealData, setDealData] = useState({
    name: '',
    pipelineId: '1',
    stageId: '',
    value: '',
    currency: 'USD',
    probability: '50',
    expectedCloseDate: '',
    contactId: '',
    ownerId: '',
    sourceId: '',
    description: ''
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showContactDetails, setShowContactDetails] = useState(false);
  
  // Get the selected pipeline
  const selectedPipeline = pipelines.find(p => p.id === dealData.pipelineId);
  
  // Get the selected contact
  const selectedContact = contacts.find(c => c.id === dealData.contactId);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDealData({
      ...dealData,
      [name]: value
    });
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    // If changing pipeline, reset stage
    if (name === 'pipelineId') {
      setDealData({
        ...dealData,
        pipelineId: value,
        stageId: ''
      });
    } else {
      setDealData({
        ...dealData,
        [name]: value
      });
    }
  };
  
  // Create deal
  const createDeal = () => {
    // Validate required fields
    if (!dealData.name) {
      setErrorMessage('Deal name is required');
      return;
    }
    
    if (!dealData.stageId) {
      setErrorMessage('Pipeline stage is required');
      return;
    }
    
    // In a real app, this would send a request to create the deal
    console.log('Creating deal:', dealData);
    
    // Show success message
    setSuccessMessage('Deal created successfully');
    setTimeout(() => {
      // In a real app, this would redirect to the deal detail page
      window.location.href = '/client/deals';
    }, 1500);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/client/deals">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create Deal</h1>
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Deal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Details</CardTitle>
              <CardDescription>
                Enter the basic information about this deal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Deal Name*</Label>
                <Input
                  id="name"
                  name="name"
                  value={dealData.name}
                  onChange={handleInputChange}
                  placeholder="Enter deal name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pipelineId">Pipeline*</Label>
                  <Select 
                    value={dealData.pipelineId} 
                    onValueChange={(value) => handleSelectChange('pipelineId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pipeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {pipelines.map((pipeline) => (
                        <SelectItem key={pipeline.id} value={pipeline.id}>
                          {pipeline.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stageId">Stage*</Label>
                  <Select 
                    value={dealData.stageId} 
                    onValueChange={(value) => handleSelectChange('stageId', value)}
                    disabled={!dealData.pipelineId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedPipeline?.stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Deal Value</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      value={dealData.value}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={dealData.currency} 
                    onValueChange={(value) => handleSelectChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="probability">Probability (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="probability"
                      name="probability"
                      type="number"
                      min="0"
                      max="100"
                      value={dealData.probability}
                      onChange={handleInputChange}
                      placeholder="50"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="expectedCloseDate"
                    name="expectedCloseDate"
                    type="date"
                    value={dealData.expectedCloseDate}
                    onChange={handleInputChange}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={dealData.description}
                  onChange={handleInputChange}
                  placeholder="Enter deal description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Associate this deal with a contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactId">Contact</Label>
                <Select 
                  value={dealData.contactId} 
                  onValueChange={(value) => {
                    handleSelectChange('contactId', value);
                    setShowContactDetails(!!value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name} ({contact.company})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-muted-foreground">
                    Or select an existing contact
                  </p>
                  <Button variant="link" size="sm" className="h-auto p-0" asChild>
                    <a href="/client/contacts">Create New Contact</a>
                  </Button>
                </div>
              </div>
              
              {showContactDetails && selectedContact && (
                <div className="bg-muted/50 p-4 rounded-md space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    <Button variant="link" size="sm" className="h-auto p-0" asChild>
                      <a href={`/client/contacts?id=${selectedContact.id}`}>View Contact</a>
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedContact.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedContact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedContact.phone}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Additional Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Add more details about this deal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerId">Deal Owner</Label>
                <Select 
                  value={dealData.ownerId} 
                  onValueChange={(value) => handleSelectChange('ownerId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sourceId">Lead Source</Label>
                <Select 
                  value={dealData.sourceId} 
                  onValueChange={(value) => handleSelectChange('sourceId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {sources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Deal Tips</CardTitle>
              <CardDescription>
                Best practices for successful deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Be specific with deal names</span> - Include company name and product/service
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Set realistic probabilities</span> - Be honest about your chances
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Include detailed descriptions</span> - Note key requirements and decision factors
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Link to related contacts</span> - Connect all relevant stakeholders
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <a href="/client/deals">Cancel</a>
        </Button>
        <Button onClick={createDeal}>
          Create Deal
        </Button>
      </div>
    </div>
  );
} 