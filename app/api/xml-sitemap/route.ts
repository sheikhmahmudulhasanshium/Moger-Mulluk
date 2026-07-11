// File: app/api/xml-sitemap/route.ts

// App router configuration to ensure it's always fresh
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// --- IMPORTS ---
// Adjust these import paths to match your project's actual structure.
import { routing } from '@/i18n/routing'; 
import { productApi, Product } from '@/app/components/hooks/product-api'; // Imported Product
import { offerApi } from '@/app/components/hooks/offer-api';
import { Offer } from '@/app/components/types'; // Imported Offer

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  // Ensure your routing config has locales defined
  const locales = routing.locales || ['en']; 
  const safeDate = new Date().toISOString().split('T')[0]; 

  // --- XML GENERATION LOGIC ---
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  const generateEntry = (path: string, priority: string): string => {
    let entry = '';
    locales.forEach((locale) => {
      const fullUrl = `${baseUrl}/${locale}${path}`;
      entry += `  <url>\n`;
      entry += `    <loc>${fullUrl}</loc>\n`;
      entry += `    <lastmod>${safeDate}</lastmod>\n`;
      entry += `    <priority>${priority}</priority>\n`;
      
      locales.forEach((altLocale) => {
        const altUrl = `${baseUrl}/${altLocale}${path}`;
        entry += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${altUrl}"/>\n`;
      });
      
      entry += `  </url>\n`;
    });
    return entry;
  };

  // 1. Static Pages
  xml += generateEntry('', '1.0');
  ['/menu', '/offers', '/locations', '/about', '/gallery'].forEach(p => xml += generateEntry(p, '0.8'));
  ['/faq', '/notice'].forEach(p => xml += generateEntry(p, '0.5'));

  // 2. Dynamic Products
  try {
    const products = await productApi.getAdminProducts(1, 100);
    if (products?.data && Array.isArray(products.data)) {
      // --- FIX: Replaced 'any' with 'Product' ---
      products.data.forEach((p: Product) => { 
        // Ensure 'shortId' exists on the Product type you imported
        if (p.shortId) {
          xml += generateEntry(`/menu/${p.shortId}`, '0.6');
        }
      });
    }
  } catch (e) {
    console.error('Sitemap API: Error fetching products:', e);
  }

  // 3. Dynamic Offers
  try {
    const offers = await offerApi.getByStatus('recent');
    if (offers && Array.isArray(offers)) {
      // --- FIX: Replaced 'any' with 'Offer' ---
      offers.forEach((o: Offer) => {
        // Ensure 'id' exists on the Offer type you imported
        if (o.id) {
          xml += generateEntry(`/offers/${o.id}`, '0.6');
        }
      });
    }
  } catch (e) {
    console.error('Sitemap API: Error fetching offers:', e);
  }

  xml += '</urlset>';

  // --- Return Response ---
  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=300',
    },
  });
}