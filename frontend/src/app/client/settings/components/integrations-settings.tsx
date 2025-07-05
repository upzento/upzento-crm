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
  AlertCircle
} from "lucide-react";

// Define types for integrations
type IntegrationStatus = "connected" | "disconnected" | "error";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: IntegrationStatus;
  lastSync: string;
  category: string;
};

type CategoryMap = {
  [key: string]: Integration[];
};

// Mock integrations data
const integrations: Integration[] = [
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track website traffic and user behavior",
    icon: <BarChart className="h-8 w-8 text-[#E37400]" />,
    status: "connected",
    lastSync: "2 hours ago",
    category: "analytics"
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing and automation",
    icon: <Mail className="h-8 w-8 text-[#FFE01B]" />,
    status: "connected",
    lastSync: "1 day ago",
    category: "marketing"
  },
  {
    id: "facebook-pixel",
    name: "Facebook Pixel",
    description: "Track conversions from Facebook ads",
    icon: <Facebook className="h-8 w-8 text-[#1877F2]" />,
    status: "connected",
    lastSync: "3 hours ago",
    category: "analytics"
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing and subscriptions",
    icon: <CreditCard className="h-8 w-8 text-[#635BFF]" />,
    status: "connected",
    lastSync: "30 minutes ago",
    category: "payments"
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team messaging and notifications",
    icon: <MessageSquare className="h-8 w-8 text-[#4A154B]" />,
    status: "disconnected",
    lastSync: "Never",
    category: "communication"
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect apps and automate workflows",
    icon: <Cloud className="h-8 w-8 text-[#FF4A00]" />,
    status: "connected",
    lastSync: "5 hours ago",
    category: "automation"
  },
  {
    id: "github",
    name: "GitHub",
    description: "Code repository and version control",
    icon: <Github className="h-8 w-8" />,
    status: "disconnected",
    lastSync: "Never",
    category: "development"
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "CRM, marketing, and sales platform",
    icon: <Cloud className="h-8 w-8 text-[#FF7A59]" />,
    status: "error",
    lastSync: "Error connecting",
    category: "marketing"
  }
];

export default function IntegrationsSettings() {
  // Group integrations by category
  const categories = integrations.reduce<CategoryMap>((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {});
  
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
                    {integration.icon}
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