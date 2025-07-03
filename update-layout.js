const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'frontend', 'src', 'app', 'layout.tsx');

const content = `import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Load fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Upzento CRM - Multi-tenant Business Growth Platform',
  description: 'A comprehensive CRM platform for agencies and their clients with a modern, cosmic UI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={\`\${inter.variable} \${spaceGrotesk.variable} \${jetbrainsMono.variable} font-sans\`}>
        {children}
      </body>
    </html>
  );
}`;

fs.writeFileSync(layoutPath, content, 'utf8');
console.log('Layout file updated successfully!'); 