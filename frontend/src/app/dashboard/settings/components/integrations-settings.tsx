'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Check, X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'PENDING';
  apiKey?: string;
  webhookUrl?: string;
  settings?: Record<string, any>;
}

const integrationCategories = [
  { id: 'calendar', name: 'Calendar & Meetings' },
  { id: 'communication', name: 'Communication' },
  { id: 'payment', name: 'Payment' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'marketing', name: 'Marketing' },
];

const integrationTypes = {
  calendar: ['GOOGLE_CALENDAR', 'OUTLOOK_CALENDAR', 'ZOOM', 'TEAMS'],
  communication: ['TWILIO', 'VONAGE', 'WHATSAPP'],
  payment: ['STRIPE', 'PAYPAL'],
  analytics: ['GOOGLE_ANALYTICS', 'FACEBOOK', 'INSTAGRAM'],
  marketing: ['MAILCHIMP', 'SENDGRID'],
};

export default function IntegrationsSettings() {
  const [activeCategory, setActiveCategory] = useState('calendar');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIntegrationType, setSelectedIntegrationType] = useState('');
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/settings/integrations');
      setIntegrations(response.data);
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load integrations. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIntegration = async () => {
    try {
      await apiClient.post('/settings/integrations', {
        name: newIntegration.name,
        type: selectedIntegrationType,
        apiKey: newIntegration.apiKey,
        apiSecret: newIntegration.apiSecret,
        webhookUrl: newIntegration.webhookUrl,
      });

      toast({
        title: 'Success',
        description: 'Integration added successfully.',
      });

      setIsDialogOpen(false);
      setNewIntegration({
        name: '',
        apiKey: '',
        apiSecret: '',
        webhookUrl: '',
      });
      fetchIntegrations();
    } catch (error) {
      console.error('Failed to add integration:', error);
      toast({
        title: 'Error',
        description: 'Failed to add integration. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteIntegration = async (id: string) => {
    try {
      await apiClient.delete(`/settings/integrations/${id}`);
      toast({
        title: 'Success',
        description: 'Integration deleted successfully.',
      });
      fetchIntegrations();
    } catch (error) {
      console.error('Failed to delete integration:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete integration. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Connected</Badge>;
      case 'DISCONNECTED':
        return <Badge variant="outline"><X className="h-3 w-3 mr-1" /> Disconnected</Badge>;
      case 'ERROR':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" /> Error</Badge>;
      case 'PENDING':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredIntegrations = integrations.filter(
    integration => integrationTypes[activeCategory as keyof typeof integrationTypes]?.includes(integration.type)
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calendar" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-5 mb-4">
          {integrationCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {integrationCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{category.name} Integrations</h3>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedIntegrationType('')}>
                    <Plus className="h-4 w-4 mr-2" /> Add Integration
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Integration</DialogTitle>
                    <DialogDescription>
                      Connect a new integration to enhance your CRM capabilities.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="integration-type">Integration Type</Label>
                      <select
                        id="integration-type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedIntegrationType}
                        onChange={(e) => setSelectedIntegrationType(e.target.value)}
                      >
                        <option value="">Select integration type</option>
                        {integrationTypes[category.id as keyof typeof integrationTypes]?.map(type => (
                          <option key={type} value={type}>
                            {type.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="integration-name">Integration Name</Label>
                      <Input
                        id="integration-name"
                        value={newIntegration.name}
                        onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                        placeholder="My Google Calendar"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        value={newIntegration.apiKey}
                        onChange={(e) => setNewIntegration({ ...newIntegration, apiKey: e.target.value })}
                        placeholder="Enter API key"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="api-secret">API Secret</Label>
                      <Input
                        id="api-secret"
                        type="password"
                        value={newIntegration.apiSecret}
                        onChange={(e) => setNewIntegration({ ...newIntegration, apiSecret: e.target.value })}
                        placeholder="Enter API secret"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
                      <Input
                        id="webhook-url"
                        value={newIntegration.webhookUrl}
                        onChange={(e) => setNewIntegration({ ...newIntegration, webhookUrl: e.target.value })}
                        placeholder="https://example.com/webhook"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddIntegration}>Add Integration</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredIntegrations.length === 0 ? (
              <div className="text-center p-8 border rounded-md bg-muted/20">
                <p className="text-muted-foreground">No integrations found. Add your first integration to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredIntegrations.map(integration => (
                  <Card key={integration.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{integration.name}</CardTitle>
                          <CardDescription>{integration.type.replace(/_/g, ' ')}</CardDescription>
                        </div>
                        {getStatusBadge(integration.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      {integration.apiKey && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">API Key:</span>
                          <span className="font-mono">{integration.apiKey.substring(0, 4)}...{integration.apiKey.substring(integration.apiKey.length - 4)}</span>
                        </div>
                      )}
                      {integration.webhookUrl && (
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-muted-foreground">Webhook:</span>
                          <span className="font-mono truncate max-w-[200px]">{integration.webhookUrl}</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex justify-end w-full gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteIntegration(integration.id)}>Remove</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 