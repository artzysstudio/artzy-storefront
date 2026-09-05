import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

export const dynamic = 'force-static';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.artzysstudio.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // We fetch dynamic pages and products from the ERP
  const products = await api.products.list();
  
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/shop/?product=${encodeURIComponent(product.id)}`,
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
      url: `${BASE_URL}/shop/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/original-art/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/name-plates/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/digital-prints/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/caricatures/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/gifts/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/personalised/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/for-business/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/artzy-world/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/artzy-world/preview/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...[
      'shipping-policy',
      'returns-policy',
      'customised-product-policy',
      'cancellation-policy',
      'privacy-policy',
      'terms-and-conditions',
      'ai-concept-disclosure',
    ].map((route): MetadataRoute.Sitemap[number] => ({
      url: `${BASE_URL}/${route}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    })),
  ];

  return [...coreRoutes, ...productEntries];
}
