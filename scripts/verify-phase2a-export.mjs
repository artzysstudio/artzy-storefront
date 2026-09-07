import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const products = JSON.parse(fs.readFileSync(path.join(root, 'src/data/erp-products.json'), 'utf8'));
const sitemap = fs.readFileSync(path.join(root, 'out/sitemap.xml'), 'utf8');
const failures = [];
let productCount = 0;
let h1Count = 0;
let structuredPriceCount = 0;
let sitemapDateCount = 0;

const positive = (value) => Number.isFinite(Number(value)) && Number(value) > 0;

for (const product of products) {
  if (!product.route_slug) continue;
  const file = path.join(root, 'out/products', product.route_slug, 'index.html');
  if (!fs.existsSync(file)) {
    failures.push(`${product.id}: missing exported product page`);
    continue;
  }
  productCount += 1;
  const html = fs.readFileSync(file, 'utf8');
  const headings = html.match(/<h1\b/gi) || [];
  if (headings.length !== 1) failures.push(`${product.id}: expected one h1, found ${headings.length}`);
  else h1Count += 1;

  const jsonScripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  const schemas = jsonScripts.map((match) => JSON.parse(match[1]));
  const schema = schemas.find((entry) => entry['@type'] === 'Product');
  if (!schema) {
    failures.push(`${product.id}: Product JSON-LD missing`);
  } else {
    const actualOffers = Array.isArray(schema.offers) ? schema.offers : [schema.offers];
    const activeVariants = (product.variants || []).filter((variant) => (
      variant.is_active !== false
      && !(Number.isFinite(Number(variant.stock_qty)) && Number(variant.stock_qty) <= 0)
    ));
    const basePrice = positive(product.sale_price) ? Number(product.sale_price) : Number(product.price);
    const variantPrices = activeVariants.map((variant) => positive(variant.price_override)
      ? Number(variant.price_override)
      : positive(variant.selling_price)
        ? Number(variant.selling_price)
        : positive(variant.price)
          ? Number(variant.price)
          : basePrice);
    const expectedPrices = variantPrices.length && new Set(variantPrices).size > 1
      ? variantPrices
      : [variantPrices[0] ?? basePrice];
    const actualPrices = actualOffers.map((offer) => Number(offer.price));
    if (JSON.stringify(actualPrices) !== JSON.stringify(expectedPrices)) {
      failures.push(`${product.id}: schema prices ${actualPrices.join(',')} do not match ERP ${expectedPrices.join(',')}`);
    } else if (actualOffers.every((offer) => offer['@type'] === 'Offer' && offer.priceCurrency === 'INR')) {
      structuredPriceCount += 1;
    } else {
      failures.push(`${product.id}: invalid Offer type or currency`);
    }
  }

  const updated = new Date(product.updated_at);
  const loc = `https://www.artzysstudio.in/products/${product.route_slug}/`;
  const block = sitemap.match(new RegExp(`<url>\\s*<loc>${loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/loc>([\\s\\S]*?)<\\/url>`));
  if (!block) {
    failures.push(`${product.id}: sitemap entry missing`);
  } else if (!Number.isFinite(updated.getTime()) || !block[1].includes(`<lastmod>${updated.toISOString()}</lastmod>`)) {
    failures.push(`${product.id}: sitemap lastModified does not match ERP updated_at`);
  } else {
    sitemapDateCount += 1;
  }
}

const notFound = fs.readFileSync(path.join(root, 'out/404.html'), 'utf8');
if (!/<meta name="robots" content="noindex, nofollow"\s*\/>/i.test(notFound)) {
  failures.push('404 export is missing noindex, nofollow');
}
if (fs.existsSync(path.join(root, 'out/product-page/i-m-a-product/index.html'))) {
  failures.push('obsolete placeholder was exported');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ productCount, exactOneH1: h1Count, structuredPricesValidated: structuredPriceCount, sitemapDatesValidated: sitemapDateCount, placeholderExported: false, notFoundNoindex: true }, null, 2));
}
