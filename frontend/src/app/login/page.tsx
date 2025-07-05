'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // For demo purposes - admin credentials
      if (email === 'admin@upzento.com' && password === 'admin123') {
        // Simulate successful login
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push('/admin');
        return;
      }
      
      // For demo purposes - agency credentials
      if (email === 'agency@upzento.com' && password === 'agency123') {
        // Simulate successful login
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push('/agency');
        return;
      }
      
      // For demo purposes - client credentials
      if (email === 'client@upzento.com' && password === 'client123') {
        // Simulate successful login
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push('/client');
        return;
      }
      
      // Real authentication flow
      const result = await login(email, password);
      
      // Redirect based on user role
      if (result?.tenantContext?.isAdmin) {
        router.push('/admin');
      } else if (result?.tenantContext?.isAgencyUser) {
        router.push('/agency');
      } else if (result?.tenantContext?.isClientUser) {
        router.push('/client');
      } else {
        // Default fallback
        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials
  const setDemoCredentials = (type: 'admin' | 'agency' | 'client') => {
    switch (type) {
      case 'admin':
        setEmail('admin@upzento.com');
        setPassword('admin123');
        break;
      case 'agency':
        setEmail('agency@upzento.com');
        setPassword('agency123');
        break;
      case 'client':
        setEmail('client@upzento.com');
        setPassword('client123');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative cosmic-background">
      <div className="z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-cosmic-gradient flex items-center justify-center text-white font-space font-bold text-2xl shadow-[0_0_20px_rgba(61,90,254,0.5)]">
            U
          </div>
        </div>
        
        <h1 className="text-3xl font-bold font-space text-center mb-8 text-text-primary">
          Login to Upzento CRM
        </h1>
        
        <div className="cosmic-card border border-surface/20">
          {error && (
            <div className="bg-error/10 border border-error text-error rounded-md p-4 mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="cosmic-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cosmic-input w-full"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="cosmic-label">
                  Password
                </label>
                <Link 
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cosmic-input w-full"
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              variant="cosmic"
              className="w-full"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {/* Demo credentials section */}
          <div className="mt-6 pt-6 border-t border-surface/20">
            <p className="text-sm text-text-secondary mb-2">Demo accounts:</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDemoCredentials('admin')}
              >
                Admin
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDemoCredentials('agency')}
              >
                Agency
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDemoCredentials('client')}
              >
                Client
              </Button>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-6 text-text-secondary">
          Don't have an account?{' '}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
} 