"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardAnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to client analytics
    router.push('/client/analytics');
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-medium">Redirecting to Client Analytics...</h2>
        <p className="text-muted-foreground mt-2">
          The dashboard has been moved to the client area.
        </p>
      </div>
    </div>
  );
} 