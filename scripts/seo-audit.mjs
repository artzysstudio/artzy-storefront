const origin = 'https://www.artzysstudio.in';
const fallbackPaths = ['/', '/shop/', '/original-art/', '/gifts/', '/personalised/', '/caricatures/', '/name-plates/', '/digital-prints/', '/for-business/', '/artzy-world/', '/about/', '/contact/', '/shipping-policy/', '/returns-policy/', '/privacy-policy/', '/terms-and-conditions/', '/checkout/', '/account/'];

const text = (html, pattern) => (html.match(pattern)?.[1] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const count = (html, pattern) => [...html.matchAll(pattern)].length;

const sitemapResponse = await fetch(`${origin}/sitemap.xml`, { redirect: 'manual' });
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const urls = [...new Set([...fallbackPaths.map((path) => new URL(path, origin).href), ...sitemapUrls])];
const pages = [];

for (const url of urls) {
  const response = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'ArtzyStudio-SEO-Audit/1.0' } });
  const html = await response.text();
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] || '';
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  pages.push({
    url,
    status: response.status,
    location: response.headers.get('location'),
    title: text(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    description: html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1] || '',
    canonical,
    h1Count: count(html, /<h1\b/gi),
    robots: html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)/i)?.[1] || '',
    jsonLdCount: count(html, /type=["']application\/ld\+json["']/gi),
    imageCount: images.length,
    imagesMissingAlt: images.filter((tag) => !/\balt=["'][^"']*["']/i.test(tag)).length,
    internalLinks: count(html, /<a\b[^>]+href=["']\//gi),
  });
}

const redirects = [];
for (const url of ['http://artzysstudio.in/', 'http://www.artzysstudio.in/', 'https://artzysstudio.in/']) {
  const response = await fetch(url, { redirect: 'manual' });
  redirects.push({ url, status: response.status, location: response.headers.get('location') });
}

console.log(JSON.stringify({ auditedAt: new Date().toISOString(), sitemapStatus: sitemapResponse.status, sitemapUrlCount: sitemapUrls.length, redirects, pages }, null, 2));
