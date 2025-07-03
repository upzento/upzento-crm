'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Code, 
  Globe,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Mock form data for development
const mockForm = {
  id: '123',
  name: 'Contact Form',
  description: 'Simple contact form for website',
  status: 'ACTIVE',
  settings: {
    theme: 'cosmic',
    primaryColor: '#3498db',
    secondaryColor: '#2ecc71',
  },
  domains: [
    { id: '1', domain: 'example.com', status: 'VERIFIED' },
    { id: '2', domain: 'mywebsite.com', status: 'VERIFIED' },
    { id: '3', domain: 'testsite.org', status: 'PENDING' },
  ],
};

export default function FormEmbedPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState(mockForm);
  const [copied, setCopied] = useState(false);
  const [embedType, setEmbedType] = useState('iframe');
  const [embedOptions, setEmbedOptions] = useState({
    width: '100%',
    height: '500px',
    showBorder: false,
    autoResize: true,
    scrolling: false,
  });
  
  // Function to generate iframe embed code
  const generateIframeCode = () => {
    const { width, height, showBorder, scrolling } = embedOptions;
    return `<iframe 
  src="https://upzento.com/embed/forms/${params.id}" 
  width="${width}" 
  height="${height}" 
  style="${showBorder ? '' : 'border: none;'}" 
  ${scrolling ? '' : 'scrolling="no"'}
  title="${form.name}"
  allow="camera; microphone; geolocation"
></iframe>`;
  };
  
  // Function to generate JavaScript embed code
  const generateJsCode = () => {
    return `<div id="upzento-form-${params.id}"></div>
<script>
  (function(u,p,z,e,n,t,o) {
    u['UpzentoObject']=n;u[n]=u[n]||function(){
    (u[n].q=u[n].q||[]).push(arguments)},u[n].l=1*new Date();
    t=p.createElement(z),o=p.getElementsByTagName(z)[0];
    t.async=1;t.src=e;o.parentNode.insertBefore(t,o)
  })(window,document,'script','https://upzento.com/embed/forms.js','upzento');
  
  upzento('init', '${params.id}', {
    container: 'upzento-form-${params.id}',
    autoResize: ${embedOptions.autoResize},
    theme: '${form.settings.theme}'
  });
</script>`;
  };
  
  // Get the appropriate embed code based on selected type
  const getEmbedCode = () => {
    return embedType === 'iframe' ? generateIframeCode() : generateJsCode();
  };
  
  // Function to copy embed code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopied(true);
    
    toast({
      title: "Code copied!",
      description: "Embed code copied to clipboard.",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  // Function to handle domain verification
  const handleVerifyDomain = (domainId: string) => {
    // In a real app, this would trigger the domain verification process
    toast({
      title: "Verification initiated",
      description: "Check your domain settings for verification instructions.",
    });
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/forms')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Forms
          </Button>
          <h1 className="text-3xl font-bold">Embed Form: {form.name}</h1>
        </div>
        <Button variant="outline" onClick={() => router.push(`/dashboard/forms/${params.id}/preview`)}>
          Preview Form
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Embed Options */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Embed Options</CardTitle>
              <CardDescription>
                Customize how your form will appear on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="embed-type">Embed Type</Label>
                <Select value={embedType} onValueChange={setEmbedType}>
                  <SelectTrigger id="embed-type">
                    <SelectValue placeholder="Select embed type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iframe">
                      <div className="flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        <span>iFrame Embed</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="js">
                      <div className="flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        <span>JavaScript Embed</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {embedType === 'iframe' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="width">Width</Label>
                    <Select 
                      value={embedOptions.width} 
                      onValueChange={(value) => setEmbedOptions({...embedOptions, width: value})}
                    >
                      <SelectTrigger id="width">
                        <SelectValue placeholder="Select width" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100%">100% (Responsive)</SelectItem>
                        <SelectItem value="500px">500px</SelectItem>
                        <SelectItem value="600px">600px</SelectItem>
                        <SelectItem value="700px">700px</SelectItem>
                        <SelectItem value="800px">800px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Select 
                      value={embedOptions.height} 
                      onValueChange={(value) => setEmbedOptions({...embedOptions, height: value})}
                    >
                      <SelectTrigger id="height">
                        <SelectValue placeholder="Select height" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="400px">400px</SelectItem>
                        <SelectItem value="500px">500px</SelectItem>
                        <SelectItem value="600px">600px</SelectItem>
                        <SelectItem value="700px">700px</SelectItem>
                        <SelectItem value="800px">800px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-border">Show Border</Label>
                    <Switch
                      id="show-border"
                      checked={embedOptions.showBorder}
                      onCheckedChange={(checked) => setEmbedOptions({...embedOptions, showBorder: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="scrolling">Enable Scrolling</Label>
                    <Switch
                      id="scrolling"
                      checked={embedOptions.scrolling}
                      onCheckedChange={(checked) => setEmbedOptions({...embedOptions, scrolling: checked})}
                    />
                  </div>
                </>
              )}
              
              {embedType === 'js' && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-resize">Auto Resize</Label>
                  <Switch
                    id="auto-resize"
                    checked={embedOptions.autoResize}
                    onCheckedChange={(checked) => setEmbedOptions({...embedOptions, autoResize: checked})}
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Domain Verification */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Authorized Domains</CardTitle>
              <CardDescription>
                Forms can only be embedded on verified domains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {form.domains.map(domain => (
                  <div key={domain.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{domain.domain}</span>
                    </div>
                    {domain.status === 'VERIFIED' ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVerifyDomain(domain.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Verify
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard/settings/domains')}>
                Manage Domains
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Embed Code */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Embed Code</CardTitle>
              <CardDescription>
                Copy and paste this code into your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                  <code>{getEmbedCode()}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                {embedType === 'iframe' 
                  ? 'The iframe embed is simpler but has less customization options.'
                  : 'The JavaScript embed provides more features like auto-resizing.'}
              </p>
              <Button variant="outline" size="sm" onClick={() => window.open(`https://upzento.com/embed/forms/${params.id}`, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Direct Link
              </Button>
            </CardFooter>
          </Card>
          
          {/* Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Embedding Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">1. Copy the embed code</h3>
                  <p className="text-muted-foreground">
                    Click the copy button in the top-right corner of the code block above.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">2. Paste into your website</h3>
                  <p className="text-muted-foreground">
                    Paste the code into the HTML of your website where you want the form to appear.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">3. Verify your domain</h3>
                  <p className="text-muted-foreground">
                    Make sure your domain is verified to allow embedding. Forms will only work on verified domains.
                  </p>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <h3 className="font-medium text-amber-800 mb-2">Important Note</h3>
                  <p className="text-amber-700 text-sm">
                    For security reasons, your form can only be embedded on domains you've verified in your account settings.
                    If you need to add a new domain, go to Settings â Domains.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 