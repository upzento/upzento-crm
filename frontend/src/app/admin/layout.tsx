'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CreditCard, 
  Settings, 
  ShieldCheck,
  Activity,
  BarChart3,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
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
    href: '/admin',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    title: 'Agencies',
    href: '/admin/agencies',
    icon: <Building2 className="h-5 w-5" />
  },
  {
    title: 'Clients',
    href: '/admin/clients',
    icon: <Users className="h-5 w-5" />
  },
  {
    title: 'Subscriptions',
    href: '/admin/subscriptions',
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    title: 'Security',
    href: '/admin/security',
    icon: <ShieldCheck className="h-5 w-5" />
  },
  {
    title: 'System Logs',
    href: '/admin/logs',
    icon: <Activity className="h-5 w-5" />
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-background border-r">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Upzento Admin</h2>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link 
                  href={item.href} 
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === item.href 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                A
              </div>
              <span className="ml-2 font-medium">Admin User</span>
            </div>
            <ThemeToggle />
          </div>
          <Link 
            href="/login" 
            className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Link>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar for mobile */}
        <header className="md:hidden bg-background border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Upzento Admin</h2>
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-muted/40 p-4">
          {children}
        </main>
      </div>
    </div>
  );
} 