/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
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
    config.ignoreWarnings = [/Module not found/];
    return config;
  },
  experimental: {
    // Skip type checking during build for better performance
    skipTypeCheck: true,
    // Ignore missing modules during build
    esmExternals: 'loose',
  }
}

module.exports = nextConfig
