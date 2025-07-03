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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  MessageSquare, 
  Download, 
  Upload, 
  Settings, 
  Globe,
  Building,
  Users
} from 'lucide-react';

// Mock data for phone numbers
const phoneNumbers = [
  {
    id: '1',
    number: '+1 (555) 111-2233',
    type: 'Main Line',
    location: 'New York',
    assignedTo: 'Sales Team',
    status: 'active',
    callForwarding: '+1 (555) 999-8888',
    voicemail: true,
    smsEnabled: true,
    monthlyFee: '$25',
    purchaseDate: '2023-01-15',
    calls: 156,
    sms: 89
  },
  {
    id: '2',
    number: '+1 (555) 444-5566',
    type: 'Support',
    location: 'Chicago',
    assignedTo: 'Support Team',
    status: 'active',
    callForwarding: '',
    voicemail: true,
    smsEnabled: true,
    monthlyFee: '$25',
    purchaseDate: '2023-02-22',
    calls: 243,
    sms: 127
  },
  {
    id: '3',
    number: '+1 (555) 777-8899',
    type: 'Marketing',
    location: 'Los Angeles',
    assignedTo: 'Marketing Team',
    status: 'inactive',
    callForwarding: '',
    voicemail: false,
    smsEnabled: true,
    monthlyFee: '$25',
    purchaseDate: '2023-03-10',
    calls: 78,
    sms: 312
  }
];

// Mock data for available numbers
const availableNumbers = [
  { id: '1', number: '+1 (555) 123-4567', type: 'Local', location: 'New York', monthlyFee: '$25' },
  { id: '2', number: '+1 (555) 234-5678', type: 'Local', location: 'Chicago', monthlyFee: '$25' },
  { id: '3', number: '+1 (555) 345-6789', type: 'Local', location: 'Los Angeles', monthlyFee: '$25' },
  { id: '4', number: '+1 (555) 456-7890', type: 'Local', location: 'Miami', monthlyFee: '$25' },
  { id: '5', number: '+1 (555) 567-8901', type: 'Toll-Free', location: 'United States', monthlyFee: '$30' }
];

