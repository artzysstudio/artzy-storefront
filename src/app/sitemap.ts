import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.artzysstudio.in';
const CONTENT_RELEASE_DATE = new Date('2026-09-05T00:00:00+05:30');

const routes = [
  ['', 'daily', 1], ['shop', 'daily', 0.9], ['about', 'monthly', 0.7],
  ['original-art', 'weekly', 0.85], ['name-plates', 'monthly', 0.8],
  ['digital-prints', 'monthly', 0.8], ['caricatures', 'monthly', 0.75],
  ['gifts', 'weekly', 0.85], ['personalised', 'monthly', 0.85],
  ['for-business', 'monthly', 0.8], ['artzy-world', 'monthly', 0.8],
  ['contact', 'monthly', 0.7], ['shipping-policy', 'monthly', 0.4],
  ['returns-policy', 'monthly', 0.4], ['customised-product-policy', 'monthly', 0.4],
  ['cancellation-policy', 'monthly', 0.4], ['privacy-policy', 'monthly', 0.4],
  ['terms-and-conditions', 'monthly', 0.4], ['ai-concept-disclosure', 'monthly', 0.4],
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // Product modal URLs canonicalise to /shop/, so they are deliberately not
  // submitted separately. Add products after stable product routes ship.
  return routes.map(([route, changeFrequency, priority]) => ({
    url: route ? `${BASE_URL}/${route}/` : `${BASE_URL}/`,
    lastModified: CONTENT_RELEASE_DATE,
    changeFrequency,
    priority,
  }));
}
