import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  devIndicators: false,
  trailingSlash: true,
};
export default nextConfig;
