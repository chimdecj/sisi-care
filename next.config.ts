import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Limit build concurrency to fit shared-hosting memory limits.
  experimental: {
    cpus: 1,
    webpackMemoryOptimizations: true,
  },
  turbopack: { root: process.cwd() },
  devIndicators: false,
  trailingSlash: true,
};
export default nextConfig;
