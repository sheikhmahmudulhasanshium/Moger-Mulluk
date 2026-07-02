export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { routing } from '@/i18n/routing';
import { Product, productApi } from '@/app/components/hooks/product-api';
import { offerApi } from '@/app/components/hooks/offer-api';
import { Offer } from '@/app/components/types';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;
  const safeDate = new Date().toISOString().split('T')[0]; 

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  const generateEntry = (path: string, priority: string) => {
    let entry = '';
    locales.forEach((locale) => {
      const fullUrl = `${baseUrl}/${locale}${path}`;
      entry += `  <url>\n`;
      entry += `    <loc>${fullUrl}</loc>\n`;
      entry += `    <lastmod>${safeDate}</lastmod>\n`;
      entry += `    <priority>${priority}</priority>\n`;
      locales.forEach((altLocale) => {
        entry += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}${path}"/>\n`;
      });
      entry += `  </url>\n`;
    });
    return entry;
  };

  // 1. Static Pages
  xml += generateEntry('', '1.0');
  ['/menu', '/offers', '/locations', '/about', '/gallery'].forEach(p => xml += generateEntry(p, '0.8'));
  ['/faq', '/notice'].forEach(p => xml += generateEntry(p, '0.5'));

  // 2. Products
  try {
    const products = await productApi.getAdminProducts(1, 100);
    if (products?.data) {
      products.data.forEach((p: Product) => {
        xml += generateEntry(`/menu/${p.shortId}`, '0.6');
      });
    }
  } catch (e) { console.error(e); }

  // 3. Offers
  try {
    const offers = await offerApi.getByStatus('recent');
    if (offers) {
      offers.forEach((o: Offer) => {
        xml += generateEntry(`/offers/${o.id}`, '0.6');
      });
    }
  } catch (e) { console.error(e); }

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'index, follow',
    },
  });
}