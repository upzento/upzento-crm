'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Globe, 
  Bell, 
  Lock, 
  UserPlus, 
  Plug, 
  Save 
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  
  // Mock data for domain settings
  const domains = [
    { id: '1', domain: 'example.com', verified: true, primary: true },
    { id: '2', domain: 'mysite.org', verified: true, primary: false },
    { id: '3', domain: 'newdomain.net', verified: false, primary: false }
  ];
  
  // Mock data for notification settings
  const notificationSettings = {
    emailNotifications: true,
    formSubmissions: true,
    reviewAlerts: true,
    appointmentReminders: true,
    chatMessages: false,
    marketingUpdates: true,
    systemUpdates: true
  };
  
  // Mock data for team members
  const teamMembers = [
    { id: '1', name: 'John Smith', email: 'john@example.com', role: 'Admin', active: true },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Editor', active: true },
    { id: '3', name: 'Michael Brown', email: 'michael@example.com', role: 'Viewer', active: false }
  ];
  
  // Mock data for integrations
  const integrations = [
    { id: '1', name: 'Google Analytics', connected: true, lastSync: '2 hours ago' },
    { id: '2', name: 'Facebook Pixel', connected: true, lastSync: '1 day ago' },
    { id: '3', name: 'Mailchimp', connected: false, lastSync: 'Never' },
    { id: '4', name: 'Zapier', connected: true, lastSync: '3 hours ago' },
    { id: '5', name: 'Stripe', connected: true, lastSync: '30 minutes ago' }
  ];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-full">
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="domains">
            <Globe className="mr-2 h-4 w-4" />
            Domains
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="team">
            <UserPlus className="mr-2 h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Plug className="mr-2 h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" defaultValue="Acme Corporation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue="contact@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Business Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address1">Address Line 1</Label>
                    <Input id="address1" defaultValue="123 Main Street" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input id="address2" defaultValue="Suite 100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" defaultValue="CA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP/Postal Code</Label>
                    <Input id="zip" defaultValue="94105" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" defaultValue="United States" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable dark mode for the dashboard
                      </p>
                    </div>
                    <Switch id="darkMode" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailUpdates">Email Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your account
                      </p>
                    </div>
                    <Switch id="emailUpdates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="timezone">Timezone</Label>
                      <p className="text-sm text-muted-foreground">
                        Select your preferred timezone
                      </p>
                    </div>
                    <select 
                      id="timezone" 
                      className="border rounded-md px-3 py-2"
                      defaultValue="America/Los_Angeles"
                    >
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="America/Denver">Mountain Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Domains Settings */}
        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>
                Manage domains for embedding forms, reviews, and other widgets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Authorized Domains</h3>
                  <Button variant="outline">Add Domain</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  These domains are authorized to embed your forms, reviews, and other widgets.
                </p>
                
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Domain</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Primary</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domains.map((domain) => (
                        <tr key={domain.id} className="border-b">
                          <td className="p-3 font-medium">{domain.domain}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              domain.verified 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}>
                              {domain.verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="p-3">
                            {domain.primary ? (
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Primary
                              </span>
                            ) : (
                              <Button variant="ghost" size="sm">
                                Set as Primary
                              </Button>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm">
                              {domain.verified ? 'Remove' : 'Verify'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={notificationSettings.emailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="formSubmissions">Form Submissions</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone submits a form
                    </p>
                  </div>
                  <Switch 
                    id="formSubmissions" 
                    checked={notificationSettings.formSubmissions}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reviewAlerts">Review Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive a new review
                    </p>
                  </div>
                  <Switch 
                    id="reviewAlerts" 
                    checked={notificationSettings.reviewAlerts}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders about upcoming appointments
                    </p>
                  </div>
                  <Switch 
                    id="appointmentReminders" 
                    checked={notificationSettings.appointmentReminders}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="chatMessages">Chat Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new chat messages
                    </p>
                  </div>
                  <Switch 
                    id="chatMessages" 
                    checked={notificationSettings.chatMessages}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingUpdates">Marketing Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about marketing campaigns
                    </p>
                  </div>
                  <Switch 
                    id="marketingUpdates" 
                    checked={notificationSettings.marketingUpdates}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="systemUpdates">System Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about system updates and maintenance
                    </p>
                  </div>
                  <Switch 
                    id="systemUpdates" 
                    checked={notificationSettings.systemUpdates}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Team Settings */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Manage team members and their access permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Team Members</h3>
                  <Button variant="outline">Invite Member</Button>
                </div>
                
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Role</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((member) => (
                        <tr key={member.id} className="border-b">
                          <td className="p-3 font-medium">{member.name}</td>
                          <td className="p-3">{member.email}</td>
                          <td className="p-3">{member.role}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              member.active 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {member.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Roles and Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Admin</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Full access to all features and settings
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>â Manage team members</li>
                      <li>â Edit all content</li>
                      <li>â Access billing and payments</li>
                      <li>â Manage integrations</li>
                      <li>â View analytics</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Editor</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Can edit content but cannot manage team or billing
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>â Manage team members</li>
                      <li>â Edit all content</li>
                      <li>â Access billing and payments</li>
                      <li>â Manage integrations</li>
                      <li>â View analytics</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Viewer</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Read-only access to content and analytics
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>â Manage team members</li>
                      <li>â Edit all content</li>
                      <li>â Access billing and payments</li>
                      <li>â Manage integrations</li>
                      <li>â View analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect your account with third-party services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div 
                    key={integration.id} 
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {integration.connected 
                          ? `Last synced ${integration.lastSync}` 
                          : 'Not connected'}
                      </p>
                    </div>
                    <Button variant={integration.connected ? "outline" : "default"}>
                      {integration.connected ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 