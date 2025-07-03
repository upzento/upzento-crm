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
  Phone, 
  MessageSquare, 
  MoreVertical, 
  Filter, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft, 
  UserPlus, 
  Download, 
  BarChart2, 
  PhoneCall, 
  PhoneOff, 
  MessageCircle, 
  PlusCircle
} from 'lucide-react';

// Mock data for calls
const calls = [
  {
    id: '1',
    contact: 'John Smith',
    number: '+1 (555) 123-4567',
    type: 'incoming',
    duration: '3m 42s',
    date: '2023-07-01',
    time: '10:32 AM',
    status: 'completed',
    notes: 'Customer inquired about premium plan pricing',
    assigned: 'Alex Johnson'
  },
  {
    id: '2',
    contact: 'Sarah Johnson',
    number: '+1 (555) 987-6543',
    type: 'outgoing',
    duration: '5m 18s',
    date: '2023-07-01',
    time: '11:45 AM',
    status: 'completed',
    notes: 'Follow-up on recent order',
    assigned: 'Maria Garcia'
  },
  {
    id: '3',
    contact: 'Michael Brown',
    number: '+1 (555) 456-7890',
    type: 'incoming',
    duration: '1m 05s',
    date: '2023-06-30',
    time: '3:22 PM',
    status: 'missed',
    notes: '',
    assigned: 'Unassigned'
  },
  {
    id: '4',
    contact: 'Emily Davis',
    number: '+1 (555) 789-0123',
    type: 'outgoing',
    duration: '2m 37s',
    date: '2023-06-30',
    time: '2:15 PM',
    status: 'completed',
    notes: 'Scheduled demo for next week',
    assigned: 'Alex Johnson'
  },
  {
    id: '5',
    contact: 'David Wilson',
    number: '+1 (555) 234-5678',
    type: 'incoming',
    duration: '0m 00s',
    date: '2023-06-29',
    time: '9:05 AM',
    status: 'missed',
    notes: '',
    assigned: 'Unassigned'
  }
];

// Mock data for SMS conversations
const smsConversations = [
  {
    id: '1',
    contact: 'John Smith',
    number: '+1 (555) 123-4567',
    lastMessage: 'Yes, I received the confirmation email. Thank you!',
    date: '2023-07-01',
    time: '11:32 AM',
    unread: false,
    messages: 12
  },
  {
    id: '2',
    contact: 'Sarah Johnson',
    number: '+1 (555) 987-6543',
    lastMessage: 'Can you send me more information about your services?',
    date: '2023-07-01',
    time: '10:15 AM',
    unread: true,
    messages: 8
  },
  {
    id: '3',
    contact: 'Michael Brown',
    number: '+1 (555) 456-7890',
    lastMessage: 'I\'ll be available for a call tomorrow at 2 PM.',
    date: '2023-06-30',
    time: '4:45 PM',
    unread: false,
    messages: 5
  },
  {
    id: '4',
    contact: 'Emily Davis',
    number: '+1 (555) 789-0123',
    lastMessage: 'Thanks for the quick response!',
    date: '2023-06-30',
    time: '3:22 PM',
    unread: false,
    messages: 15
  },
  {
    id: '5',
    contact: 'David Wilson',
    number: '+1 (555) 234-5678',
    lastMessage: 'Yes, that time works for me.',
    date: '2023-06-29',
    time: '1:05 PM',
    unread: false,
    messages: 7
  }
];

// Mock data for phone numbers
const phoneNumbers = [
  {
    id: '1',
    number: '+1 (555) 111-2233',
    type: 'Main Line',
    location: 'New York',
    assignedTo: 'Sales Team',
    status: 'active',
    calls: 156,
    sms: 89
  },
  {
    id: '2',
    number: '+1 (555) 444-5566',
    type: 'Support',
    location: 'Chicago',
    assignedTo: 'Support Team',
    status: 'active',
    calls: 243,
    sms: 127
  },
  {
    id: '3',
    number: '+1 (555) 777-8899',
    type: 'Marketing',
    location: 'Los Angeles',
    assignedTo: 'Marketing Team',
    status: 'inactive',
    calls: 78,
    sms: 312
  }
];

// Mock data for stats
const stats = {
  totalCalls: 478,
  missedCalls: 32,
  totalSMS: 1245,
  responseRate: '94%'
};

