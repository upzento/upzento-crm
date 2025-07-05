import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter, Calendar, Loader2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useSettings } from "@/lib/hooks";
import type { AuditLog } from "@/lib/api/modules/settings-api";

export default function AuditLogs() {
  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // Filters state
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Use the settings hook to fetch audit logs
  const { auditLogs, totalAuditLogs, loading, error, fetchAuditLogs } = useSettings({
    autoFetch: false // We'll handle fetching manually
  });
  
  // Fetch audit logs on component mount and when filters change
  useEffect(() => {
    const params: {
      limit: number;
      offset: number;
      action?: string;
      user?: string;
    } = {
      limit: pageSize,
      offset: page * pageSize
    };
    
    if (actionFilter !== 'all') {
      params.action = actionFilter;
    }
    
    if (searchQuery) {
      params.user = searchQuery;
    }
    
    fetchAuditLogs(params);
  }, [fetchAuditLogs, page, pageSize, actionFilter, searchQuery]);
  
  // Handler for search input
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search') as string;
    setSearchQuery(query);
    setPage(0); // Reset to first page on new search
  };
  
  // Handler for page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value, 10));
    setPage(0); // Reset to first page on page size change
  };
  
  // Handler for action filter change
  const handleActionFilterChange = (value: string) => {
    setActionFilter(value);
    setPage(0); // Reset to first page on filter change
  };
  
  // Show loading state
  if (loading && !auditLogs) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Show error state
  if (error && !auditLogs) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
        <h3 className="text-red-800 dark:text-red-300 font-medium">Error loading audit logs</h3>
        <p className="text-red-700 dark:text-red-400 text-sm mt-1">{error.message}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2" 
          onClick={() => fetchAuditLogs({ limit: pageSize, offset: 0 })}
        >
          Retry
        </Button>
      </div>
    );
  }
  
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
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('login') || actionLower.includes('logout')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    } else if (actionLower.includes('settings') || actionLower.includes('created') || actionLower.includes('integration')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    } else if (actionLower.includes('key') || actionLower.includes('user')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    } else if (actionLower.includes('delete') || actionLower.includes('remove')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    } else {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  }
  
  // Calculate pagination info
  const totalPages = Math.ceil((totalAuditLogs || 0) / pageSize);
  const showingFrom = totalAuditLogs > 0 ? page * pageSize + 1 : 0;
  const showingTo = Math.min((page + 1) * pageSize, totalAuditLogs || 0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            placeholder="Search audit logs..."
            className="pl-8 w-full sm:w-[300px]"
            defaultValue={searchQuery}
          />
          <button type="submit" className="sr-only">Search</button>
        </form>
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
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
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
            <Select value={actionFilter} onValueChange={handleActionFilterChange}>
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : auditLogs && auditLogs.length > 0 ? (
                auditLogs.map((log) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No audit logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {totalAuditLogs > 0 
            ? `Showing ${showingFrom} to ${showingTo} of ${totalAuditLogs} entries`
            : 'No entries to show'}
        </div>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === 0 || loading}
            onClick={() => setPage(p => Math.max(0, p - 1))}
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show current page and nearby pages
            let pageToRender: number | null = null;
            
            if (totalPages <= 5) {
              // If 5 or fewer pages, show all
              pageToRender = i;
            } else if (page < 3) {
              // If near the start, show first 5
              pageToRender = i;
            } else if (page > totalPages - 4) {
              // If near the end, show last 5
              pageToRender = totalPages - 5 + i;
            } else {
              // Otherwise show current page and 2 on each side
              pageToRender = page - 2 + i;
            }
            
            // Only render if we have a valid page number
            if (pageToRender !== null && pageToRender >= 0 && pageToRender < totalPages) {
              return (
                <Button 
                  key={pageToRender}
                  variant="outline" 
                  size="sm" 
                  className={page === pageToRender ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => setPage(pageToRender as number)}
                  disabled={loading}
                >
                  {(pageToRender + 1).toString()}
                </Button>
              );
            }
            return null;
          })}
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page >= totalPages - 1 || loading}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 