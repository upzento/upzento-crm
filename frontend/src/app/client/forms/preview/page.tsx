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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Code,
  Copy,
  Check,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

// Mock form data
const mockForm = {
  id: '1',
  name: 'Contact Form',
  description: 'Please fill out this form and we will get back to you as soon as possible.',
  fields: [
    {
      id: '1',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      options: []
    },
    {
      id: '2',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      required: true,
      options: []
    },
    {
      id: '3',
      type: 'phone',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      required: false,
      options: []
    },
    {
      id: '4',
      type: 'select',
      label: 'Subject',
      placeholder: 'Select a subject',
      required: true,
      options: [
        { id: '1', label: 'General Inquiry', value: 'general' },
        { id: '2', label: 'Technical Support', value: 'support' },
        { id: '3', label: 'Billing Question', value: 'billing' },
        { id: '4', label: 'Feature Request', value: 'feature' }
      ]
    },
    {
      id: '5',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Enter your message',
      required: true,
      options: []
    },
    {
      id: '6',
      type: 'checkbox',
      label: 'Preferences',
      placeholder: '',
      required: false,
      options: [
        { id: '1', label: 'Subscribe to newsletter', value: 'newsletter' },
        { id: '2', label: 'Receive product updates', value: 'updates' }
      ]
    }
  ],
  settings: {
    submitButtonText: 'Submit',
    successMessage: 'Thank you for your submission!',
    redirectUrl: '',
    enableCaptcha: true,
    notifyEmail: 'notifications@example.com',
    theme: 'cosmic'
  },
  domains: [
    'example.com',
    'mywebsite.com'
  ]
};

// Embed code template
const getEmbedCode = (formId: string) => {
  return `<script src="https://upzento.com/forms/embed/${formId}.js" async></script>
<div id="upzento-form-${formId}" data-form-id="${formId}"></div>`;
};

// Iframe code template
const getIframeCode = (formId: string) => {
  return `<iframe src="https://upzento.com/forms/embed/${formId}" width="100%" height="600" frameborder="0"></iframe>`;
};

export default function FormPreviewPage() {
  const [activeTab, setActiveTab] = useState('preview');
  const [deviceView, setDeviceView] = useState('desktop');
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  // Handle form input change
  const handleInputChange = (fieldId: string, value: any) => {
    setFormData({
      ...formData,
      [fieldId]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Form submitted successfully!\n\n' + JSON.stringify(formData, null, 2));
  };
  
  // Copy code to clipboard
  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };
  
  // Render form fields
  const renderFormField = (field: any) => {
    switch (field.type) {
      case 'text':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        );
      
      case 'email':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="email"
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        );
      
      case 'phone':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="tel"
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <select
              id={field.id}
              className="w-full border rounded-md px-3 py-2"
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {field.options.map((option: any) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2" key={field.id}>
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options.map((option: any) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`${field.id}-${option.id}`}
                    checked={formData[`${field.id}-${option.id}`] || false}
                    onChange={(e) => handleInputChange(`${field.id}-${option.id}`, e.target.checked)}
                  />
                  <Label htmlFor={`${field.id}-${option.id}`} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2" key={field.id}>
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options.map((option: any) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`${field.id}-${option.id}`}
                    name={field.id}
                    value={option.value}
                    checked={formData[field.id] === option.value}
                    onChange={(e) => handleInputChange(field.id, option.value)}
                    required={field.required}
                  />
                  <Label htmlFor={`${field.id}-${option.id}`} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/client/forms">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{mockForm.name}</h1>
      </div>
      
      <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="embed">Embed Code</TabsTrigger>
          <TabsTrigger value="domains">Allowed Domains</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Form Preview</CardTitle>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <Button
                    variant={deviceView === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setDeviceView('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={deviceView === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setDeviceView('tablet')}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={deviceView === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setDeviceView('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Preview how your form will appear to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`mx-auto border rounded-md p-6 ${
                  deviceView === 'mobile' ? 'max-w-[375px]' : 
                  deviceView === 'tablet' ? 'max-w-[768px]' : 
                  'max-w-full'
                }`}
              >
                <div className={`space-y-6 ${mockForm.settings.theme === 'cosmic' ? 'bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-6 rounded-lg' : ''}`}>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{mockForm.name}</h2>
                    <p className="text-muted-foreground">{mockForm.description}</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mockForm.fields.map(renderFormField)}
                    
                    {mockForm.settings.enableCaptcha && (
                      <div className="border rounded p-4 bg-slate-50 flex items-center justify-center h-[78px] text-center text-sm text-muted-foreground">
                        CAPTCHA verification would appear here
                      </div>
                    )}
                    
                    <Button type="submit" className="w-full">
                      {mockForm.settings.submitButtonText}
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="embed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Embed Options</CardTitle>
              <CardDescription>
                Choose how to embed this form on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">JavaScript Embed</h3>
                <p className="text-sm text-muted-foreground">
                  Add this code to your website to embed the form. This is the recommended method as it provides the best user experience.
                </p>
                <div className="relative">
                  <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md overflow-x-auto">
                    <code>{getEmbedCode(mockForm.id)}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(getEmbedCode(mockForm.id), 'js')}
                  >
                    {copied === 'js' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Iframe Embed</h3>
                <p className="text-sm text-muted-foreground">
                  Alternatively, you can use an iframe to embed the form. This method is simpler but provides fewer customization options.
                </p>
                <div className="relative">
                  <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md overflow-x-auto">
                    <code>{getIframeCode(mockForm.id)}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(getIframeCode(mockForm.id), 'iframe')}
                  >
                    {copied === 'iframe' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Direct Link</h3>
                <div className="flex items-center gap-2">
                  <Input 
                    value={`https://upzento.com/forms/embed/${mockForm.id}`} 
                    readOnly
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(`https://upzento.com/forms/embed/${mockForm.id}`, 'link')}
                  >
                    {copied === 'link' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={`/forms/embed/${mockForm.id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Allowed Domains</CardTitle>
              <CardDescription>
                Control which domains can embed this form
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm">
                  For security reasons, your form can only be embedded on the domains you specify below. 
                  The form will not load on any other domains.
                </p>
                
                <div className="space-y-2">
                  {mockForm.domains.map((domain, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{domain}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <Input placeholder="Add a new domain (e.g., example.com)" />
                  <Button>Add</Button>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm">
                  <p className="font-medium text-yellow-800">Important</p>
                  <p className="text-yellow-700">
                    Forms will always work on your Upzento dashboard and preview pages regardless of domain settings.
                    Domain restrictions only apply to embedded forms on external websites.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 