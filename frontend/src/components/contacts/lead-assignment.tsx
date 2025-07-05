'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { contactsApi } from '@/lib/api/api-client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  UserPlus,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface LeadAssignmentProps {
  contactId: string;
  currentAssignment?: {
    userId: string;
    name: string;
    avatar?: string;
    assignedAt: string;
    status: 'active' | 'pending' | 'declined';
  };
  onAssignmentUpdate?: (assignment: any) => void;
}

// Mock data for team members
const TEAM_MEMBERS = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: null,
    role: 'Sales Manager',
    activeLeads: 12,
    conversionRate: 75
  },
  {
    id: '2',
    name: 'Maria Garcia',
    avatar: null,
    role: 'Sales Representative',
    activeLeads: 8,
    conversionRate: 82
  },
  {
    id: '3',
    name: 'John Smith',
    avatar: null,
    role: 'Account Executive',
    activeLeads: 15,
    conversionRate: 68
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    avatar: null,
    role: 'Sales Representative',
    activeLeads: 10,
    conversionRate: 71
  }
];

export function LeadAssignment({
  contactId,
  currentAssignment,
  onAssignmentUpdate
}: LeadAssignmentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="text-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-500">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="outline" className="text-red-500">
            <XCircle className="mr-1 h-3 w-3" />
            Declined
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-500">
            <AlertCircle className="mr-1 h-3 w-3" />
            Unknown
          </Badge>
        );
    }
  };
  
  // Handle assignment
  const handleAssign = async () => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select a team member to assign.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // await contactsApi.assignContact(contactId, selectedUserId);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedUser = TEAM_MEMBERS.find(user => user.id === selectedUserId);
      const mockAssignment = {
        userId: selectedUserId,
        name: selectedUser?.name || '',
        avatar: selectedUser?.avatar,
        assignedAt: new Date().toISOString(),
        status: 'pending' as const
      };
      
      if (onAssignmentUpdate) {
        onAssignmentUpdate(mockAssignment);
      }
      
      toast({
        title: "Lead Assigned",
        description: `Lead has been assigned to ${selectedUser?.name}.`,
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error assigning lead:', error);
      toast({
        title: "Error",
        description: "Failed to assign lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Assignment</CardTitle>
        <CardDescription>
          Manage lead ownership and tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentAssignment ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  {currentAssignment.avatar ? (
                    <AvatarImage src={currentAssignment.avatar} alt={currentAssignment.name} />
                  ) : (
                    <AvatarFallback>
                      {currentAssignment.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{currentAssignment.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Assigned {new Date(currentAssignment.assignedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {getStatusBadge(currentAssignment.status)}
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline"
                onClick={() => setIsDialogOpen(true)}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reassign
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Assignment</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This lead hasn't been assigned to anyone yet.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Assign Lead
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAssignment ? 'Reassign Lead' : 'Assign Lead'}
            </DialogTitle>
            <DialogDescription>
              Select a team member to handle this lead.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_MEMBERS.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} alt={member.name} />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.activeLeads} active leads • {member.conversionRate}% conversion
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedUserId && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Selected Team Member</h4>
                {(() => {
                  const member = TEAM_MEMBERS.find(m => m.id === selectedUserId);
                  if (!member) return null;
                  
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Leads</span>
                        <Badge variant="outline">{member.activeLeads}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Conversion Rate</span>
                        <Badge variant="outline">{member.conversionRate}%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Role</span>
                        <Badge variant="outline">{member.role}</Badge>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedUserId || isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign Lead
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 