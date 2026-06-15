import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@eldovia/ui'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.unsplash.com' },
    ],
  },
};

export default nextConfig;
