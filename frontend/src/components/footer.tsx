'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-light-surface dark:bg-dark-surface py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* Logo placeholder */}
              <div className="w-8 h-8 rounded-full bg-cosmic-gradient flex items-center justify-center text-white font-space font-bold text-sm">
                U
              </div>
              <span className="font-space font-bold text-xl">Upzento</span>
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
              A multi-tenant CRM platform for agencies and their clients
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
          
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-space font-semibold mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-light-text-secondary/10 dark:border-dark-text-secondary/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            © {new Date().getFullYear()} Upzento CRM. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Social media icons (these would be proper icons in a real app)
const socialLinks = [
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: 'X',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: 'in',
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: '</>',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: 'f',
  },
];

// Footer link groups
const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Modules', href: '/modules' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Guides', href: '/guides' },
      { label: 'API Reference', href: '/api' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Partners', href: '/partners' },
    ],
  },
]; 