'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Settings,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Key,
  Database,
  Clock,
  Activity,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AnalyticsApi, Integration, CreateIntegrationData, UpdateIntegrationData } from '@/lib/api/modules/analytics-api';
import { ApiClient } from '@/lib/api/api-client';

// Available integration types
const INTEGRATION_TYPES = [
  {
    id: 'google_analytics',
    name: 'Google Analytics 4',
    description: 'Website traffic and user behavior analytics',
    icon: '📊',
    color: 'bg-blue-500',
    fields: [
      { name: 'propertyId', label: 'Property ID', type: 'text', required: true },
      { name: 'clientId', label: 'Client ID', type: 'text', required: true },
      { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
    ]
  },
  {
    id: 'meta_ads',
    name: 'Meta Ads',
    description: 'Facebook and Instagram advertising insights',
    icon: '📘',
    color: 'bg-blue-600',
    fields: [
      { name: 'adAccountId', label: 'Ad Account ID', type: 'text', required: true },
      { name: 'accessToken', label: 'Access Token', type: 'password', required: true },
      { name: 'appId', label: 'App ID', type: 'text', required: true },
      { name: 'appSecret', label: 'App Secret', type: 'password', required: true },
    ]
  },
  {
    id: 'linkedin_ads',
    name: 'LinkedIn Ads',
    description: 'Professional network advertising analytics',
    icon: '💼',
    color: 'bg-blue-700',
    fields: [
      { name: 'adAccountId', label: 'Ad Account ID', type: 'text', required: true },
      { name: 'clientId', label: 'Client ID', type: 'text', required: true },
      { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
    ]
  },
  {
    id: 'google_ads',
    name: 'Google Ads',
    description: 'Search and display advertising performance',
    icon: '🎯',
    color: 'bg-green-500',
    fields: [
      { name: 'customerId', label: 'Customer ID', type: 'text', required: true },
      { name: 'clientId', label: 'Client ID', type: 'text', required: true },
      { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
      { name: 'developerToken', label: 'Developer Token', type: 'password', required: true },
    ]
  },
];

const SYNC_FREQUENCIES = [
  { value: 'manual', label: 'Manual' },
  { value: 'hourly', label: 'Every Hour' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

// Helper function to get integration type
const getIntegrationType = (type: string) => {
  return INTEGRATION_TYPES.find(t => t.id === type);
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const { toast } = useToast();

  // Initialize API client
  const apiClient = new ApiClient();
  const analyticsApi = new AnalyticsApi(apiClient);

  // Mock data - replace with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIntegrations([
        {
          id: '1',
          name: 'Main Website Analytics',
          type: 'google_analytics',
          status: 'connected',
          lastSync: '2024-12-20T10:30:00Z',
          syncFrequency: 'daily',
          config: { propertyId: 'GA_PROPERTY_123' },
          createdAt: '2024-12-01T00:00:00Z',
          updatedAt: '2024-12-20T10:30:00Z',
        },
        {
          id: '2',
          name: 'Facebook Campaigns',
          type: 'meta_ads',
          status: 'error',
          lastSync: '2024-12-19T15:45:00Z',
          syncFrequency: 'daily',
          errorMessage: 'Access token expired',
          config: { adAccountId: 'act_123456789' },
          createdAt: '2024-12-01T00:00:00Z',
          updatedAt: '2024-12-19T15:45:00Z',
        },
        {
          id: '3',
          name: 'LinkedIn Professional Ads',
          type: 'linkedin_ads',
          status: 'disconnected',
          syncFrequency: 'weekly',
          config: {},
          createdAt: '2024-12-01T00:00:00Z',
          updatedAt: '2024-12-01T00:00:00Z',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'bg-green-100 text-green-800',
      disconnected: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800',
      syncing: 'bg-blue-100 text-blue-800',
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };



  const handleCreateIntegration = () => {
    // Handle integration creation
    toast({
      title: "Integration Created",
      description: "Your integration has been created successfully.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateIntegration = () => {
    // Handle integration update
    toast({
      title: "Integration Updated",
      description: "Your integration has been updated successfully.",
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteIntegration = (id: string) => {
    // Handle integration deletion
    setIntegrations(prev => prev.filter(i => i.id !== id));
    toast({
      title: "Integration Deleted",
      description: "The integration has been removed.",
    });
  };

  const handleSyncIntegration = (id: string) => {
    // Handle manual sync
    setIntegrations(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'syncing' as const } : i
    ));
    
    // Simulate sync completion
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => 
        i.id === id ? { 
          ...i, 
          status: 'connected' as const, 
          lastSync: new Date().toISOString() 
        } : i
      ));
      toast({
        title: "Sync Complete",
        description: "Data has been synchronized successfully.",
      });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics Integrations</h1>
          <p className="text-muted-foreground">
            Connect your marketing platforms to centralize your analytics data
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Integration</DialogTitle>
            </DialogHeader>
            <CreateIntegrationForm
              onSubmit={handleCreateIntegration}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Integrations</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-2xl font-bold text-green-600">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issues</p>
                <p className="text-2xl font-bold text-red-600">
                  {integrations.filter(i => i.status === 'error').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Sync</p>
                <p className="text-sm font-medium">
                  {integrations.find(i => i.lastSync)?.lastSync ? 
                    new Date(integrations.find(i => i.lastSync)!.lastSync!).toLocaleDateString() : 
                    'Never'
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const integrationType = getIntegrationType(integration.type);
          
          return (
            <Card key={integration.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${integrationType?.color} flex items-center justify-center text-white text-lg`}>
                      {integrationType?.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {integrationType?.name}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sync Frequency:</span>
                    <span className="capitalize">{integration.syncFrequency}</span>
                  </div>
                  {integration.lastSync && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span>{new Date(integration.lastSync).toLocaleDateString()}</span>
                    </div>
                  )}
                  {integration.errorMessage && (
                    <div className="text-red-600 text-xs">
                      Error: {integration.errorMessage}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncIntegration(integration.id)}
                    disabled={integration.status === 'syncing'}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                    Sync
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedIntegration(integration);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteIntegration(integration.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Integration Card */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <Plus className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Add Integration</h3>
            <p className="text-sm text-gray-500 mb-4">
              Connect a new analytics platform to expand your data insights
            </p>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>
            Popular analytics platforms you can connect to your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTEGRATION_TYPES.map((type) => (
              <div
                key={type.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-8 h-8 rounded ${type.color} flex items-center justify-center text-white text-sm`}>
                  {type.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{type.name}</p>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Integration Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Integration</DialogTitle>
          </DialogHeader>
          {selectedIntegration && (
            <EditIntegrationForm
              integration={selectedIntegration}
              onSubmit={handleUpdateIntegration}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create Integration Form Component
function CreateIntegrationForm({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) {
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const selectedIntegrationType = INTEGRATION_TYPES.find(t => t.id === selectedType);

  return (
    <div className="space-y-6">
      <div>
        <Label>Integration Type</Label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Select integration type" />
          </SelectTrigger>
          <SelectContent>
            {INTEGRATION_TYPES.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                <div className="flex items-center gap-2">
                  <span>{type.icon}</span>
                  <span>{type.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedIntegrationType && (
        <>
          <div>
            <Label>Integration Name</Label>
            <Input
              placeholder={`My ${selectedIntegrationType.name} Integration`}
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Credentials</h3>
            {selectedIntegrationType.fields.map((field) => (
              <div key={field.name}>
                <Label>{field.label}</Label>
                <Input
                  type={field.type}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div>
            <Label>Sync Frequency</Label>
            <Select 
              value={formData.syncFrequency || 'daily'} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, syncFrequency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SYNC_FREQUENCIES.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!selectedType}>
          Create Integration
        </Button>
      </div>
    </div>
  );
}

// Edit Integration Form Component
function EditIntegrationForm({ 
  integration, 
  onSubmit, 
  onCancel 
}: { 
  integration: Integration; 
  onSubmit: () => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: integration.name,
    syncFrequency: integration.syncFrequency,
  });

  const integrationType = getIntegrationType(integration.type);

  return (
    <div className="space-y-6">
      <div>
        <Label>Integration Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div>
        <Label>Integration Type</Label>
        <div className="flex items-center gap-2 p-2 border rounded">
          <span>{integrationType?.icon}</span>
          <span>{integrationType?.name}</span>
        </div>
      </div>

      <div>
        <Label>Sync Frequency</Label>
        <Select 
          value={formData.syncFrequency} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, syncFrequency: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SYNC_FREQUENCIES.map((freq) => (
              <SelectItem key={freq.value} value={freq.value}>
                {freq.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {integration.status === 'error' && integration.errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-600">
            <strong>Error:</strong> {integration.errorMessage}
          </p>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          Update Integration
        </Button>
      </div>
    </div>
  );
} 