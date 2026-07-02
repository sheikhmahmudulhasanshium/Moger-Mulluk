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

  const generateEntry = (path: string, priority: string) => {
    let entry = '';
    locales.forEach((locale) => {
      const fullUrl = `${baseUrl}/${locale}${path}`;
      entry += `<url>`;
      entry += `<loc>${fullUrl}</loc>`;
      entry += `<lastmod>${safeDate}</lastmod>`;
      entry += `<priority>${priority}</priority>`;
      locales.forEach((altLocale) => {
        entry += `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}${path}"/>`;
      });
      entry += `</url>`;
    });
    return entry;
  };

  // 1. Static & Category Pages
  xml += generateEntry('', '1.0');
  ['/menu', '/offers', '/locations', '/about', '/gallery'].forEach(p => {
    xml += generateEntry(p, '0.8');
  });
  ['/faq', '/notice'].forEach(p => {
    xml += generateEntry(p, '0.5');
  });

  // 2. Dynamic Product Pages (Fixing 'any' error)
  try {
    const response = await productApi.getAdminProducts(1, 100);
    if (response?.data) {
      response.data.forEach((p: Product) => { // Use 'Product' instead of 'any'
        xml += generateEntry(`/menu/${p.shortId}`, '0.6');
      });
    }
  } catch (error) {
    console.error("Sitemap Product error:", error);
  }

  // 3. Dynamic Offer Pages (Fixing 'any' error)
  try {
    const offers = await offerApi.getByStatus('recent');
    if (offers) {
      offers.forEach((o: Offer) => { // Use 'Offer' instead of 'any'
        xml += generateEntry(`/offers/${o.id}`, '0.6');
      });
    }
  } catch (error) {
    console.error("Sitemap Offer error:", error);
  }

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'X-Robots-Tag': 'index, follow',
    },
  });
}