export default function PhoneSmsPage() {
  const [activeTab, setActiveTab] = useState('calls');
  const [searchQuery, setSearchQuery] = useState('');
  const [callTypeFilter, setCallTypeFilter] = useState('all');
  const [callStatusFilter, setCallStatusFilter] = useState('all');
  
  // Filter calls based on search query and filters
  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      call.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.number.includes(searchQuery) ||
      call.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = callTypeFilter === 'all' || call.type === callTypeFilter;
    const matchesStatus = callStatusFilter === 'all' || call.status === callStatusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Filter SMS conversations based on search query
  const filteredSmsConversations = smsConversations.filter(conversation => 
    conversation.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.number.includes(searchQuery) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Phone & SMS</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" />
            Make Call
          </Button>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            New SMS
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Missed Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.missedCalls}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total SMS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSMS}</div>
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
      
      <Tabs defaultValue="calls" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="calls">Call History</TabsTrigger>
          <TabsTrigger value="sms">SMS Conversations</TabsTrigger>
          <TabsTrigger value="numbers">Phone Numbers</TabsTrigger>
          <TabsTrigger value="campaigns">SMS Campaigns</TabsTrigger>
        </TabsList>
        
        {/* Call History Tab */}
        <TabsContent value="calls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call History</CardTitle>
              <CardDescription>
                View and manage your call records
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-1 items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search calls..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Date Range
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={callTypeFilter === 'all' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setCallTypeFilter('all')}
                >
                  All Calls
                </Button>
                <Button 
                  variant={callTypeFilter === 'incoming' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setCallTypeFilter('incoming')}
                >
                  <ArrowDownLeft className="mr-1 h-3 w-3" />
                  Incoming
                </Button>
                <Button 
                  variant={callTypeFilter === 'outgoing' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setCallTypeFilter('outgoing')}
                >
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  Outgoing
                </Button>
                <Button 
                  variant={callStatusFilter === 'missed' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setCallStatusFilter(callStatusFilter === 'missed' ? 'all' : 'missed')}
                >
                  <PhoneOff className="mr-1 h-3 w-3" />
                  Missed
                </Button>
              </div>
              
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Contact</th>
                      <th className="py-3 px-4 text-left hidden md:table-cell">Number</th>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-left hidden lg:table-cell">Duration</th>
                      <th className="py-3 px-4 text-left">Date & Time</th>
                      <th className="py-3 px-4 text-left hidden lg:table-cell">Assigned To</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCalls.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-muted-foreground">
                          No calls found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredCalls.map((call) => (
                        <tr key={call.id} className="border-b">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{call.contact}</p>
                              <p className="text-sm text-muted-foreground md:hidden">{call.number}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">{call.number}</td>
                          <td className="py-3 px-4">
                            <Badge variant={call.type === 'incoming' ? 'secondary' : 'outline'}>
                              {call.type === 'incoming' ? (
                                <ArrowDownLeft className="mr-1 h-3 w-3" />
                              ) : (
                                <ArrowUpRight className="mr-1 h-3 w-3" />
                              )}
                              {call.type.charAt(0).toUpperCase() + call.type.slice(1)}
                            </Badge>
                            {call.status === 'missed' && (
                              <Badge variant="destructive" className="ml-2">
                                Missed
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">{call.duration}</td>
                          <td className="py-3 px-4">
                            <div>
                              <p>{call.date}</p>
                              <p className="text-sm text-muted-foreground">{call.time}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            {call.assigned === 'Unassigned' ? (
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                <UserPlus className="mr-1 h-3 w-3" />
                                Assign
                              </Button>
                            ) : (
                              call.assigned
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
        </TabsContent>
        
        {/* SMS Conversations Tab */}
        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMS Conversations</CardTitle>
              <CardDescription>
                View and manage your SMS conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-1 items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    New Conversation
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Contact</th>
                      <th className="py-3 px-4 text-left hidden md:table-cell">Number</th>
                      <th className="py-3 px-4 text-left">Last Message</th>
                      <th className="py-3 px-4 text-left hidden lg:table-cell">Date & Time</th>
                      <th className="py-3 px-4 text-left hidden lg:table-cell">Messages</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSmsConversations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-muted-foreground">
                          No conversations found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredSmsConversations.map((conversation) => (
                        <tr key={conversation.id} className="border-b">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{conversation.contact}</p>
                              <p className="text-sm text-muted-foreground md:hidden">{conversation.number}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">{conversation.number}</td>
                          <td className="py-3 px-4">
                            <div className="max-w-xs truncate">
                              {conversation.unread && (
                                <Badge className="mr-2">New</Badge>
                              )}
                              {conversation.lastMessage}
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            <div>
                              <p>{conversation.date}</p>
                              <p className="text-sm text-muted-foreground">{conversation.time}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            {conversation.messages}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="mr-2 h-3 w-3" />
                              Reply
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
        </TabsContent>
        
        {/* Phone Numbers Tab */}
        <TabsContent value="numbers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Phone Numbers</CardTitle>
                  <CardDescription>
                    Manage your phone numbers and tracking
                  </CardDescription>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Number
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Number</th>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-left hidden md:table-cell">Location</th>
                      <th className="py-3 px-4 text-left hidden lg:table-cell">Assigned To</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left hidden md:table-cell">Usage</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phoneNumbers.map((phoneNumber) => (
                      <tr key={phoneNumber.id} className="border-b">
                        <td className="py-3 px-4 font-medium">{phoneNumber.number}</td>
                        <td className="py-3 px-4">{phoneNumber.type}</td>
                        <td className="py-3 px-4 hidden md:table-cell">{phoneNumber.location}</td>
                        <td className="py-3 px-4 hidden lg:table-cell">{phoneNumber.assignedTo}</td>
                        <td className="py-3 px-4">
                          <Badge variant={phoneNumber.status === 'active' ? 'default' : 'secondary'}>
                            {phoneNumber.status.charAt(0).toUpperCase() + phoneNumber.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              <span>{phoneNumber.calls}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              <span>{phoneNumber.sms}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SMS Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>SMS Campaigns</CardTitle>
                  <CardDescription>
                    Create and manage bulk SMS campaigns
                  </CardDescription>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No campaigns yet</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  Create your first SMS campaign to send bulk messages to your contacts.
                  Track delivery, responses, and engagement.
                </p>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Call Analytics</CardTitle>
            <CardDescription>
              Overview of your call activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] border-2 border-dashed rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Call volume chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Tools and shortcuts for phone and SMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <PhoneCall className="mr-2 h-4 w-4" />
                Make a Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send SMS
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart2 className="mr-2 h-4 w-4" />
                View Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Phone Number
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 