export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { routing } from '@/i18n/routing';
import { productApi } from '../components/hooks/product-api';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;
  
  // HARD-CODED: No more 2026 errors
  const safeDate = "2025-05-18T10:00:00.000Z";

  let xmlItems = '';
  const staticPaths = ['', '/about', '/faq', '/gallery', '/locations', '/menu', '/notice'];

  staticPaths.forEach((path) => {
    locales.forEach((locale) => {
      xmlItems += `
  <url>
    <loc>${baseUrl}/${locale}${path}</loc>
    <lastmod>${safeDate}</lastmod>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });
  });

  try {
    const response = await productApi.getAdminProducts(1, 100);
    response.data.forEach((product) => {
      locales.forEach((locale) => {
        xmlItems += `
  <url>
    <loc>${baseUrl}/${locale}/menu/${product.shortId}</loc>
    <lastmod>${safeDate}</lastmod>
    <priority>0.7</priority>
  </url>`;
      });
    });
  } catch (e) { console.error(e); }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}