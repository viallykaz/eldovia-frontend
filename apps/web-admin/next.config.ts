import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3005' },
      { protocol: 'http', hostname: 'localhost', port: '3004' },
      { protocol: 'http', hostname: 'localhost', port: '3000' },
    ],
  },
};

export default config;
