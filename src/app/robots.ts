import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.artzysstudio.in';
  const indexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE !== 'false';
  return {
    rules: {
      userAgent: '*',
      allow: indexable ? '/' : undefined,
      // Account and checkout already carry noindex directives. Keep them
      // crawlable so search engines can see those directives, and never block
      // framework assets needed to render and evaluate the storefront.
      disallow: indexable ? ['/api/'] : '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
