import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  Facebook, 
  Mail, 
  MessageSquare, 
  CreditCard, 
  BarChart, 
  Github, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { useEffect } from "react";
import { useSettings } from "@/lib/hooks";
import type { Integration } from "@/lib/api/modules/settings-api";

interface CategoryMap {
  [key: string]: Integration[];
}

export default function IntegrationsSettings() {
  // Use the settings hook to fetch integrations
  const { integrations, loading, error, fetchIntegrations } = useSettings({
    autoFetch: false // We'll handle fetching manually
  });
  
  // Fetch integrations on component mount
  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);
  
  // Show loading state
  if (loading && !integrations) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Show error state
  if (error && !integrations) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
        <h3 className="text-red-800 dark:text-red-300 font-medium">Error loading integrations</h3>
        <p className="text-red-700 dark:text-red-400 text-sm mt-1">{error.message}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2" 
          onClick={() => fetchIntegrations()}
        >
          Retry
        </Button>
      </div>
    );
  }
  
  // Group integrations by category
  const categories: CategoryMap = (integrations || []).reduce((acc: CategoryMap, integration: Integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {});
  
  // Helper function to get icon by integration name
  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('google') || lowerName.includes('analytics')) {
      return <BarChart className="h-8 w-8 text-[#E37400]" />;
    } else if (lowerName.includes('mail') || lowerName.includes('email')) {
      return <Mail className="h-8 w-8 text-[#FFE01B]" />;
    } else if (lowerName.includes('facebook') || lowerName.includes('meta')) {
      return <Facebook className="h-8 w-8 text-[#1877F2]" />;
    } else if (lowerName.includes('stripe') || lowerName.includes('payment')) {
      return <CreditCard className="h-8 w-8 text-[#635BFF]" />;
    } else if (lowerName.includes('chat') || lowerName.includes('slack')) {
      return <MessageSquare className="h-8 w-8 text-[#4A154B]" />;
    } else if (lowerName.includes('github')) {
      return <Github className="h-8 w-8" />;
    } else {
      return <Cloud className="h-8 w-8 text-[#FF4A00]" />;
    }
  };
  
  return (
    <div className="space-y-8">
      {Object.entries(categories).map(([category, categoryIntegrations]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-medium capitalize">{category}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {categoryIntegrations.map((integration) => (
              <div 
                key={integration.id} 
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-background p-2 rounded-lg border">
                    {getIcon(integration.name)}
                  </div>
                  <div>
                    <h4 className="font-medium">{integration.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                    <div className="mt-1">
                      {integration.status === "connected" ? (
                        <div className="flex items-center text-xs text-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          <span>Connected · Last sync {integration.lastSync}</span>
                        </div>
                      ) : integration.status === "error" ? (
                        <div className="flex items-center text-xs text-red-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          <span>{integration.lastSync}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          Not connected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant={integration.status === "connected" ? "outline" : "default"}
                  size="sm"
                >
                  {integration.status === "connected" ? "Configure" : "Connect"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="border-t pt-6">
        <Button variant="outline">
          Browse More Integrations
        </Button>
      </div>
    </div>
  );
} 