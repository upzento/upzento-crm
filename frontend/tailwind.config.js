/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'dark-bg': '#0F1123',
        'dark-surface': '#1A1C2E',
        'dark-text-primary': '#FFFFFF',
        'dark-text-secondary': '#B0B0C0',
        
        // Light theme colors
        'light-bg': '#F8F9FE',
        'light-surface': '#FFFFFF',
        'light-text-primary': '#1A1C2E',
        'light-text-secondary': '#5F6180',
        
        // Brand colors (shared between themes)
        'primary': '#3D5AFE',
        'secondary': '#FF4081',
        'accent': '#FFD700',
        'success': '#00E676',
        'error': '#FF3D00',
        'warning': '#FFEA00',
        
        // Additional cosmic palette
        'cosmic-blue': {
          50: '#EAEFFF',
          100: '#D6DFFF',
          200: '#ADBEFF',
          300: '#849EFF',
          400: '#5B7DFF',
          500: '#3D5AFE', // Primary
          600: '#3047CB',
          700: '#243598',
          800: '#182366',
          900: '#0C1133',
        },
        'nebula-pink': {
          50: '#FFE1EC',
          100: '#FFC3D9',
          200: '#FF87B3',
          300: '#FF4B8E',
          400: '#FF4081', // Secondary
          500: '#E91E63',
          600: '#B0174D',
          700: '#841039',
          800: '#580A26',
          900: '#2C0513',
        },
        'stardust-gold': {
          50: '#FFF9E0',
          100: '#FFF4C2',
          200: '#FFE985',
          300: '#FFDE47',
          400: '#FFD700', // Accent
          500: '#FFC107',
          600: '#CC9C00',
          700: '#997500',
          800: '#664E00',
          900: '#332700',
        },
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(to right, #3D5AFE, #AA00FF)',
        'nebula-gradient': 'linear-gradient(to right, #FF4081, #AA00FF)',
        'aurora-gradient': 'linear-gradient(to right, #00E676, #3D5AFE)',
        'star-field': 'url("/images/star-field.svg")',
      },
      fontFamily: {
        'space': ['"Space Grotesk"', 'sans-serif'],
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'cosmic': '0 8px 16px rgba(0, 0, 0, 0.3), 0 0 8px rgba(61, 90, 254, 0.2)',
        'cosmic-hover': '0 12px 24px rgba(0, 0, 0, 0.4), 0 0 12px rgba(61, 90, 254, 0.3)',
        'stellar': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'stellar-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'orbit': 'orbit 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(10px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(10px) rotate(-360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(61, 90, 254, 0.2)' },
          '50%': { boxShadow: '0 0 16px rgba(61, 90, 254, 0.5)' },
        },
      },
      borderRadius: {
        'cosmic': '8px',
      },
    },
  },
  plugins: [],
} 