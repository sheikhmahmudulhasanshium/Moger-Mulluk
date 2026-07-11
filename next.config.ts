import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'moger-mulluk.vercel.app' },
      { protocol: 'https', hostname: 'img.icons8.com' },
    ],
  },
};

export default withNextIntl(nextConfig);