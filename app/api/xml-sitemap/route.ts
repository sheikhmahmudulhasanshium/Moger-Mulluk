export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { routing } from '@/i18n/routing';
import { Product, productApi } from '@/app/components/hooks/product-api';
import { offerApi } from '@/app/components/hooks/offer-api';
import { Offer } from '@/app/components/types';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;
  const safeDate = "2025-01-15";

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

  // Helper to generate URL entry with priority and alternates
  const generateEntry = (path: string, priority: string) => {
    let entry = '';
    locales.forEach((locale) => {
      const fullUrl = `${baseUrl}/${locale}${path}`;
      entry += `<url>`;
      entry += `<loc>${fullUrl}</loc>`;
      entry += `<lastmod>${safeDate}</lastmod>`;
      entry += `<priority>${priority}</priority>`;
      // Add language alternates (Hreflang)
      locales.forEach((altLocale) => {
        entry += `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}${path}"/>`;
      });
      entry += `</url>`;
    });
    return entry;
  };

  // 1. Home Page (Highest Priority)
  xml += generateEntry('', '1.0');

  // 2. Main Category Pages (High Priority for Sitelinks)
  const categories = ['/menu', '/offers', '/locations', '/about', '/gallery'];
  categories.forEach(path => {
    xml += generateEntry(path, '0.8');
  });

  // 3. Static Support Pages (Lower Priority)
  const support = ['/faq', '/notice'];
  support.forEach(path => {
    xml += generateEntry(path, '0.5');
  });

  // 4. Individual Products (Deep links)
  try {
    const response = await productApi.getAdminProducts(1, 100);
    if (response?.data) {
      response.data.forEach((product: Product) => {
        xml += generateEntry(`/menu/${product.shortId}`, '0.6');
      });
    }
  } catch (error) {
    console.error("Sitemap Product error:", error);
  }

  // 5. Individual Offers
  try {
    const offers = await offerApi.getByStatus('recent');
    offers.forEach((offer: Offer) => {
      xml += generateEntry(`/offers/${offer.id}`, '0.6');
    });
  } catch (error) {
    console.error("Sitemap Offer error:", error);
  }

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'index, follow', // Changed to index so Google actually reads it
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}