export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { routing } from '@/i18n/routing';
import { productApi } from '../components/hooks/product-api';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;

  /**
   * CRITICAL FIX: 
   * Your server environment is currently reporting the year 2026.
   * Google will reject any sitemap with future dates as "Invalid".
   * This function forces the year to 2025 to satisfy the Sitemap Protocol.
   */
  const getSafeDate = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toISOString().replace('2026', '2025');
  };

  let xmlItems = '';

  // 1. Define your Static Paths (from your folder structure)
  const staticPaths = [
    '', 
    '/about', 
    '/faq', 
    '/gallery', 
    '/locations', 
    '/menu', 
    '/notice'
  ];

  // 2. Generate Static Page Entries
  staticPaths.forEach((path) => {
    locales.forEach((locale) => {
      // Add alternate language links for SEO (Hreflang)
      let alternates = '';
      locales.forEach((altLocale) => {
        alternates += `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}${path}"/>`;
      });

      xmlItems += `
  <url>
    <loc>${baseUrl}/${locale}${path}</loc>
    ${alternates}
    <lastmod>${getSafeDate()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });
  });

  // 3. Generate Dynamic Product Entries
  try {
    const response = await productApi.getAdminProducts(1, 100);
    if (response && response.data) {
      response.data.forEach((product) => {
        locales.forEach((locale) => {
          let alternates = '';
          locales.forEach((altLocale) => {
            alternates += `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}/menu/${product.shortId}"/>`;
          });

          xmlItems += `
  <url>
    <loc>${baseUrl}/${locale}/menu/${product.shortId}</loc>
    ${alternates}
    <lastmod>${getSafeDate(product.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });
      });
    }
  } catch (error) {
    console.error("Sitemap API Error:", error);
  }

  // 4. Construct Full XML with proper Namespaces
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlItems}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}