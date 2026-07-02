export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { routing } from '@/i18n/routing';
import { Product, productApi } from '@/app/components/hooks/product-api';
import { offerApi } from '@/app/components/hooks/offer-api';
import { Offer } from '@/app/components/types';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;
  const safeDate = new Date().toISOString().split('T')[0]; // Use real current date

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  const generateEntry = (path: string, priority: string) => {
    let entry = '';
    locales.forEach((locale) => {
      const fullUrl = `${baseUrl}/${locale}${path}`;
      entry += `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${safeDate}</lastmod>
    <priority>${priority}</priority>`;
      locales.forEach((altLocale) => {
        entry += `
    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}${path}"/>`;
      });
      entry += `
  </url>`;
    });
    return entry;
  };

  // Build XML Sections
  xml += generateEntry('', '1.0');
  ['/menu', '/offers', '/locations', '/about', '/gallery'].forEach(p => xml += generateEntry(p, '0.8'));
  ['/faq', '/notice'].forEach(p => xml += generateEntry(p, '0.5'));

  try {
    const products = await productApi.getAdminProducts(1, 100);
    products?.data?.forEach((p: Product) => xml += generateEntry(`/menu/${p.shortId}`, '0.6'));
    
    const offers = await offerApi.getByStatus('recent');
    offers?.forEach((o: Offer) => xml += generateEntry(`/offers/${o.id}`, '0.6'));
  } catch (e) {
    console.error("Sitemap generation error:", e);
  }

  xml += '\n</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'index, follow',
    },
  });
}