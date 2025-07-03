'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  ChevronRight, 
  Clock, 
  Edit, 
  MessageSquare, 
  Plus, 
  Send, 
  Trash2, 
  Users 
} from 'lucide-react';

// Mock data for demonstration
const mockCampaigns = [
  {
    id: '1',
    name: 'Summer Sale Announcement',
    status: 'COMPLETED',
    recipientCount: 156,
    deliveredCount: 152,
    failedCount: 4,
    scheduledAt: '2023-06-15T10:30:00Z',
    sentAt: '2023-06-15T10:30:00Z',
    createdAt: '2023-06-10T14:20:00Z',
  },
  {
    id: '2',
    name: 'New Product Launch',
    status: 'SCHEDULED',
    recipientCount: 243,
    deliveredCount: 0,
    failedCount: 0,
    scheduledAt: '2023-07-05T09:00:00Z',
    sentAt: null,
    createdAt: '2023-06-28T11:45:00Z',
  },
  {
    id: '3',
    name: 'Appointment Reminders',
    status: 'DRAFT',
    recipientCount: 0,
    deliveredCount: 0,
    failedCount: 0,
    scheduledAt: null,
    sentAt: null,
    createdAt: '2023-06-30T16:20:00Z',
  },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Helper function to get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'default';
      case 'SCHEDULED': return 'info';
      case 'DRAFT': return 'secondary';
      case 'CANCELED': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SMS Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage bulk SMS marketing campaigns
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Campaigns</CardTitle>
          <CardDescription>
            View and manage your SMS marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        {campaign.recipientCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      {campaign.scheduledAt ? (
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(campaign.scheduledAt)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not scheduled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {campaign.sentAt ? (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(campaign.sentAt)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not sent</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {campaign.status === 'DRAFT' && (
                          <Button variant="ghost" size="icon">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No campaigns</h3>
              <p className="text-muted-foreground mt-1">
                You haven't created any SMS campaigns yet.
              </p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Quick Campaign</CardTitle>
          <CardDescription>
            Create a simple SMS campaign in minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Campaign Name
            </label>
            <Input placeholder="Enter campaign name" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Message
            </label>
            <Textarea 
              placeholder="Enter your message here..." 
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              0/160 characters (1 message)
            </p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Recipients
            </label>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Users className="mr-2 h-4 w-4" />
                Select from Contacts
              </Button>
              <Button variant="outline" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add Numbers Manually
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Save as Draft</Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 