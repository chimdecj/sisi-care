import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  devIndicators: false,
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
