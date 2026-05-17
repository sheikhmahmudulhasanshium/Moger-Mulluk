export const dynamic = 'force-dynamic';

import { productApi } from '@/app/components/hooks/product-api';
import { routing } from '@/i18n/routing';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;
  const safeDate = "2025-05-18T12:00:00.000Z"; // Hardcoded to bypass server 2026 bug

  let xmlItems = '';
  const staticPaths = ['', '/about', '/faq', '/gallery', '/locations', '/menu', '/notice'];

  staticPaths.forEach((p) => {
    locales.forEach((l) => {
      xmlItems += `<url><loc>${baseUrl}/${l}${p}</loc><lastmod>${safeDate}</lastmod><priority>0.8</priority></url>`;
    });
  });

  try {
    const res = await productApi.getAdminProducts(1, 100);
    res.data.forEach((prod) => {
      locales.forEach((loc) => {
        xmlItems += `<url><loc>${baseUrl}/${loc}/menu/${prod.shortId}</loc><lastmod>${safeDate}</lastmod><priority>0.7</priority></url>`;
      });
    });
  } catch { /* Fail silently */ }

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlItems}</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml', 'X-Content-Type-Options': 'nosniff' },
  });
}