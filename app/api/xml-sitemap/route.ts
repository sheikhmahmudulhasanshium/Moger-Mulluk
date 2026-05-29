export const dynamic = 'force-dynamic';
export const revalidate = 0; 

import { routing } from '@/i18n/routing';
import { Product, productApi } from '@/app/components/hooks/product-api';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;
  
  // FIX: Force a 2024/2025 date. Do NOT use 2026.
  const safeDate = "2024-12-01"; 

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
      response.data.forEach((product: Product) => {
        locales.forEach((locale) => {
          xml += `<url><loc>${baseUrl}/${locale}/menu/${product.shortId}</loc><lastmod>${safeDate}</lastmod></url>`;
        });
      });
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // This tells Google "Yes, you are allowed to read this"
      'X-Robots-Tag': 'noindex, follow', 
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}