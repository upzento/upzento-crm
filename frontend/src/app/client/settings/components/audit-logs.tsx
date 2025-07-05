import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter, Calendar } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Mock audit log data
const auditLogs = [
  { 
    id: 1, 
    timestamp: '2023-07-01T14:32:45Z', 
    user: 'john.doe@example.com', 
    action: 'LOGIN', 
    details: 'Successful login from 192.168.1.1 (Chrome on Windows)', 
    ip: '192.168.1.1' 
  },
  { 
    id: 2, 
    timestamp: '2023-07-01T14:48:12Z', 
    user: 'john.doe@example.com', 
    action: 'SETTINGS_CHANGED', 
    details: 'Updated notification preferences', 
    ip: '192.168.1.1' 
  },
  { 
    id: 3, 
    timestamp: '2023-07-01T15:10:22Z', 
    user: 'john.doe@example.com', 
    action: 'API_KEY_CREATED', 
    details: 'Created new API key for integration', 
    ip: '192.168.1.1' 
  },
  { 
    id: 4, 
    timestamp: '2023-07-01T16:05:33Z', 
    user: 'jane.smith@example.com', 
    action: 'USER_INVITED', 
    details: 'Invited new team member (support@example.com)', 
    ip: '192.168.1.2' 
  },
  { 
    id: 5, 
    timestamp: '2023-07-01T17:22:18Z', 
    user: 'john.doe@example.com', 
    action: 'LOGOUT', 
    details: 'User logout', 
    ip: '192.168.1.1' 
  },
  { 
    id: 6, 
    timestamp: '2023-07-02T09:15:42Z', 
    user: 'john.doe@example.com', 
    action: 'LOGIN', 
    details: 'Successful login from 192.168.1.1 (Chrome on Windows)', 
    ip: '192.168.1.1' 
  },
  { 
    id: 7, 
    timestamp: '2023-07-02T10:30:55Z', 
    user: 'john.doe@example.com', 
    action: 'FORM_CREATED', 
    details: 'Created new form "Customer Feedback"', 
    ip: '192.168.1.1' 
  },
  { 
    id: 8, 
    timestamp: '2023-07-02T11:45:22Z', 
    user: 'jane.smith@example.com', 
    action: 'INTEGRATION_CONNECTED', 
    details: 'Connected Google Analytics integration', 
    ip: '192.168.1.2' 
  }
];

// Helper function to format dates
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Helper function to get badge style based on action
function getActionBadgeStyle(action: string) {
  switch (action) {
    case 'LOGIN':
    case 'LOGOUT':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'SETTINGS_CHANGED':
    case 'FORM_CREATED':
    case 'INTEGRATION_CONNECTED':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'API_KEY_CREATED':
    case 'USER_INVITED':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
}

export default function AuditLogs() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search audit logs..."
            className="pl-8 w-full sm:w-[300px]"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-16 h-8">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>
          <div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40 h-8">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login/Logout</SelectItem>
                <SelectItem value="settings">Settings Changes</SelectItem>
                <SelectItem value="user">User Management</SelectItem>
                <SelectItem value="data">Data Changes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Timestamp</th>
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Action</th>
                <th className="text-left p-4 font-medium">Details</th>
                <th className="text-left p-4 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-b">
                  <td className="p-4 align-top">{formatDate(log.timestamp)}</td>
                  <td className="p-4 align-top">{log.user}</td>
                  <td className="p-4 align-top">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getActionBadgeStyle(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 align-top">{log.details}</td>
                  <td className="p-4 align-top">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 1 to 8 of 8 entries
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
} 