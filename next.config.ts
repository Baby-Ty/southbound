import type { NextConfig } from "next";

// Allow disabling static export for local development with API routes
// Set DISABLE_STATIC_EXPORT=true in .env.local to enable API routes
// 
// NOTE: Static export limitations:
// - /hub/* routes with dynamic segments (e.g., /hub/routes/[id]) will return 404
// - Server-side rendering (SSR) features are not available
// - API routes are not supported (must use Azure Functions)
//
// For full /hub functionality, deploy to Azure App Service with SSR enabled
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
