// File: app/sitemap.xml/route.ts

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Imports adjusted based on the snippets you provided
import { routing } from '@/i18n/routing';
// Assuming these hooks exist and are typed correctly in your project
import { Product, productApi } from '@/app/components/hooks/product-api';
import { offerApi } from '@/app/components/hooks/offer-api';
import { Offer } from '@/app/components/types';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  // Use the locales defined in your i18n config
  const locales = routing.locales;
  // Generate current date in YYYY-MM-DD format
  const safeDate = new Date().toISOString().split('T')[0]; 

  // Start building the XML string
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  // Use standard sitemap namespace, plus xhtml for hreflang
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // Helper function to generate entries for every locale for a given path
  const generateEntry = (path: string, priority: string) => {
    let entry = '';
    locales.forEach((locale) => {
      const fullUrl = `${baseUrl}/${locale}${path}`;
      entry += `  <url>\n`;
      entry += `    <loc>${fullUrl}</loc>\n`;
      entry += `    <lastmod>${safeDate}</lastmod>\n`;
      entry += `    <priority>${priority}</priority>\n`;
      
      // Add xhtml:link for multilingual support in Google
      locales.forEach((altLocale) => {
        const altUrl = `${baseUrl}/${altLocale}${path}`;
        entry += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${altUrl}"/>\n`;
      });
      
      entry += `  </url>\n`;
    });
    return entry;
  };

  // 1. Add Static Pages defined in your application
  xml += generateEntry('', '1.0');
  ['/menu', '/offers', '/locations', '/about', '/gallery'].forEach(p => xml += generateEntry(p, '0.8'));
  ['/faq', '/notice'].forEach(p => xml += generateEntry(p, '0.5'));

  // 2. Add Dynamic Products (fetched from API)
  try {
    const products = await productApi.getAdminProducts(1, 100);
    if (products && Array.isArray(products.data)) {
      products.data.forEach((p: Product) => {
        // Adjust path if your dynamic routes are different (e.g., [id])
        xml += generateEntry(`/menu/${p.shortId}`, '0.6');
      });
    }
  } catch (e) { console.error('Sitemap Product Error:', e); }

  // 3. Add Dynamic Offers (fetched from API)
  try {
    const offers = await offerApi.getByStatus('recent');
    if (offers && Array.isArray(offers)) {
      offers.forEach((o: Offer) => {
        xml += generateEntry(`/offers/${o.id}`, '0.6');
      });
    }
  } catch (e) { console.error('Sitemap Offer Error:', e); }

  xml += '</urlset>';

  // --- CRITICAL FIX: Set the correct content type ---
  // This ensures Googlebot reads it as XML, not HTML.
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0', // Sitemaps should always be fresh
    },
  });
}