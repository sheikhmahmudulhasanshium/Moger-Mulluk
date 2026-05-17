import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { productApi } from './components/hooks/product-api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://moger-mulluk.vercel.app';
  const locales = routing.locales;

  // 1. Static Routes
  const staticPaths = [
    '',
    '/about',
    '/faq',
    '/gallery',
    '/locations',
    '/menu',
    '/notice',
  ];

  // 2. Fetch Products for Dynamic Routes
  let productEntries: MetadataRoute.Sitemap = [];
  
  try {
    // Fetch products (adjust limit if you have more than 100 items)
    const response = await productApi.getAdminProducts(1, 100);
    const products = response.data;

    productEntries = products.flatMap((product) => {
      // Use shortId as per your getDetail API requirement
      const productId = product.shortId; 
      
      return locales.map((locale) => ({
        url: `${baseUrl}/${locale}/menu/${productId}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/menu/${productId}`])
          ),
        },
      }));
    });
  } catch (error) {
    console.error("Sitemap: Failed to fetch products from backend", error);
  }

  // 3. Generate Static Page Entries
  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((path) => {
    return locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${path}`])
        ),
      },
    }));
  });

  return [...staticEntries, ...productEntries];
}