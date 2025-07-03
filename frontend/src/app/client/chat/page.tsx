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
  MessageSquare, 
  Phone, 
  Video, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  Image, 
  Filter, 
  CheckCheck, 
  Users, 
  BarChart2, 
  Settings, 
  PlusCircle,
  MessageCircle,
  Globe
} from 'lucide-react';

// Mock data for conversations
const conversations = [
  {
    id: '1',
    name: 'John Smith',
    avatar: '',
    lastMessage: 'Hi, I\'m interested in your services.',
    time: '10:32 AM',
    unread: 2,
    online: true,
    source: 'website'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: '',
    lastMessage: 'Thanks for the quick response!',
    time: 'Yesterday',
    unread: 0,
    online: false,
    source: 'whatsapp'
  },
  {
    id: '3',
    name: 'Michael Brown',
    avatar: '',
    lastMessage: 'When can we schedule a call?',
    time: 'Yesterday',
    unread: 1,
    online: false,
    source: 'website'
  },
  {
    id: '4',
    name: 'Emily Davis',
    avatar: '',
    lastMessage: 'I need help with my recent order.',
    time: 'Monday',
    unread: 0,
    online: true,
    source: 'whatsapp'
  },
  {
    id: '5',
    name: 'David Wilson',
    avatar: '',
    lastMessage: 'Do you offer discounts for bulk orders?',
    time: 'Monday',
    unread: 0,
    online: false,
    source: 'website'
  }
];

// Mock data for messages in the selected conversation
const messages = [
  {
    id: '1',
    content: 'Hi there! How can I help you today?',
    time: '10:30 AM',
    sender: 'agent',
    status: 'read'
  },
  {
    id: '2',
    content: 'Hi, I\'m interested in your services. Can you tell me more about your pricing?',
    time: '10:31 AM',
    sender: 'customer',
    status: 'read'
  },
  {
    id: '3',
    content: 'Of course! We offer several packages starting at $99/month. Would you like me to send you our detailed pricing guide?',
    time: '10:32 AM',
    sender: 'agent',
    status: 'sent'
  },
  {
    id: '4',
    content: 'That would be great, thank you!',
    time: '10:32 AM',
    sender: 'customer',
    status: 'read'
  },
  {
    id: '5',
    content: 'Here\'s our pricing guide. Let me know if you have any questions!',
    time: '10:33 AM',
    sender: 'agent',
    status: 'sent',
    attachment: {
      type: 'pdf',
      name: 'pricing_guide.pdf',
      size: '2.4 MB'
    }
  }
];

// Mock data for stats
const stats = {
  totalConversations: 127,
  activeConversations: 24,
  averageResponseTime: '2m 34s',
  satisfactionRate: '94%'
};

// Mock data for team members
const teamMembers = [
  { id: '1', name: 'Alex Johnson', avatar: '', status: 'online', role: 'Support Agent' },
  { id: '2', name: 'Maria Garcia', avatar: '', status: 'away', role: 'Sales Representative' },
  { id: '3', name: 'James Wilson', avatar: '', status: 'offline', role: 'Support Manager' }
];

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  
  // Filter conversations based on search query and source
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = 
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSource = sourceFilter === 'all' || conversation.source === sourceFilter;
    
    return matchesSearch && matchesSource;
  });
  
  // Get the selected conversation
  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (messageText.trim() === '') return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', messageText);
    
    // Clear the input
    setMessageText('');
  };
  
  // Handle pressing Enter to send a message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Chat Widget
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConversations}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageResponseTime}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Satisfaction Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.satisfactionRate}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Conversations</CardTitle>
              <Tabs defaultValue="all" className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all" onClick={() => setSourceFilter('all')}>All</TabsTrigger>
                  <TabsTrigger value="unread" onClick={() => setSourceFilter('all')}>Unread</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2">
                <Button 
                  variant={sourceFilter === 'all' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSourceFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={sourceFilter === 'website' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSourceFilter('website')}
                >
                  <Globe className="mr-1 h-3 w-3" />
                  Website
                </Button>
                <Button 
                  variant={sourceFilter === 'whatsapp' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSourceFilter('whatsapp')}
                >
                  <MessageCircle className="mr-1 h-3 w-3" />
                  WhatsApp
                </Button>
              </div>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100vh-22rem)] overflow-y-auto">
            <div className="space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No conversations found.</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                      selectedConversation === conversation.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {conversation.name.charAt(0)}
                      </div>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className={`font-medium truncate ${conversation.unread ? 'font-bold' : ''}`}>
                          {conversation.name}
                        </p>
                        <span className={`text-xs ${
                          selectedConversation === conversation.id 
                            ? 'text-primary-foreground' 
                            : 'text-muted-foreground'
                        }`}>
                          {conversation.time}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate ${
                          selectedConversation === conversation.id 
                            ? 'text-primary-foreground' 
                            : 'text-muted-foreground'
                        }`}>
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <Badge variant="default" className="ml-2">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1">
                        <Badge variant={conversation.source === 'website' ? "outline" : "secondary"} className="text-xs">
                          {conversation.source === 'website' ? 'Website Chat' : 'WhatsApp'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="pb-2 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {selectedConversationData?.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle>{selectedConversationData?.name}</CardTitle>
                      <CardDescription>
                        {selectedConversationData?.online ? 'Online' : 'Last seen recently'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100vh-26rem)] overflow-y-auto">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'agent' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'agent' 
                            ? 'bg-muted' 
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        <p>{message.content}</p>
                        {message.attachment && (
                          <div className="mt-2 p-2 bg-background rounded flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded">
                              <Image className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{message.attachment.name}</p>
                              <p className="text-xs text-muted-foreground">{message.attachment.size}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                          {message.sender === 'agent' && (
                            <CheckCheck className={`h-3 w-3 ${
                              message.status === 'read' ? 'text-blue-500' : 'text-muted-foreground'
                            }`} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t p-3">
                <div className="flex items-center gap-2 w-full">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="relative flex-1">
                    <Input 
                      placeholder="Type a message..." 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="pr-10"
                    />
                    <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={messageText.trim() === ''}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-22rem)]">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No conversation selected</h3>
              <p className="text-muted-foreground">Select a conversation from the list to start chatting</p>
            </div>
          )}
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Active agents who can respond to chats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Badge variant={
                    member.status === 'online' ? 'default' : 
                    member.status === 'away' ? 'secondary' : 'outline'
                  }>
                    {member.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Users className="mr-2 h-4 w-4" />
              Manage Team
            </Button>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Tools and settings for your chat system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="flex flex-col h-24 w-full">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span>Chat Widgets</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-24 w-full">
                <MessageCircle className="h-6 w-6 mb-2" />
                <span>WhatsApp Setup</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-24 w-full">
                <BarChart2 className="h-6 w-6 mb-2" />
                <span>Analytics</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-24 w-full">
                <Settings className="h-6 w-6 mb-2" />
                <span>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 