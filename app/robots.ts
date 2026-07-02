import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/api/',
        // REMOVED /_next/ to allow the crawler to see your CSS/Styles
      ],
    },
    sitemap: [
      'https://moger-mulluk.vercel.app/sitemap.xml',
      'https://moger-mulluk.vercel.app/final-sitemap.xml',
    ],
  }
}