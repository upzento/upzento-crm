'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/navbar';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings,
  Phone,
  Star,
  ShoppingCart,
  FileText,
  BarChart3,
  CircleDollarSign,
  Mail,
  Home,
  Megaphone
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  title: string;
  href: string;
  icon: JSX.Element;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    title: 'Contacts',
    href: '/dashboard/contacts',
    icon: <Users className="h-5 w-5" />
  },
  {
    title: 'Appointments',
    href: '/dashboard/appointments',
    icon: <Calendar className="h-5 w-5" />
  },
  {
    title: 'Chat',
    href: '/dashboard/chat',
    icon: <MessageSquare className="h-5 w-5" />
  },
  {
    title: 'Phone & SMS',
    href: '/dashboard/phone-sms',
    icon: <Phone className="h-5 w-5" />
  },
  {
    title: 'Reviews',
    href: '/dashboard/reviews',
    icon: <Star className="h-5 w-5" />
  },
  {
    title: 'Shop',
    href: '/dashboard/shop',
    icon: <ShoppingCart className="h-5 w-5" />
  },
  {
    title: 'Forms',
    href: '/dashboard/forms',
    icon: <FileText className="h-5 w-5" />
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    title: 'Payment',
    href: '/dashboard/payment',
    icon: <CircleDollarSign className="h-5 w-5" />
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, tenantContext, logout } = useAuth();
  
  // Determine navigation items based on user role/tenant context
  const navItems = getNavItems(tenantContext);
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-background border-r">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Upzento</h2>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <a 
                  href={item.href} 
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-muted/40 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

// Helper function to get navigation items based on tenant context
function getNavItems(tenantContext: any) {
  const items = [];
  
  // Add common items for all roles
  items.push(
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Contacts",
      href: "/dashboard/contacts",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Forms",
      href: "/dashboard/forms",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Campaigns",
      href: "/dashboard/campaigns",
      icon: <Megaphone className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Phone & SMS",
      href: "/dashboard/phone-sms",
      icon: <Phone className="h-5 w-5" />,
    },
    {
      title: "Reviews",
      href: "/dashboard/reviews",
      icon: <Star className="h-5 w-5" />,
    },
    {
      title: "Shop",
      href: "/dashboard/shop",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "Payment",
      href: "/dashboard/payment",
      icon: <CircleDollarSign className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    }
  );
  
  return items;
} 