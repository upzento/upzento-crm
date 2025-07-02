'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function CampaignsRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the client campaigns page
    router.push('/client/campaigns');
  }, [router]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p className="text-muted-foreground">Redirecting to campaigns management...</p>
    </div>
  );
} 