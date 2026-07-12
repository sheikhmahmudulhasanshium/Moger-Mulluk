import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {source: '/sitemap.xml', destination: '/api/xml-sitemap'},
      {source: '/final-sitemap.xml', destination: '/api/xml-sitemap'},
      {source: '/robots.txt', destination: '/api/robots-txt'},
    ];
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // FIX: connect-src * allows Next.js WebSockets to work on any local network IP.
            // frame-src and script-src explicitly allow youtube-nocookie.com.
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src *; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.youtube.com https://www.youtube-nocookie.com https://static.doubleclick.net; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; media-src 'self' https:; font-src 'self' data:; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'self';",
          }
        ],
      },
    ];
  },

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