'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Users,
  Calendar,
  Clock,
  ChevronRight,
  Save,
  SendHorizontal,
  Eye,
  PencilRuler,
  Image,
  Link,
  Type,
  LayoutGrid
} from 'lucide-react';

export default function CreateCampaignPage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'email';
  
  const [step, setStep] = useState(1);
  const [campaignType, setCampaignType] = useState(initialType);
  const [campaignDetails, setCampaignDetails] = useState({
    name: '',
    subject: '',
    fromName: '',
    fromEmail: '',
    replyTo: '',
    content: '',
    segmentId: '',
    schedule: 'now',
    scheduledDate: '',
    scheduledTime: '',
    testEmails: ''
  });
  
  // Mock data for segments
  const segments = [
    { id: '1', name: 'All Contacts', count: 2547 },
    { id: '2', name: 'Newsletter Subscribers', count: 1823 },
    { id: '3', name: 'Recent Customers', count: 456 },
    { id: '4', name: 'Inactive Customers', count: 789 },
    { id: '5', name: 'Product Interest - Electronics', count: 342 },
    { id: '6', name: 'VIP Customers', count: 124 }
  ];
  
  // Mock data for email templates
  const emailTemplates = [
    { id: '1', name: 'Welcome Email', category: 'Onboarding' },
    { id: '2', name: 'Newsletter', category: 'Regular Updates' },
    { id: '3', name: 'Product Announcement', category: 'Marketing' },
    { id: '4', name: 'Promotional Offer', category: 'Sales' },
    { id: '5', name: 'Event Invitation', category: 'Events' },
    { id: '6', name: 'Feedback Request', category: 'Engagement' },
    { id: '7', name: 'Abandoned Cart', category: 'Recovery' },
    { id: '8', name: 'Order Confirmation', category: 'Transactional' }
  ];
  
  // Mock data for SMS templates
  const smsTemplates = [
    { id: '1', name: 'Quick Promotion', category: 'Sales' },
    { id: '2', name: 'Appointment Reminder', category: 'Reminders' },
    { id: '3', name: 'Order Status', category: 'Transactional' },
    { id: '4', name: 'Event Alert', category: 'Events' },
    { id: '5', name: 'Flash Sale', category: 'Sales' }
  ];
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCampaignDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setCampaignDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Navigate to next step
  const nextStep = () => {
    setStep(step + 1);
  };
  
  // Navigate to previous step
  const prevStep = () => {
    setStep(step - 1);
  };
  
  // Get selected segment
  const selectedSegment = segments.find(s => s.id === campaignDetails.segmentId);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/client/campaigns">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            1
          </div>
          <span className={step >= 1 ? 'font-medium' : 'text-muted-foreground'}>Details</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            2
          </div>
          <span className={step >= 2 ? 'font-medium' : 'text-muted-foreground'}>Content</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            3
          </div>
          <span className={step >= 3 ? 'font-medium' : 'text-muted-foreground'}>Recipients</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            4
          </div>
          <span className={step >= 4 ? 'font-medium' : 'text-muted-foreground'}>Review & Send</span>
        </div>
      </div>
      
      {/* Step 1: Campaign Details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Set up the basic details for your campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaignType">Campaign Type</Label>
                <Tabs 
                  defaultValue={campaignType} 
                  onValueChange={(value) => setCampaignType(value)}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 w-[400px]">
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email Campaign</span>
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>SMS Campaign</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter campaign name"
                  value={campaignDetails.name}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-muted-foreground">
                  This name is for your reference only and won't be visible to recipients
                </p>
              </div>
              
              {campaignType === 'email' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Email Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Enter email subject"
                      value={campaignDetails.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromName">From Name</Label>
                      <Input
                        id="fromName"
                        name="fromName"
                        placeholder="Your name or company name"
                        value={campaignDetails.fromName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        name="fromEmail"
                        placeholder="email@example.com"
                        value={campaignDetails.fromEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="replyTo">Reply-To Email</Label>
                    <Input
                      id="replyTo"
                      name="replyTo"
                      placeholder="replies@example.com"
                      value={campaignDetails.replyTo}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Leave blank to use the From Email as the reply-to address
                    </p>
                  </div>
                </>
              )}
              
              {campaignType === 'sms' && (
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">SMS Campaign Guidelines</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Keep messages concise (160 characters for a single SMS)</li>
                    <li>• Include opt-out instructions (e.g., "Reply STOP to unsubscribe")</li>
                    <li>• Identify yourself clearly at the beginning of the message</li>
                    <li>• Avoid using all caps, excessive punctuation, or special characters</li>
                    <li>• Include a clear call-to-action</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <a href="/client/campaigns">Cancel</a>
            </Button>
            <Button onClick={nextStep}>Continue to Content</Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Step 2: Campaign Content */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Content</CardTitle>
            <CardDescription>
              {campaignType === 'email' 
                ? 'Design your email content or choose a template' 
                : 'Create your SMS message or choose a template'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {campaignType === 'email' && (
              <Tabs defaultValue="builder">
                <TabsList className="grid grid-cols-3 w-[400px]">
                  <TabsTrigger value="builder" className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    <span>Builder</span>
                  </TabsTrigger>
                  <TabsTrigger value="template" className="flex items-center gap-2">
                    <PencilRuler className="h-4 w-4" />
                    <span>Templates</span>
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    <span>HTML</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="builder" className="space-y-4 mt-4">
                  <div className="bg-muted/50 rounded-md p-4">
                    <div className="text-center py-8">
                      <LayoutGrid className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">Drag & Drop Email Builder</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Design your email by dragging and dropping content blocks
                      </p>
                      <Button>Launch Email Builder</Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="template" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {emailTemplates.map((template) => (
                      <Card key={template.id} className="cursor-pointer hover:border-primary transition-colors">
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription>{template.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="h-[120px] bg-muted flex items-center justify-center">
                            <Image className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            Use Template
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="htmlContent">HTML Content</Label>
                    <Textarea
                      id="htmlContent"
                      name="content"
                      placeholder="Paste your HTML code here..."
                      className="h-[300px] font-mono"
                      value={campaignDetails.content}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Paste your custom HTML code. Make sure it's responsive and tested.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            )}
            
            {campaignType === 'sms' && (
              <div className="space-y-6">
                <Tabs defaultValue="compose">
                  <TabsList className="grid grid-cols-2 w-[300px]">
                    <TabsTrigger value="compose">
                      <span>Compose</span>
                    </TabsTrigger>
                    <TabsTrigger value="template">
                      <span>Templates</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="compose" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="smsContent">Message Content</Label>
                      <Textarea
                        id="smsContent"
                        name="content"
                        placeholder="Type your SMS message here..."
                        className="h-[200px]"
                        value={campaignDetails.content}
                        onChange={handleInputChange}
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Characters: {campaignDetails.content.length}/160
                        </span>
                        <span className="text-muted-foreground">
                          Messages: {Math.ceil(campaignDetails.content.length / 160)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md">
                      <h3 className="text-base font-medium mb-2">Available Personalization</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCampaignDetails(prev => ({...prev, content: prev.content + ' {{first_name}}'}))} className="justify-start">
                          First Name
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCampaignDetails(prev => ({...prev, content: prev.content + ' {{last_name}}'}))} className="justify-start">
                          Last Name
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCampaignDetails(prev => ({...prev, content: prev.content + ' {{company}}'}))} className="justify-start">
                          Company
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCampaignDetails(prev => ({...prev, content: prev.content + ' {{unsubscribe_link}}'}))} className="justify-start">
                          Unsubscribe Link
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="template" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {smsTemplates.map((template) => (
                        <Card key={template.id} className="cursor-pointer hover:border-primary transition-colors">
                          <CardHeader className="p-4">
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <CardDescription>{template.category}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground">
                              Template preview text goes here...
                            </p>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button variant="outline" size="sm" className="w-full">
                              Use Template
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Continue to Recipients</Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Step 3: Recipients */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Recipients</CardTitle>
            <CardDescription>
              Choose who will receive this campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="segmentId">Select Segment</Label>
                <Select 
                  value={campaignDetails.segmentId} 
                  onValueChange={(value) => handleSelectChange('segmentId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name} ({segment.count.toLocaleString()} contacts)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedSegment && (
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {selectedSegment.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Recipients:</span>
                        <span className="font-medium">{selectedSegment.count.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Delivery:</span>
                        <span className="font-medium">Less than 10 minutes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Select 
                  value={campaignDetails.schedule} 
                  onValueChange={(value) => handleSelectChange('schedule', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select when to send" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send immediately</SelectItem>
                    <SelectItem value="scheduled">Schedule for later</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {campaignDetails.schedule === 'scheduled' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Date</Label>
                    <Input
                      id="scheduledDate"
                      name="scheduledDate"
                      type="date"
                      value={campaignDetails.scheduledDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Time</Label>
                    <Input
                      id="scheduledTime"
                      name="scheduledTime"
                      type="time"
                      value={campaignDetails.scheduledTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
              
              {campaignType === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="testEmails">Test Recipients (Optional)</Label>
                  <Input
                    id="testEmails"
                    name="testEmails"
                    placeholder="email1@example.com, email2@example.com"
                    value={campaignDetails.testEmails}
                    onChange={handleInputChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Send a test to these email addresses before the final campaign
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Review Campaign</Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Step 4: Review & Send */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Send</CardTitle>
            <CardDescription>
              Review your campaign before sending
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-muted-foreground">Campaign Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div className="space-y-1">
                      <dt className="text-sm text-muted-foreground">Campaign Name</dt>
                      <dd className="font-medium">{campaignDetails.name || 'Not specified'}</dd>
                    </div>
                    
                    <div className="space-y-1">
                      <dt className="text-sm text-muted-foreground">Campaign Type</dt>
                      <dd className="font-medium capitalize">{campaignType}</dd>
                    </div>
                    
                    {campaignType === 'email' && (
                      <>
                        <div className="space-y-1">
                          <dt className="text-sm text-muted-foreground">Subject Line</dt>
                          <dd className="font-medium">{campaignDetails.subject || 'Not specified'}</dd>
                        </div>
                        
                        <div className="space-y-1">
                          <dt className="text-sm text-muted-foreground">From</dt>
                          <dd className="font-medium">
                            {campaignDetails.fromName ? `${campaignDetails.fromName} <${campaignDetails.fromEmail}>` : campaignDetails.fromEmail || 'Not specified'}
                          </dd>
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-1">
                      <dt className="text-sm text-muted-foreground">Recipients</dt>
                      <dd className="font-medium">
                        {selectedSegment ? `${selectedSegment.name} (${selectedSegment.count.toLocaleString()} contacts)` : 'No segment selected'}
                      </dd>
                    </div>
                    
                    <div className="space-y-1">
                      <dt className="text-sm text-muted-foreground">Schedule</dt>
                      <dd className="font-medium">
                        {campaignDetails.schedule === 'now' 
                          ? 'Send immediately' 
                          : campaignDetails.scheduledDate && campaignDetails.scheduledTime 
                            ? `Scheduled for ${campaignDetails.scheduledDate} at ${campaignDetails.scheduledTime}`
                            : 'Schedule not specified'}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-muted-foreground">Content Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-4 min-h-[200px]">
                    {campaignDetails.content ? (
                      <div className="prose max-w-none">
                        {campaignType === 'email' ? (
                          <div className="text-center text-muted-foreground">
                            <Eye className="h-8 w-8 mx-auto mb-2" />
                            <p>HTML email preview would be displayed here</p>
                          </div>
                        ) : (
                          <div className="bg-muted/50 p-4 rounded-md">
                            <p className="font-medium mb-2">SMS Preview:</p>
                            <p>{campaignDetails.content}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No content created yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {campaignType === 'email' && campaignDetails.testEmails && (
                <div className="flex justify-center">
                  <Button variant="outline" className="gap-2">
                    <SendHorizontal className="h-4 w-4" />
                    Send Test Email
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
              <Button>
                <SendHorizontal className="mr-2 h-4 w-4" />
                {campaignDetails.schedule === 'now' ? 'Send Now' : 'Schedule Campaign'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 