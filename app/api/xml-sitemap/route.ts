export const dynamic = 'force-dynamic';
export const revalidate = 0; 

import { routing } from '@/i18n/routing';
import { Product, productApi } from '@/app/components/hooks/product-api';
import { offerApi } from '@/app/components/hooks/offer-api'; // 1. Import Offer API
import { Offer } from '@/app/components/types';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;
  
  // Update to a current 2025 date
  const safeDate = "2025-01-15"; 

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  // 1. Static Pages (Added /offers here)
  const staticPaths = ['', '/about', '/faq', '/gallery', '/locations', '/menu', '/notice', '/offers'];
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
    console.error("Sitemap Product error:", error);
  }

  // 3. Dynamic Offers (Added this section)
  try {
    // Fetch recent/active offers
    const offers = await offerApi.getByStatus('recent'); 
    offers.forEach((offer: Offer) => {
      locales.forEach((locale) => {
        xml += `<url><loc>${baseUrl}/${locale}/offers/${offer.id}</loc><lastmod>${safeDate}</lastmod></url>`;
      });
    });
  } catch (error) {
    console.error("Sitemap Offer error:", error);
  }

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'noindex, follow', 
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}