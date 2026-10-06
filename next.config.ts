import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Dev only: allow opening the dev server via this machine's LAN IP (not just localhost)
  allowedDevOrigins: ['172.16.49.75'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bnblofcypxfydnptazrs.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
