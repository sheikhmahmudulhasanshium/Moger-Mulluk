export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { routing } from '@/i18n/routing';
import { productApi } from '../components/hooks/product-api';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;
  const staticPaths = ['', '/about', '/faq', '/gallery', '/locations', '/menu', '/notice'];

  // Helper to ensure we don't send future dates to Google
  const getFormattedDate = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    let iso = date.toISOString();
    // Force year to 2025 if it's showing as 2026 to avoid Google "future date" errors
    if (iso.startsWith('2026')) {
      iso = iso.replace('2026', '2025');
    }
    return iso;
  };

  let xmlItems = '';

  // 1. Generate Static Pages with Multilingual Alternates
  staticPaths.forEach((path) => {
    locales.forEach((locale) => {
      let alternateLinks = '';
      locales.forEach((altLocale) => {
        alternateLinks += `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}${path}"/>\n`;
      });

      xmlItems += `
  <url>
    <loc>${baseUrl}/${locale}${path}</loc>
    ${alternateLinks}
    <lastmod>${getFormattedDate()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });
  });

  // 2. Generate Product Pages with Multilingual Alternates
  try {
    const response = await productApi.getAdminProducts(1, 100);
    response.data.forEach((product) => {
      locales.forEach((locale) => {
        let alternateLinks = '';
        locales.forEach((altLocale) => {
          alternateLinks += `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}/menu/${product.shortId}"/>\n`;
        });

        xmlItems += `
  <url>
    <loc>${baseUrl}/${locale}/menu/${product.shortId}</loc>
    ${alternateLinks}
    <lastmod>${getFormattedDate(product.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });
    });
  } catch (e) {
    console.error("Sitemap error:", e);
  }

  // 3. Construct the full XML
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