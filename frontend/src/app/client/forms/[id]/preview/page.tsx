'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MultiStepFormRenderer } from '@/components/forms/multi-step-form-renderer';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data - replace with API call
const mockForm = {
  id: '1',
  name: 'Contact Form',
  description: 'Contact form for customer inquiries',
  steps: [
    {
      id: 'step-1',
      title: 'Contact Information',
      description: 'Please provide your contact details',
      layout: 'grid',
      alignment: 'left',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your name',
          required: true,
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
        },
        {
          id: 'phone',
          type: 'phone',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          required: false,
        },
      ],
    },
    {
      id: 'step-2',
      title: 'Message',
      description: 'What would you like to tell us?',
      layout: 'rows',
      alignment: 'left',
      fields: [
        {
          id: 'subject',
          type: 'text',
          label: 'Subject',
          placeholder: 'Enter message subject',
          required: true,
        },
        {
          id: 'message',
          type: 'textarea',
          label: 'Message',
          placeholder: 'Enter your message',
          required: true,
        },
      ],
    },
  ],
};

export default function FormPreviewPage() {
  const params = useParams();
  const formId = params.id as string;
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('preview');

  const handleFormSubmit = async (data: any) => {
    // TODO: Implement form submission
    console.log('Form submitted:', data);
    toast({
      title: 'Success',
      description: 'Form submitted successfully!',
    });
  };

  const getEmbedCode = () => {
    return `<iframe
  src="https://app.upzento.com/embed/forms/${formId}"
  width="100%"
  height="600"
  frameborder="0"
></iframe>`;
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedCode());
      toast({
        title: 'Success',
        description: 'Embed code copied to clipboard!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy embed code',
        variant: 'destructive',
      });
    }
  };

  const handleOpenInNewTab = () => {
    window.open(`/embed/forms/${formId}`, '_blank');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{mockForm.name}</h1>
          <p className="text-muted-foreground">{mockForm.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyEmbed}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Embed Code
          </Button>
          <Button variant="outline" onClick={handleOpenInNewTab}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="embed">Embed Code</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card>
            <CardContent className="p-6">
              <div className="max-w-2xl mx-auto">
                <MultiStepFormRenderer
                  steps={mockForm.steps}
                  onSubmit={handleFormSubmit}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embed">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Copy and paste this code into your website where you want the form to appear.
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{getEmbedCode()}</code>
                </pre>
                <div className="flex gap-2">
                  <Button onClick={handleCopyEmbed}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 