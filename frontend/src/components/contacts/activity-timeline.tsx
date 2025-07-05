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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Edit,
  Tag,
  UserPlus,
  Star,
  FileText,
  Clock,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Trash2,
  User
} from 'lucide-react';

// Activity types and their configurations
const ACTIVITY_TYPES = {
  EMAIL: {
    icon: Mail,
    label: 'Email',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  CALL: {
    icon: Phone,
    label: 'Call',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  SMS: {
    icon: MessageSquare,
    label: 'SMS',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  MEETING: {
    icon: Calendar,
    label: 'Meeting',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  EDIT: {
    icon: Edit,
    label: 'Edit',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
  },
  TAG: {
    icon: Tag,
    label: 'Tag',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  ASSIGNMENT: {
    icon: UserPlus,
    label: 'Assignment',
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
  },
  LEAD_STATUS: {
    icon: Star,
    label: 'Lead Status',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
  },
  NOTE: {
    icon: FileText,
    label: 'Note',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  REMINDER: {
    icon: Clock,
    label: 'Reminder',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  DEAL: {
    icon: ArrowUpRight,
    label: 'Deal',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  FORM: {
    icon: ArrowDownLeft,
    label: 'Form',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  MERGE: {
    icon: RefreshCw,
    label: 'Merge',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  DELETE: {
    icon: Trash2,
    label: 'Delete',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
};

// Activity status configurations
const ACTIVITY_STATUS = {
  COMPLETED: {
    icon: CheckCircle2,
    label: 'Completed',
    color: 'text-green-500',
  },
  PENDING: {
    icon: Clock,
    label: 'Pending',
    color: 'text-yellow-500',
  },
  FAILED: {
    icon: XCircle,
    label: 'Failed',
    color: 'text-red-500',
  },
  WARNING: {
    icon: AlertCircle,
    label: 'Warning',
    color: 'text-orange-500',
  },
};

interface ActivityTimelineProps {
  contactId: string;
  activities: Array<{
    id: string;
    type: keyof typeof ACTIVITY_TYPES;
    description: string;
    timestamp: string;
    status?: keyof typeof ACTIVITY_STATUS;
    metadata?: any;
    performedBy?: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export function ActivityTimeline({
  contactId,
  activities,
  onLoadMore,
  hasMore = false,
  isLoading = false,
}: ActivityTimelineProps) {
  const [filter, setFilter] = useState<string>('all');
  
  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, typeof activities>);
  
  // Filter activities
  const filterActivities = (type: string) => {
    setFilter(type);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>
              Track all interactions and changes
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={filterActivities}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter activities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                {Object.entries(ACTIVITY_TYPES).map(([key, value]) => (
                  <SelectItem key={key} value={key.toLowerCase()}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([date, dateActivities]) => (
            <div key={date} className="relative">
              <div className="sticky top-0 bg-background/95 backdrop-blur z-10 py-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
              </div>
              
              <div className="space-y-4">
                {dateActivities
                  .filter(activity => 
                    filter === 'all' || 
                    activity.type.toLowerCase() === filter.toLowerCase()
                  )
                  .map((activity) => {
                    const activityType = ACTIVITY_TYPES[activity.type];
                    const ActivityIcon = activityType.icon;
                    const status = activity.status && ACTIVITY_STATUS[activity.status];
                    const StatusIcon = status?.icon;
                    
                    return (
                      <div key={activity.id} className="relative pl-8">
                        <div className="absolute left-0 top-1">
                          <div className={`p-1 rounded-full ${activityType.bgColor}`}>
                            <ActivityIcon className={`h-4 w-4 ${activityType.color}`} />
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {activityType.label}
                                </span>
                                {status && (
                                  <Badge variant="outline" className={status.color}>
                                    <StatusIcon className="mr-1 h-3 w-3" />
                                    {status.label}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {activity.description}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-sm text-muted-foreground">
                                {new Date(activity.timestamp).toLocaleTimeString()}
                              </span>
                              {activity.performedBy && (
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-muted-foreground">by</span>
                                  <div className="flex items-center gap-1">
                                    {activity.performedBy.avatar ? (
                                      <img 
                                        src={activity.performedBy.avatar} 
                                        alt={activity.performedBy.name}
                                        className="h-5 w-5 rounded-full"
                                      />
                                    ) : (
                                      <User className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span>{activity.performedBy.name}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {activity.metadata && (
                            <div className="mt-2 pt-2 border-t">
                              {/* Render metadata based on activity type */}
                              {activity.type === 'EMAIL' && (
                                <div className="text-sm">
                                  <p><strong>Subject:</strong> {activity.metadata.subject}</p>
                                  {activity.metadata.preview && (
                                    <p className="text-muted-foreground">{activity.metadata.preview}</p>
                                  )}
                                </div>
                              )}
                              {activity.type === 'CALL' && (
                                <div className="text-sm">
                                  <p><strong>Duration:</strong> {activity.metadata.duration}</p>
                                  {activity.metadata.notes && (
                                    <p className="text-muted-foreground">{activity.metadata.notes}</p>
                                  )}
                                </div>
                              )}
                              {activity.type === 'MEETING' && (
                                <div className="text-sm">
                                  <p><strong>When:</strong> {activity.metadata.when}</p>
                                  <p><strong>Duration:</strong> {activity.metadata.duration}</p>
                                  {activity.metadata.agenda && (
                                    <p className="text-muted-foreground">{activity.metadata.agenda}</p>
                                  )}
                                </div>
                              )}
                              {activity.type === 'EDIT' && (
                                <div className="text-sm space-y-1">
                                  {Object.entries(activity.metadata.changes).map(([field, change]: [string, any]) => (
                                    <div key={field}>
                                      <strong>{field}:</strong>{' '}
                                      <span className="text-red-500">{change.old}</span>{' '}
                                      <span className="text-muted-foreground">→</span>{' '}
                                      <span className="text-green-500">{change.new}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
        
        {hasMore && (
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              onClick={onLoadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No activities found.
          </div>
        )}
      </CardContent>
    </Card>
  );
} 