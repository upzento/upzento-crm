'use client';

import { useTheme } from '@/lib/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Image from 'next/image';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center p-8 pt-24 relative">
        {/* Background stars effect */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/stars.svg')] bg-repeat" />
        </div>
        
        {/* Main content */}
        <div className="z-10 max-w-5xl w-full flex flex-col items-center gap-12 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 mb-4">
              {/* Placeholder for logo - replace with actual logo */}
              <div className="w-24 h-24 rounded-full bg-cosmic-gradient animate-pulse-glow flex items-center justify-center text-white font-space font-bold text-2xl">
                U
              </div>
            </div>
            
            <h1 className="text-5xl font-bold font-space bg-clip-text text-transparent bg-cosmic-gradient">
              Upzento CRM
            </h1>
            
            <p className="text-xl max-w-3xl text-light-text-secondary dark:text-dark-text-secondary">
              A multi-tenant CRM platform for agencies and their clients, with a modern cosmic UI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {features.map((feature) => (
              <div key={feature.title} className="cosmic-card group">
                <div className="mb-4 text-4xl text-primary">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex gap-4 mt-8">
            <button 
              onClick={toggleTheme}
              className="cosmic-button"
            >
              Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
            
            <a href="/login" className="cosmic-button bg-secondary hover:shadow-[0_0_16px_rgba(255,64,129,0.5)]">
              Get Started
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Feature list with icons (these could be SVG icons in a production app)
const features = [
  {
    title: 'Multi-tenant Architecture',
    description: 'Securely manage agencies and their clients with complete data isolation.',
    icon: 'ð¢',
  },
  {
    title: 'Modular Design',
    description: 'Access 12+ business growth modules that can be enabled as needed.',
    icon: 'ð§©',
  },
  {
    title: 'Embeddable Widgets',
    description: 'Embed booking forms, reviews, and more on your website with domain control.',
    icon: 'ð¦',
  },
  {
    title: 'Cosmic UI',
    description: 'Modern space-themed interface with both dark and light modes.',
    icon: 'â¨',
  },
  {
    title: 'Mobile Ready',
    description: 'Responsive design works seamlessly on all devices.',
    icon: 'ð±',
  },
  {
    title: 'Advanced Analytics',
    description: 'Comprehensive dashboards for all your business data.',
    icon: 'ð',
  },
]; 