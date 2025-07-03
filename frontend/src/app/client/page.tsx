'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  MessageSquare, 
  Phone, 
  Star, 
  FileText,
  ShoppingCart,
  Calendar,
  Bell,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for the dashboard
  const stats = {
    formSubmissions: 42,
    upcomingAppointments: 3,
    pendingReviews: 5,
    unreadMessages: 7,
    recentCalls: 12,
    activeOrders: 2
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Form Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.formSubmissions}</div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unread Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.unreadMessages}</div>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:grid-cols-4 lg:w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent interactions and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>New form submission</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Phone call received</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Yesterday</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>New review received</span>
                    </div>
                    <span className="text-sm text-muted-foreground">3 days ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShoppingCart className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>New order placed</span>
                    </div>
                    <span className="text-sm text-muted-foreground">1 week ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Your scheduled appointments and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                      <span>Client Meeting</span>
                    </div>
                    <span className="text-sm">Tomorrow, 10:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-green-600" />
                      <span>Product Demo</span>
                    </div>
                    <span className="text-sm">Jul 5, 2:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-purple-600" />
                      <span>Strategy Session</span>
                    </div>
                    <span className="text-sm">Jul 8, 11:30 AM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Module Performance</CardTitle>
              <CardDescription>
                Performance metrics for your active modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-md">
                <p className="text-muted-foreground">Performance chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>
                Track all your recent activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="relative pl-8 pb-8 border-l border-muted">
                  <div className="absolute left-[-8px] p-1 bg-background border rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Form Submission Received</p>
                    <p className="text-sm text-muted-foreground">Contact form submission from John Smith</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="relative pl-8 pb-8 border-l border-muted">
                  <div className="absolute left-[-8px] p-1 bg-background border rounded-full">
                    <Phone className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Phone Call</p>
                    <p className="text-sm text-muted-foreground">Incoming call from (555) 123-4567</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday, 3:45 PM</p>
                  </div>
                </div>
                
                <div className="relative pl-8 pb-8 border-l border-muted">
                  <div className="absolute left-[-8px] p-1 bg-background border rounded-full">
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium">New Review</p>
                    <p className="text-sm text-muted-foreground">5-star review received from Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                  </div>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute left-[-8px] p-1 bg-background border rounded-full">
                    <ShoppingCart className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">New Order</p>
                    <p className="text-sm text-muted-foreground">Order #12345 placed for $129.99</p>
                    <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Forms</CardTitle>
                <CardDescription>Manage your forms and submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-4">
                  <FileText className="h-12 w-12 text-primary mb-4" />
                  <p className="text-center text-sm text-muted-foreground">
                    {stats.formSubmissions} submissions this month
                  </p>
                  <button className="mt-4 text-sm text-primary">View Forms</button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>Manage customer reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-4">
                  <Star className="h-12 w-12 text-primary mb-4" />
                  <p className="text-center text-sm text-muted-foreground">
                    {stats.pendingReviews} pending reviews
                  </p>
                  <button className="mt-4 text-sm text-primary">View Reviews</button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Chat</CardTitle>
                <CardDescription>Manage chat conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-4">
                  <MessageSquare className="h-12 w-12 text-primary mb-4" />
                  <p className="text-center text-sm text-muted-foreground">
                    {stats.unreadMessages} unread messages
                  </p>
                  <button className="mt-4 text-sm text-primary">Open Chat</button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Phone & SMS</CardTitle>
                <CardDescription>Manage calls and messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-4">
                  <Phone className="h-12 w-12 text-primary mb-4" />
                  <p className="text-center text-sm text-muted-foreground">
                    {stats.recentCalls} recent calls
                  </p>
                  <button className="mt-4 text-sm text-primary">View Calls</button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Manage your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-4">
                  <Calendar className="h-12 w-12 text-primary mb-4" />
                  <p className="text-center text-sm text-muted-foreground">
                    {stats.upcomingAppointments} upcoming appointments
                  </p>
                  <button className="mt-4 text-sm text-primary">View Calendar</button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Shop</CardTitle>
                <CardDescription>Manage your online store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-4">
                  <ShoppingCart className="h-12 w-12 text-primary mb-4" />
                  <p className="text-center text-sm text-muted-foreground">
                    {stats.activeOrders} active orders
                  </p>
                  <button className="mt-4 text-sm text-primary">View Shop</button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Center</CardTitle>
              <CardDescription>
                Get help and support for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Open Support Ticket</p>
                      <p className="text-sm text-muted-foreground">Create a new support request</p>
                    </div>
                  </div>
                  <button className="text-sm text-primary">Create Ticket</button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-green-600" />
                    <div>
                      <p className="font-medium">Recent Tickets</p>
                      <p className="text-sm text-muted-foreground">View your support history</p>
                    </div>
                  </div>
                  <button className="text-sm text-primary">View History</button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-purple-600" />
                    <div>
                      <p className="font-medium">Knowledge Base</p>
                      <p className="text-sm text-muted-foreground">Browse help articles and guides</p>
                    </div>
                  </div>
                  <button className="text-sm text-primary">Browse Articles</button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 