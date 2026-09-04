import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.artzysstudio.in';
  const indexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE !== 'false';
  return {
    rules: {
      userAgent: '*',
      allow: indexable ? '/' : undefined,
      disallow: indexable ? ['/account', '/checkout', '/api/', '/_next/'] : '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
