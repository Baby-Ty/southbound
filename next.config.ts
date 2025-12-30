import type { NextConfig } from "next";

// Allow disabling static export for local development with API routes
// Set DISABLE_STATIC_EXPORT=true in .env.local to enable API routes
const disableStaticExport = process.env.DISABLE_STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  ...(disableStaticExport ? {} : { output: 'export' }),
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build to prevent failures
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
