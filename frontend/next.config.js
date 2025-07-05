/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Ignore module not found errors
    config.ignoreWarnings = [/Module not found/, /Critical dependency/];
    
    // Fix JSX errors
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
      };
    }
    
    return config;
  },
  // Disable static export errors
  outputFileTracing: false,
  // Disable image optimization
  images: {
    unoptimized: true,
    domains: ['api.upzento.com', 'app.upzento.com'],
  },
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.upzento.com/:path*',
      },
    ];
  },
}

module.exports = nextConfig
