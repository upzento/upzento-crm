/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
  experimental: {
    // Skip type checking during build for better performance
    skipTypeCheck: true,
    // Ignore missing modules during build
    esmExternals: 'loose',
    // Use SWC for faster builds
    swcPlugins: [],
  },
  // Disable static export errors
  outputFileTracing: false,
  // Disable image optimization
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
