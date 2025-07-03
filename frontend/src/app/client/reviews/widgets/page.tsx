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
  Star, 
  Sliders, 
  Grid3X3, 
  LayoutGrid 
} from 'lucide-react';

// Mock data for widgets
const widgets = [
  {
    id: '1',
    name: 'Main Website Reviews',
    type: 'Slider',
    embedCount: 1,
    views: 1245,
    created: '2023-05-10',
    status: 'active',
    domains: ['example.com'],
    settings: {
      theme: 'light',
      showRating: true,
      maxReviews: 10,
      autoplay: true,
      interval: 5000
    }
  },
  {
    id: '2',
    name: 'Product Page Reviews',
    type: 'Grid',
    embedCount: 3,
    views: 876,
    created: '2023-05-15',
    status: 'active',
    domains: ['example.com', 'store.example.com'],
    settings: {
      theme: 'dark',
      showRating: true,
      maxReviews: 6,
      autoplay: false,
      interval: 0
    }
  },
  {
    id: '3',
    name: 'Testimonials Widget',
    type: 'Carousel',
    embedCount: 2,
    views: 543,
    created: '2023-05-20',
    status: 'inactive',
    domains: ['blog.example.com'],
    settings: {
      theme: 'auto',
      showRating: true,
      maxReviews: 5,
      autoplay: true,
      interval: 7000
    }
  }
];

export default function ReviewWidgetsPage() {
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
    s.src = 'https://upzento.com/widgets/reviews/${widget.id}.js';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })();
</script>
<div id="upzento-reviews-${widget.id}" data-theme="${widget.settings.theme}"></div>`;
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Review Widgets</h1>
        <Button>Create New Widget</Button>
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
                    {widget.type === 'Slider' && <Sliders className="h-5 w-5 text-muted-foreground" />}
                    {widget.type === 'Grid' && <LayoutGrid className="h-5 w-5 text-muted-foreground" />}
                    {widget.type === 'Carousel' && <Grid3X3 className="h-5 w-5 text-muted-foreground" />}
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
                  Copy this code to embed the review widget on your website
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
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Review Widget</CardTitle>
              <CardDescription>
                Configure your review widget and generate embed code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="widgetName">Widget Name</Label>
                  <Input id="widgetName" placeholder="e.g., Homepage Testimonials" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="widgetType">Widget Type</Label>
                  <select id="widgetType" className="w-full border rounded-md px-3 py-2">
                    <option value="slider">Slider</option>
                    <option value="grid">Grid</option>
                    <option value="carousel">Carousel</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Settings</h3>
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
                    <Label htmlFor="maxReviews">Maximum Reviews</Label>
                    <Input id="maxReviews" type="number" defaultValue="5" min="1" max="50" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showRating">Show Ratings</Label>
                      <p className="text-sm text-muted-foreground">
                        Display star ratings with reviews
                      </p>
                    </div>
                    <Switch id="showRating" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoplay">Autoplay</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically cycle through reviews
                      </p>
                    </div>
                    <Switch id="autoplay" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="interval">Autoplay Interval (ms)</Label>
                    <Input id="interval" type="number" defaultValue="5000" min="1000" step="1000" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Review Filtering</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="minRating">Minimum Rating</Label>
                      <p className="text-sm text-muted-foreground">
                        Only show reviews with this rating or higher
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          className={`h-5 w-5 cursor-pointer ${
                            rating <= 3 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showResponses">Show Responses</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your responses to reviews
                      </p>
                    </div>
                    <Switch id="showResponses" defaultChecked />
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