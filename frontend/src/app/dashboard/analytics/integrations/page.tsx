"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, PlusCircle, Check, X, RefreshCw, ExternalLink } from "lucide-react";
import Link from "next/link";

// Sample integrations data
const integrations = [
  {
    id: 1,
    name: "Google Analytics",
    description: "Track website traffic and user behavior",
    icon: "/icons/google-analytics.svg",
    status: "connected",
    lastSync: "2 hours ago",
    category: "analytics",
  },
  {
    id: 2,
    name: "Facebook Ads",
    description: "Import ad campaign performance data",
    icon: "/icons/facebook-ads.svg",
    status: "connected",
    lastSync: "1 day ago",
    category: "advertising",
  },
  {
    id: 3,
    name: "Mailchimp",
    description: "Track email campaign performance",
    icon: "/icons/mailchimp.svg",
    status: "disconnected",
    lastSync: null,
    category: "email",
  },
  {
    id: 4,
    name: "Google Search Console",
    description: "Monitor search performance and issues",
    icon: "/icons/google-search-console.svg",
    status: "connected",
    lastSync: "3 hours ago",
    category: "seo",
  },
  {
    id: 5,
    name: "Shopify",
    description: "Import e-commerce sales and product data",
    icon: "/icons/shopify.svg",
    status: "connected",
    lastSync: "30 minutes ago",
    category: "ecommerce",
  },
  {
    id: 6,
    name: "HubSpot",
    description: "Sync marketing and CRM data",
    icon: "/icons/hubspot.svg",
    status: "disconnected",
    lastSync: null,
    category: "crm",
  },
  {
    id: 7,
    name: "LinkedIn Ads",
    description: "Import LinkedIn ad campaign data",
    icon: "/icons/linkedin-ads.svg",
    status: "disconnected",
    lastSync: null,
    category: "advertising",
  },
  {
    id: 8,
    name: "Google Ads",
    description: "Import Google Ads campaign performance",
    icon: "/icons/google-ads.svg",
    status: "connected",
    lastSync: "5 hours ago",
    category: "advertising",
  },
];

// Available integrations for adding
const availableIntegrations = [
  {
    id: 9,
    name: "Twitter Analytics",
    description: "Track Twitter engagement and audience data",
    icon: "/icons/twitter-analytics.svg",
    category: "social",
  },
  {
    id: 10,
    name: "Instagram Insights",
    description: "Import Instagram performance metrics",
    icon: "/icons/instagram-insights.svg",
    category: "social",
  },
  {
    id: 11,
    name: "Stripe",
    description: "Track payment and subscription data",
    icon: "/icons/stripe.svg",
    category: "payment",
  },
  {
    id: 12,
    name: "Ahrefs",
    description: "Import SEO and backlink data",
    icon: "/icons/ahrefs.svg",
    category: "seo",
  },
];

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isAddIntegrationOpen, setIsAddIntegrationOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<number | null>(null);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<number | null>(null);

  const handleSync = (id: number) => {
    setSyncingId(id);
    // Simulate sync process
    setTimeout(() => {
      setSyncingId(null);
    }, 2000);
  };

  const filteredIntegrations = activeTab === "all" 
    ? integrations 
    : integrations.filter(integration => integration.category === activeTab);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/analytics">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Analytics
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Data Integrations</h1>
        </div>
        <Button onClick={() => setIsAddIntegrationOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Data Sources</CardTitle>
          <CardDescription>
            Manage your external data source connections
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6 pt-2">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="advertising">Advertising</TabsTrigger>
              <TabsTrigger value="ecommerce">E-Commerce</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="crm">CRM</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="border-t mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                          {/* Placeholder for icon */}
                          <span className="font-bold text-lg">
                            {integration.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-base">{integration.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {integration.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={integration.status === "connected" ? "default" : "outline"}
                      >
                        {integration.status === "connected" ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    {integration.status === "connected" && (
                      <div className="text-sm text-muted-foreground">
                        Last synced: {integration.lastSync}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedIntegration(integration.id);
                        setIsConfigureOpen(true);
                      }}
                    >
                      Configure
                    </Button>
                    {integration.status === "connected" ? (
                      <Button
                        size="sm"
                        onClick={() => handleSync(integration.id)}
                        disabled={syncingId === integration.id}
                      >
                        {syncingId === integration.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync Now
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button size="sm">Connect</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Usage</CardTitle>
          <CardDescription>
            Monitor your data integration usage and limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">API Calls</div>
                <div className="text-sm text-muted-foreground">12,450 / 50,000</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Data Storage</div>
                <div className="text-sm text-muted-foreground">2.4 GB / 10 GB</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "24%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Connected Sources</div>
                <div className="text-sm text-muted-foreground">5 / 15</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "33%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Integration Dialog */}
      <Dialog open={isAddIntegrationOpen} onOpenChange={setIsAddIntegrationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Data Integration</DialogTitle>
            <DialogDescription>
              Connect to external data sources to import analytics data
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {availableIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center space-x-3 border rounded-md p-3 cursor-pointer hover:border-primary"
                onClick={() => {
                  setSelectedIntegration(integration.id);
                  setIsAddIntegrationOpen(false);
                  setIsConfigureOpen(true);
                }}
              >
                <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                  {/* Placeholder for icon */}
                  <span className="font-bold text-lg">
                    {integration.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{integration.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {integration.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddIntegrationOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure Integration Dialog */}
      <Dialog open={isConfigureOpen} onOpenChange={setIsConfigureOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Configure {selectedIntegration ? 
                [...integrations, ...availableIntegrations].find(i => i.id === selectedIntegration)?.name : 
                "Integration"}
            </DialogTitle>
            <DialogDescription>
              Set up your data connection and sync settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" type="password" placeholder="Enter API key" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountId">Account ID</Label>
              <Input id="accountId" placeholder="Enter account ID" />
            </div>
            <div className="space-y-2">
              <Label>Data to Import</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Switch id="importVisitors" defaultChecked />
                  <Label htmlFor="importVisitors">Visitor Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="importConversions" defaultChecked />
                  <Label htmlFor="importConversions">Conversion Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="importCampaigns" defaultChecked />
                  <Label htmlFor="importCampaigns">Campaign Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="importEvents" defaultChecked />
                  <Label htmlFor="importEvents">Event Data</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="syncFrequency">Sync Frequency</Label>
              <select
                id="syncFrequency"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="enableHistorical" />
              <Label htmlFor="enableHistorical">Import Historical Data (Last 30 Days)</Label>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsConfigureOpen(false)}>
              Cancel
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                Disconnect
              </Button>
              <Button onClick={() => setIsConfigureOpen(false)}>
                Save Configuration
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 