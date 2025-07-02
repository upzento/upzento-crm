'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Phone, Plus, Settings, Trash2 } from 'lucide-react';

// Mock data for demonstration
const mockPhoneNumbers = [
  {
    id: '1',
    number: '+1 (555) 123-4567',
    name: 'Sales Line',
    provider: 'TWILIO',
    type: 'VOICE_SMS',
    status: 'ACTIVE',
    createdAt: '2023-06-15T10:30:00Z',
  },
  {
    id: '2',
    number: '+1 (555) 987-6543',
    name: 'Support Line',
    provider: 'TWILIO',
    type: 'VOICE_SMS',
    status: 'ACTIVE',
    createdAt: '2023-06-10T14:20:00Z',
  },
  {
    id: '3',
    number: '+1 (555) 555-5555',
    name: 'Marketing SMS',
    provider: 'VONAGE',
    type: 'SMS',
    status: 'ACTIVE',
    createdAt: '2023-05-22T09:15:00Z',
  },
];

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState(mockPhoneNumbers);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phone Numbers</h1>
          <p className="text-muted-foreground">
            Manage your phone numbers for calls and SMS
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Phone Number
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Phone Numbers</CardTitle>
          <CardDescription>
            View and manage phone numbers associated with your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {phoneNumbers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phoneNumbers.map((phoneNumber) => (
                  <TableRow key={phoneNumber.id}>
                    <TableCell className="font-medium">{phoneNumber.name}</TableCell>
                    <TableCell>{phoneNumber.number}</TableCell>
                    <TableCell>{phoneNumber.provider}</TableCell>
                    <TableCell>
                      {phoneNumber.type === 'VOICE_SMS' && 'Voice & SMS'}
                      {phoneNumber.type === 'VOICE' && 'Voice Only'}
                      {phoneNumber.type === 'SMS' && 'SMS Only'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={phoneNumber.status === 'ACTIVE' ? 'success' : 'secondary'}
                      >
                        {phoneNumber.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <Phone className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No phone numbers</h3>
              <p className="text-muted-foreground mt-1">
                You haven't added any phone numbers yet.
              </p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Phone Number
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Phone Number Settings</CardTitle>
          <CardDescription>
            Configure global settings for your phone numbers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Default Call Forwarding Number
              </label>
              <Input placeholder="Enter phone number" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Voicemail Email
              </label>
              <Input placeholder="Enter email for voicemail notifications" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 