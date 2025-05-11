// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sdnfutsal.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;