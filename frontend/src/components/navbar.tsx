'use client';

import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Menu, Bell, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </Button>
      
      {/* Page title - would be dynamic in a real app */}
      <h1 className="text-xl font-semibold hidden md:block">Dashboard</h1>
      
      {/* Right actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        {/* Notifications button */}
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        {/* User dropdown - simplified for now */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
} 