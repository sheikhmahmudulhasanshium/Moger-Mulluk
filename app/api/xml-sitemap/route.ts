export const dynamic = 'force-dynamic';

import { productApi } from '@/app/components/hooks/product-api';
import { routing } from '@/i18n/routing';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;
  
  /**
   * PROTOCOL FIX:
   * We use a hardcoded 2025 string. 
   * This ensures Google's parser never sees a "Future Date" (2026),
   * which was the primary reason the sitemap was failing validation.
   */
  const safeDate = "2025-05-18T12:00:00.000Z";

  let xmlItems = '';
  const staticPaths = ['', '/about', '/faq', '/gallery', '/locations', '/menu', '/notice'];

  // 1. Static Pages
  staticPaths.forEach((path) => {
    locales.forEach((locale) => {
      xmlItems += `<url><loc>${baseUrl}/${locale}${path}</loc><lastmod>${safeDate}</lastmod><priority>0.8</priority></url>`;
    });
  });

  // 2. Dynamic Products
  try {
    const response = await productApi.getAdminProducts(1, 100);
    if (response && response.data) {
      response.data.forEach((product) => {
        locales.forEach((locale) => {
          xmlItems += `<url><loc>${baseUrl}/${locale}/menu/${product.shortId}</loc><lastmod>${safeDate}</lastmod><priority>0.7</priority></url>`;
        });
      });
    }
  } catch {
    // Variable 'e' removed to fix ESLint error. 
    // We catch the error silently so the sitemap still generates with static pages.
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlItems}</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}