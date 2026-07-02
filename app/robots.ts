import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',    // Keep your admin private
        '/api/',      // Don't crawl your backend routes
        '/_next/',    // Don't crawl Next.js system files
      ],
    },
    // List both to be 100% safe with Google's discovery
    sitemap: [
      'https://moger-mulluk.vercel.app/sitemap.xml',
      'https://moger-mulluk.vercel.app/final-sitemap.xml',
    ],
  }
}