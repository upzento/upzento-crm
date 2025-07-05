'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ClientPaymentRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/payment');
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-medium">Redirecting to Payment Dashboard...</h2>
      </div>
    </div>
  );
} 