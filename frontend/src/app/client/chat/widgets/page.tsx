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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  ExternalLink, 
  Code, 
  Copy, 
  Check, 
  MessageSquare, 
  Palette, 
  Settings, 
  Users, 
  Clock, 
  PlusCircle,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';

// Mock data for chat widgets
const widgets = [
  {
    id: '1',
    name: 'Main Website Chat',
    type: 'Floating Button',
    embedCount: 1,
    views: 1245,
    conversations: 87,
    created: '2023-05-10',
    status: 'active',
    domains: ['example.com'],
    settings: {
      theme: 'light',
      position: 'bottom-right',
      primaryColor: '#4f46e5',
      welcomeMessage: 'Hi there! How can we help you today?',
      offlineMessage: 'We\'re currently offline. Leave a message and we\'ll get back to you as soon as possible.',
      showAgentNames: true,
      collectEmail: true
    }
  },
  {
    id: '2',
    name: 'Product Support Chat',
    type: 'Embedded',
    embedCount: 3,
    views: 876,
    conversations: 45,
    created: '2023-05-15',
    status: 'active',
    domains: ['example.com', 'store.example.com'],
    settings: {
      theme: 'dark',
      position: 'inline',
      primaryColor: '#10b981',
      welcomeMessage: 'Need help with our products? Chat with our support team!',
      offlineMessage: 'Our support team is offline. Please leave your question and contact details.',
      showAgentNames: true,
      collectEmail: true
    }
  },
  {
    id: '3',
    name: 'Sales Inquiry Chat',
    type: 'Floating Button',
    embedCount: 2,
    views: 543,
    conversations: 32,
    created: '2023-05-20',
    status: 'inactive',
    domains: ['blog.example.com'],
    settings: {
      theme: 'auto',
      position: 'bottom-left',
      primaryColor: '#f59e0b',
      welcomeMessage: 'Interested in our services? Chat with our sales team now!',
      offlineMessage: 'Our sales team is currently unavailable. Leave your contact info and we\'ll reach out soon.',
      showAgentNames: false,
      collectEmail: true
    }
  }
];

export default function ChatWidgetsPage() {
  const [activeTab, setActiveTab] = useState('widgets');
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Function to handle code copying
  const handleCopyCode = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  // Get the selected widget data
  const selectedWidgetData = widgets.find(widget => widget.id === selectedWidget);
  
  // Generate embed code for the selected widget
  const generateEmbedCode = (widget: typeof widgets[0]) => {
    return `<script>
  (function() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://upzento.com/widgets/chat/${widget.id}.js';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })();
</script>
<div id="upzento-chat-${widget.id}" data-theme="${widget.settings.theme}" data-position="${widget.settings.position}"></div>`;
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Chat Widgets</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Widget
        </Button>
      </div>
      
      <Tabs defaultValue="widgets" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="widgets">My Widgets</TabsTrigger>
          <TabsTrigger value="create">Create Widget</TabsTrigger>
        </TabsList>
        
        <TabsContent value="widgets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map((widget) => (
              <Card key={widget.id} className={selectedWidget === widget.id ? 'border-primary' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{widget.name}</CardTitle>
                      <CardDescription>{widget.type}</CardDescription>
                    </div>
                    <div 
                      className="w-8 h-8 rounded-full" 
                      style={{ backgroundColor: widget.settings.primaryColor }}
                    />
                  </div>
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
                      <span className="text-muted-foreground">Conversations:</span>
                      <span>{widget.conversations}</span>
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
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Domains:</span>
                      <span>{widget.domains.length}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Preview
                  </Button>
                  <Button 
                    variant={selectedWidget === widget.id ? "default" : "outline"} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedWidget(widget.id)}
                  >
                    <Code className="mr-2 h-3 w-3" />
                    Embed
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {selectedWidget && (
            <Card>
              <CardHeader>
                <CardTitle>Embed {selectedWidgetData?.name}</CardTitle>
                <CardDescription>
                  Copy this code to embed the chat widget on your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md relative">
                  <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                    {generateEmbedCode(selectedWidgetData!)}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={handleCopyCode}
                  >
                    {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Authorized Domains</h3>
                  <p className="text-sm text-muted-foreground">
                    This widget can only be embedded on the following domains:
                  </p>
                  <div className="space-y-2">
                    {selectedWidgetData?.domains.map((domain, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <span>{domain}</span>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Add a new domain (e.g., example.com)" />
                    <Button>Add</Button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedWidget(null)}>
                    Close
                  </Button>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Widget
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Chat Widget</CardTitle>
              <CardDescription>
                Configure your chat widget and generate embed code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="widgetName">Widget Name</Label>
                  <Input id="widgetName" placeholder="e.g., Main Website Chat" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="widgetType">Widget Type</Label>
                  <select id="widgetType" className="w-full border rounded-md px-3 py-2">
                    <option value="floating">Floating Button</option>
                    <option value="embedded">Embedded</option>
                    <option value="popup">Popup</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <select id="theme" className="w-full border rounded-md px-3 py-2">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (Match Website)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <select id="position" className="w-full border rounded-md px-3 py-2">
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="inline">Inline (Embedded)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input id="primaryColor" type="text" defaultValue="#4f46e5" />
                      <div className="w-10 h-10 rounded border" style={{ backgroundColor: '#4f46e5' }} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Messages</h3>
                  <div className="space-y-2">
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Input id="welcomeMessage" defaultValue="Hi there! How can we help you today?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offlineMessage">Offline Message</Label>
                    <Input id="offlineMessage" defaultValue="We're currently offline. Leave a message and we'll get back to you as soon as possible." />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="showAgentNames">Show Agent Names</Label>
                        <p className="text-sm text-muted-foreground">
                          Display agent names in chat conversations
                        </p>
                      </div>
                      <Switch id="showAgentNames" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="collectEmail">Collect Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Ask visitors for their email before starting chat
                        </p>
                      </div>
                      <Switch id="collectEmail" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="offlineSupport">Offline Support</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow visitors to leave messages when agents are offline
                        </p>
                      </div>
                      <Switch id="offlineSupport" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="fileSharing">File Sharing</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow visitors to send files during chat
                        </p>
                      </div>
                      <Switch id="fileSharing" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Authorized Domains</h3>
                  <p className="text-sm text-muted-foreground">
                    Add domains where this widget can be embedded
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <span>example.com</span>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Add a new domain (e.g., example.com)" />
                    <Button>Add</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Widget</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 