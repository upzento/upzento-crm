'use client';

import React from 'react';
import { ThemeProvider } from '@/lib/theme-provider';
import { AuthProvider } from '@/lib/auth-context';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="upzento-theme">
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
} 