'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ModuleSetting {
  id: string;
  moduleType: string;
  isEnabled: boolean;
  settings: Record<string, any>;
}

const moduleDescriptions: Record<string, string> = {
  DEALS: 'Manage sales pipelines, stages, and deals',
  APPOINTMENTS: 'Schedule and manage appointments with clients',
  PHONE_SMS: 'Handle phone calls and SMS communications',
  REVIEWS: 'Collect and manage customer reviews',
  SHOP: 'Sell products and services online',
  FORMS: 'Create and manage custom forms',
  MARKETING: 'Run email and SMS marketing campaigns',
  CHAT: 'Live chat with website visitors',
  CONTACTS: 'Manage your contacts and leads',
  ANALYTICS: 'Track and analyze business performance',
  SETTINGS: 'Configure system settings',
  PAYMENT: 'Process payments and manage subscriptions',
};

export default function ModuleSettings() {
  const [moduleSettings, setModuleSettings] = useState<ModuleSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchModuleSettings();
  }, []);

  const fetchModuleSettings = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/settings/modules');
      setModuleSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch module settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load module settings. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleModule = async (moduleType: string, isEnabled: boolean) => {
    try {
      await apiClient.patch(`/settings/modules/${moduleType}`, {
        isEnabled,
      });
      
      // Update local state
      setModuleSettings(prevSettings => 
        prevSettings.map(setting => 
          setting.moduleType === moduleType 
            ? { ...setting, isEnabled } 
            : setting
        )
      );
      
      toast({
        title: 'Success',
        description: `Module ${isEnabled ? 'enabled' : 'disabled'} successfully.`,
      });
    } catch (error) {
      console.error('Failed to update module settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update module settings. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const renderModuleSpecificSettings = (module: ModuleSetting) => {
    switch (module.moduleType) {
      case 'APPOINTMENTS':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="google-calendar-sync">Google Calendar Sync</Label>
              <Switch 
                id="google-calendar-sync" 
                checked={module.settings?.googleCalendarSync || false}
                disabled={!module.isEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="reminder-emails">Send Reminder Emails</Label>
              <Switch 
                id="reminder-emails" 
                checked={module.settings?.reminderEmails || false}
                disabled={!module.isEnabled}
              />
            </div>
          </div>
        );
      
      case 'FORMS':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="captcha-enabled">Enable CAPTCHA</Label>
              <Switch 
                id="captcha-enabled" 
                checked={module.settings?.captchaEnabled || false}
                disabled={!module.isEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notification-emails">Send Notification Emails</Label>
              <Switch 
                id="notification-emails" 
                checked={module.settings?.notificationEmails || false}
                disabled={!module.isEnabled}
              />
            </div>
          </div>
        );
      
      case 'MARKETING':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="double-opt-in">Require Double Opt-in</Label>
              <Switch 
                id="double-opt-in" 
                checked={module.settings?.doubleOptIn || false}
                disabled={!module.isEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="unsubscribe-link">Include Unsubscribe Link</Label>
              <Switch 
                id="unsubscribe-link" 
                checked={module.settings?.unsubscribeLink || false}
                disabled={!module.isEnabled}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-sm text-muted-foreground">
            No additional settings available for this module.
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Enable or disable modules and configure module-specific settings.
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        {moduleSettings.map((module) => (
          <AccordionItem key={module.id} value={module.moduleType}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center">
                  <span>{module.moduleType.replace(/_/g, ' ')}</span>
                </div>
                <Switch 
                  checked={module.isEnabled}
                  onCheckedChange={(checked) => handleToggleModule(module.moduleType, checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {moduleDescriptions[module.moduleType] || 'Configure module settings'}
                </p>
                {renderModuleSpecificSettings(module)}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="flex justify-end">
        <Button onClick={fetchModuleSettings}>Refresh Settings</Button>
      </div>
    </div>
  );
} 