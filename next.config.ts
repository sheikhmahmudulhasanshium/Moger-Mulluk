import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const nextConfig: NextConfig = {
    async rewrites() {
        return[
            // Also add the standard name as a backup

            {
                source: '/sitemap.xml',
                destination: '/api/xml-sitemap',
            },
            {
                source: '/final-sitemap.xml',
                destination: '/api/xml-sitemap',
            },      
        ]
    },
images: {
remotePatterns: [
{ protocol: 'https', hostname: 'youtube.com' },
{ protocol: 'https', hostname: 'i.ytimg.com' },
{ protocol: 'https', hostname: 'res.cloudinary.com' },
{ protocol: 'https', hostname: 'images.unsplash.com' },
],
},
};
export default withNextIntl(nextConfig);