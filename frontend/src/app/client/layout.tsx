'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  BarChart,
  FileText,
  Star,
  MessageSquare,
  Phone,
  Calendar,
  ShoppingBag,
  CreditCard,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/client', icon: LayoutDashboard },
  { name: 'Contacts', href: '/client/contacts', icon: Users },
  { name: 'Analytics', href: '/client/analytics', icon: BarChart },
  { name: 'Forms', href: '/client/forms', icon: FileText },
  { name: 'Reviews', href: '/client/reviews', icon: Star },
  { name: 'Chat', href: '/client/chat', icon: MessageSquare },
  { name: 'Phone & SMS', href: '/client/phone-sms', icon: Phone },
  { name: 'Appointments', href: '/client/appointments', icon: Calendar },
  { name: 'Shop', href: '/client/shop', icon: ShoppingBag },
  { name: 'Payment', href: '/client/payment', icon: CreditCard },
  { name: 'Support', href: '/client/support', icon: HelpCircle },
  { name: 'Settings', href: '/client/settings', icon: Settings },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="h-16 flex items-center px-6">
          <h1 className="text-xl font-bold">Upzento Client</h1>
        </div>
        <nav className="px-4 py-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-2">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                C
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Client User
              </p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 