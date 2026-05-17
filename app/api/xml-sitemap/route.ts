export const dynamic = 'force-dynamic';
// Set a tiny revalidate to help Vercel's edge cache the "Correct" date
export const revalidate = 60; 

import { routing } from '@/i18n/routing';
import { productApi } from '@/app/components/hooks/product-api';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;
  
  // FORCE 2025: Do not use variables that might carry the 2026 bug
  const safeDate = "2025-05-18T12:00:00Z";

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  // 1. Static Pages
  const staticPaths = ['', '/about', '/faq', '/gallery', '/locations', '/menu', '/notice'];
  staticPaths.forEach((path) => {
    locales.forEach((locale) => {
      xml += `<url><loc>${baseUrl}/${locale}${path}</loc><lastmod>${safeDate}</lastmod></url>`;
    });
  });

  // 2. Products
  try {
    const response = await productApi.getAdminProducts(1, 100);
    if (response && response.data) {
      response.data.forEach((product) => {
        locales.forEach((locale) => {
          xml += `<url><loc>${baseUrl}/${locale}/menu/${product.shortId}</loc><lastmod>${safeDate}</lastmod></url>`;
        });
      });
    }
  } catch {
    // Silent catch to ensure we don't break the XML
  }

  xml += '</urlset>';

  // TRIMMING: We force the string to end exactly at </urlset>
  const finalXml = xml.trim();

  return new Response(finalXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      // Tell Google to cache this for 1 day so the "2026" header date 
      // doesn't keep changing every second
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}