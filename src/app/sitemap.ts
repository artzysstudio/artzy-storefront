import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

const BASE_URL = 'https://artzysstudio.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // We fetch dynamic pages and products from the ERP
  const products = await api.products.list();
  
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/shop/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Core static/dynamic routes
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return [...coreRoutes, ...productEntries];
}