export default function PhoneNumbersPage() {
  const [activeTab, setActiveTab] = useState('manage');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  
  // Filter phone numbers based on search query
  const filteredPhoneNumbers = phoneNumbers.filter(phoneNumber => 
    phoneNumber.number.includes(searchQuery) ||
    phoneNumber.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    phoneNumber.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    phoneNumber.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter available numbers based on search query
  const filteredAvailableNumbers = availableNumbers.filter(availableNumber => 
    availableNumber.number.includes(searchQuery) ||
    availableNumber.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get the selected phone number data
  const selectedPhoneNumberData = phoneNumbers.find(phoneNumber => phoneNumber.id === selectedNumber);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Phone Numbers</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Phone Number
        </Button>
      </div>
      
      <Tabs defaultValue="manage" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="manage">Manage Numbers</TabsTrigger>
          <TabsTrigger value="buy">Buy New Number</TabsTrigger>
          <TabsTrigger value="port">Port Existing Number</TabsTrigger>
        </TabsList>
        
        {/* Manage Numbers Tab */}
        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Phone Numbers</CardTitle>
              <CardDescription>
                Manage and configure your phone numbers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Input
                    placeholder="Search phone numbers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Number</th>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-left hidden md:table-cell">Location</th>
                      <th className="py-3 px-4 text-left hidden lg:table-cell">Assigned To</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left hidden md:table-cell">Usage</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPhoneNumbers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-muted-foreground">
                          No phone numbers found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredPhoneNumbers.map((phoneNumber) => (
                        <tr 
                          key={phoneNumber.id} 
                          className={`border-b ${selectedNumber === phoneNumber.id ? 'bg-muted/50' : ''}`}
                          onClick={() => setSelectedNumber(phoneNumber.id)}
                        >
                          <td className="py-3 px-4 font-medium">{phoneNumber.number}</td>
                          <td className="py-3 px-4">{phoneNumber.type}</td>
                          <td className="py-3 px-4 hidden md:table-cell">{phoneNumber.location}</td>
                          <td className="py-3 px-4 hidden lg:table-cell">{phoneNumber.assignedTo}</td>
                          <td className="py-3 px-4">
                            <Badge variant={phoneNumber.status === 'active' ? 'default' : 'secondary'}>
                              {phoneNumber.status.charAt(0).toUpperCase() + phoneNumber.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                <span>{phoneNumber.calls}</span>
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                <span>{phoneNumber.sms}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {selectedNumber && (
            <Card>
              <CardHeader>
                <CardTitle>Phone Number Details</CardTitle>
                <CardDescription>
                  Configure settings for {selectedPhoneNumberData?.number}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="settings">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="forwarding">Call Forwarding</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="settings" className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="numberType">Number Type</Label>
                          <Input id="numberType" value={selectedPhoneNumberData?.type} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="numberLocation">Location</Label>
                          <Input id="numberLocation" value={selectedPhoneNumberData?.location} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assignedTo">Assigned To</Label>
                          <Input id="assignedTo" value={selectedPhoneNumberData?.assignedTo} />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="monthlyFee">Monthly Fee</Label>
                          <Input id="monthlyFee" value={selectedPhoneNumberData?.monthlyFee} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="purchaseDate">Purchase Date</Label>
                          <Input id="purchaseDate" value={selectedPhoneNumberData?.purchaseDate} readOnly />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="numberStatus">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable or disable this phone number
                            </p>
                          </div>
                          <Switch 
                            id="numberStatus" 
                            checked={selectedPhoneNumberData?.status === 'active'} 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="smsEnabled">SMS Capability</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable sending and receiving SMS messages
                            </p>
                          </div>
                          <Switch 
                            id="smsEnabled" 
                            checked={selectedPhoneNumberData?.smsEnabled} 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="voicemail">Voicemail</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable voicemail for missed calls
                            </p>
                          </div>
                          <Switch 
                            id="voicemail" 
                            checked={selectedPhoneNumberData?.voicemail} 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="forwarding" className="space-y-6 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="callForwarding">Call Forwarding</Label>
                          <p className="text-sm text-muted-foreground">
                            Forward incoming calls to another number
                          </p>
                        </div>
                        <Switch 
                          id="callForwarding" 
                          checked={!!selectedPhoneNumberData?.callForwarding} 
                        />
                      </div>
                      
                      {!!selectedPhoneNumberData?.callForwarding && (
                        <div className="space-y-2">
                          <Label htmlFor="forwardingNumber">Forwarding Number</Label>
                          <Input 
                            id="forwardingNumber" 
                            value={selectedPhoneNumberData?.callForwarding} 
                            placeholder="Enter phone number"
                          />
                        </div>
                      )}
                      
                      <div className="space-y-4 mt-6">
                        <h3 className="text-lg font-medium">Call Routing Rules</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <p className="font-medium">Business Hours</p>
                              <p className="text-sm text-muted-foreground">Mon-Fri, 9:00 AM - 5:00 PM</p>
                            </div>
                            <div className="text-sm">Forward to Sales Team</div>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <p className="font-medium">After Hours</p>
                              <p className="text-sm text-muted-foreground">Evenings & Weekends</p>
                            </div>
                            <div className="text-sm">Send to Voicemail</div>
                          </div>
                          <Button variant="outline" className="w-full mt-2">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Routing Rule
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Calls
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedPhoneNumberData?.calls}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total SMS
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedPhoneNumberData?.sms}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Monthly Cost
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedPhoneNumberData?.monthlyFee}</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Call Volume</h3>
                      <div className="h-[200px] border-2 border-dashed rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Call volume chart will be displayed here</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Buy New Number Tab */}
        <TabsContent value="buy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buy New Phone Number</CardTitle>
              <CardDescription>
                Search and purchase new phone numbers for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numberType">Number Type</Label>
                  <select id="numberType" className="w-full border rounded-md px-3 py-2">
                    <option value="local">Local Number</option>
                    <option value="tollfree">Toll-Free Number</option>
                    <option value="mobile">Mobile Number</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <select id="country" className="w-full border rounded-md px-3 py-2">
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="au">Australia</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="areaCode">Area Code</Label>
                  <div className="flex gap-2">
                    <Input id="areaCode" placeholder="e.g., 212" />
                    <Button>Search</Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Number</th>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-left">Location</th>
                      <th className="py-3 px-4 text-left">Monthly Fee</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAvailableNumbers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-muted-foreground">
                          Search for available phone numbers above.
                        </td>
                      </tr>
                    ) : (
                      filteredAvailableNumbers.map((number) => (
                        <tr key={number.id} className="border-b">
                          <td className="py-3 px-4 font-medium">{number.number}</td>
                          <td className="py-3 px-4">{number.type}</td>
                          <td className="py-3 px-4">{number.location}</td>
                          <td className="py-3 px-4">{number.monthlyFee}</td>
                          <td className="py-3 px-4 text-right">
                            <Button size="sm">
                              Purchase
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Port Existing Number Tab */}
        <TabsContent value="port" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Port Existing Number</CardTitle>
              <CardDescription>
                Transfer your existing phone numbers to our service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="portNumber">Phone Number to Port</Label>
                    <Input id="portNumber" placeholder="e.g., +1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentProvider">Current Service Provider</Label>
                    <Input id="currentProvider" placeholder="e.g., Verizon, AT&T" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" placeholder="Your account number with current provider" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pin">PIN/Password</Label>
                    <Input id="pin" type="password" placeholder="PIN or password for your account" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <h3 className="text-lg font-medium mb-2">Porting Information</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Porting typically takes 5-7 business days</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Your current service will remain active during the process</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>You'll need to provide a copy of your most recent phone bill</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>There's a one-time $15 porting fee per number</span>
                      </li>
                      <li className="flex gap-2">
                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span>Toll-free numbers may take longer to port</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billUpload">Upload Recent Phone Bill</Label>
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your phone bill, or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Submit Port Request</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phone Number Features</CardTitle>
            <CardDescription>
              Features included with all phone numbers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Call forwarding to any device</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Voicemail with email notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>SMS messaging capabilities</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Call recording and transcription</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Advanced call analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Business hours routing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Team assignment</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for phone number management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="flex flex-col h-24 w-full">
                <Phone className="h-6 w-6 mb-2" />
                <span>Buy Number</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-24 w-full">
                <Upload className="h-6 w-6 mb-2" />
                <span>Port Number</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-24 w-full">
                <Settings className="h-6 w-6 mb-2" />
                <span>Configure</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-24 w-full">
                <BarChart2 className="h-6 w-6 mb-2" />
                <span>Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 