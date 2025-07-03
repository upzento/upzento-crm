'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

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
      await login(email, password);
      router.push('/dashboard'); // Redirect to dashboard on success
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 relative">
      {/* Background stars effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/stars.svg')] bg-repeat" />
      </div>
      
      <div className="z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-cosmic-gradient flex items-center justify-center text-white font-space font-bold text-xl">
            U
          </div>
        </div>
        
        <h1 className="text-3xl font-bold font-space text-center mb-8 bg-clip-text text-transparent bg-cosmic-gradient">
          Login to Upzento CRM
        </h1>
        
        <div className="cosmic-card">
          {error && (
            <div className="bg-error/10 border border-error text-error rounded-cosmic p-4 mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link 
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
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
                placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="cosmic-button w-full"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-6 text-light-text-secondary dark:text-dark-text-secondary">
          Don't have an account?{' '}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
} 