'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormEmbed } from '@/components/forms/form-embed';
import { formService } from '@/lib/services/form-service';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function FormPreviewPage() {
  const params = useParams();
  const formId = params.id as string;
  const [activeTab, setActiveTab] = useState('preview');

  const handleCopyEmbed = async (type: 'iframe' | 'script') => {
    try {
      const code = type === 'iframe' 
        ? formService.getEmbedCode(formId)
        : formService.getEmbedScript(formId);
      
      await navigator.clipboard.writeText(code);
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
          <h1 className="text-2xl font-bold">Form Preview</h1>
          <p className="text-muted-foreground">Preview and get embed code for your form</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleCopyEmbed('iframe')}>
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
                <FormEmbed formId={formId} mode="preview" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embed">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>IFrame Embed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Copy and paste this code into your website where you want the form to appear.
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{formService.getEmbedCode(formId)}</code>
                  </pre>
                  <Button onClick={() => handleCopyEmbed('iframe')}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>JavaScript Embed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    For more flexibility, use our JavaScript embed code. This allows the form to adapt to your website's styles.
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{formService.getEmbedScript(formId)}</code>
                  </pre>
                  <Button onClick={() => handleCopyEmbed('script')}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Domain Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  For security reasons, you need to verify your domain before embedding the form.
                  Add this TXT record to your domain's DNS settings:
                </p>
                <pre className="bg-muted p-4 rounded-lg mt-4 overflow-x-auto">
                  <code>upzento-verify={formId}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 