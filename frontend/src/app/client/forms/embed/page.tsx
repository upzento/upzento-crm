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
  MoreHorizontal,
  Copy,
  ExternalLink,
  Globe,
  Check,
  Plus,
  Trash2,
  Code,
  Eye,
  Settings,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

// Mock data for embeddable forms
const embedForms = [
  {
    id: '1',
    name: 'Contact Form',
    submissions: 24,
    lastSubmission: '2 hours ago',
    created: '2023-05-15',
    status: 'active',
    domains: ['example.com', 'mywebsite.com'],
    embedCode: '<script src="https://upzento.com/forms/embed/1.js" async></script>\n<div id="upzento-form-1" data-form-id="1"></div>'
  },
  {
    id: '2',
    name: 'Newsletter Signup',
    submissions: 187,
    lastSubmission: '5 minutes ago',
    created: '2023-04-22',
    status: 'active',
    domains: ['example.com'],
    embedCode: '<script src="https://upzento.com/forms/embed/2.js" async></script>\n<div id="upzento-form-2" data-form-id="2"></div>'
  },
  {
    id: '3',
    name: 'Product Feedback',
    submissions: 56,
    lastSubmission: '1 day ago',
    created: '2023-06-10',
    status: 'active',
    domains: ['mywebsite.com', 'blog.example.com'],
    embedCode: '<script src="https://upzento.com/forms/embed/3.js" async></script>\n<div id="upzento-form-3" data-form-id="3"></div>'
  },
  {
    id: '4',
    name: 'Event Registration',
    submissions: 42,
    lastSubmission: '3 days ago',
    created: '2023-07-05',
    status: 'inactive',
    domains: ['events.example.com'],
    embedCode: '<script src="https://upzento.com/forms/embed/4.js" async></script>\n<div id="upzento-form-4" data-form-id="4"></div>'
  },
  {
    id: '5',
    name: 'Support Request',
    submissions: 18,
    lastSubmission: '1 week ago',
    created: '2023-03-18',
    status: 'active',
    domains: ['support.example.com', 'help.example.com'],
    embedCode: '<script src="https://upzento.com/forms/embed/5.js" async></script>\n<div id="upzento-form-5" data-form-id="5"></div>'
  }
];

export default function FormsEmbedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  
  // Filter forms based on search query
  const filteredForms = embedForms.filter(form => 
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.domains.some(domain => domain.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Get the selected form data
  const selectedFormData = embedForms.find(form => form.id === selectedForm);
  
  // Copy embed code to clipboard
  const copyEmbedCode = (code: string, formId: string) => {
    navigator.clipboard.writeText(code);
    setCopied(formId);
    setTimeout(() => setCopied(null), 2000);
  };
  
  // Add domain to form
  const addDomain = () => {
    // In a real application, this would make an API call
    console.log(`Adding domain ${newDomain} to form ${selectedForm}`);
    setNewDomain('');
  };
  
  // Remove domain from form
  const removeDomain = (domain: string) => {
    // In a real application, this would make an API call
    console.log(`Removing domain ${domain} from form ${selectedForm}`);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/client/forms">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Form Embedding</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Forms List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Embeddable Forms</CardTitle>
              <CardDescription>
                Manage your forms that can be embedded on websites
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search forms..."
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
                      <TableHead>Form Name</TableHead>
                      <TableHead>Domains</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredForms.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No forms found matching your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredForms.map((form) => (
                        <TableRow 
                          key={form.id}
                          className={selectedForm === form.id ? 'bg-muted/50' : ''}
                          onClick={() => setSelectedForm(form.id)}
                        >
                          <TableCell className="font-medium">{form.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {form.domains.map((domain, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {domain}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{form.submissions}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              form.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {form.status}
                            </span>
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
                                <DropdownMenuItem onClick={() => copyEmbedCode(form.embedCode, form.id)}>
                                  {copied === form.id ? (
                                    <>
                                      <Check className="mr-2 h-4 w-4" /> Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="mr-2 h-4 w-4" /> Copy Embed Code
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ExternalLink className="mr-2 h-4 w-4" /> Preview Form
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="mr-2 h-4 w-4" /> Edit Settings
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
        </div>
        
        {/* Form Embed Details */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Embed Settings</CardTitle>
              <CardDescription>
                Configure how your form is embedded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedFormData ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">{selectedFormData.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedFormData.status === 'active' ? 'default' : 'destructive'}>
                        {selectedFormData.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedFormData.submissions} submissions
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Embed Code</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyEmbedCode(selectedFormData.embedCode, selectedFormData.id)}
                      >
                        {copied === selectedFormData.id ? (
                          <>
                            <Check className="mr-2 h-4 w-4" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" /> Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md overflow-x-auto text-xs">
                      <code>{selectedFormData.embedCode}</code>
                    </pre>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Allowed Domains</h3>
                      <Badge variant="outline" className="text-xs">
                        {selectedFormData.domains.length} domains
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {selectedFormData.domains.map((domain, index) => (
                        <div key={index} className="flex items-center justify-between py-1 px-2 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span>{domain}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => removeDomain(domain)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Add domain (e.g., example.com)" 
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                      />
                      <Button size="sm" onClick={addDomain}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Domain Verification</p>
                        <p className="text-yellow-700">
                          Forms will only work on the domains listed above. This helps protect your forms from unauthorized embedding.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span>CAPTCHA Protection: {selectedFormData.status === 'active' ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/client/forms/preview?id=${selectedFormData.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Code className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Form Selected</h3>
                  <p>Select a form from the list to view embed settings.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 