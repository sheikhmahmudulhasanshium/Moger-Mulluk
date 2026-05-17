import { routing } from '@/i18n/routing';
import { productApi } from '../components/hooks/product-api';

export async function GET() {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;
  const staticPaths = ['', '/about', '/faq', '/gallery', '/locations', '/menu', '/notice'];

  let xmlItems = '';

  // 1. Add Static Pages
  staticPaths.forEach((path) => {
    locales.forEach((locale) => {
      xmlItems += `
  <url>
    <loc>${baseUrl}/${locale}${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });
  });

  // 2. Add Dynamic Products
  try {
    const response = await productApi.getAdminProducts(1, 100);
    response.data.forEach((product) => {
      locales.forEach((locale) => {
        xmlItems += `
  <url>
    <loc>${baseUrl}/${locale}/menu/${product.shortId}</loc>
    <lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>
    <priority>0.7</priority>
  </url>`;
      });
    });
  } catch (e) {
    console.error("Sitemap error:", e);
  }

  // 3. Construct the full XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlItems}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}