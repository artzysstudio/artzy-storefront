import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { establishStableProductRoutes } from './product-route-identity.mjs';

const snapshotPath = resolve('src/data/erp-products.json');
const feedUrl = process.env.STOREFRONT_PRODUCT_FEED_URL || 'https://www.artzysstudio.in/api/storefront/products';
const feedToken = process.env.STOREFRONT_PRODUCT_FEED_TOKEN?.trim();
const publicProductFields = [
  'id', 'name', 'sku', 'category_id', 'category', 'category_slug', 'description',
  'price', 'regular_price', 'sale_price', 'salePrice', 'on_sale', 'quantity',
  'availability', 'cover_image', 'images', 'variants', 'product_url', 'updated_at',
  'artworkStory', 'artistNotes', 'artist', 'collectionId', 'medium', 'material',
  'dimensions', 'weight', 'colorPalette', 'style', 'occasion', 'roomType',
  'careInstructions', 'care_instructions', 'leadTime', 'lead_time', 'contents',
  'handmadeVariation', 'handmade_variation', 'dispatchTime', 'dispatch_time',
  'deliveryEstimate', 'delivery_estimate', 'returnEligibility', 'return_eligibility',
  'giftWrappingAvailable', 'gift_wrapping_available', 'personalizationOptions',
  'giftEligible', 'giftOccasions', 'giftRecipients', 'giftStyles',
  'personalisationPrice', 'personalisationLeadTime', 'packagingCompatibility',
  'giftPopularityScore', 'productionLeadTime', 'madeToOrder', 'minimumGiftQuantity',
  'maximumGiftQuantity', 'bulkGiftEligible', 'relatedProductIds',
  'recommendedPairings', 'crossSellProductIds', 'seo', 'socialSharingImage',
  'erpUpdatedAt', 'isNew', 'isSoldOut', 'videoUrl', 'sourceCategory',
];
const publicVariantFields = [
  'id', 'item_id', 'name', 'title', 'option', 'value', 'sku', 'variant_name',
  'colour_name', 'theme_label', 'colour_hex', 'color_hex', 'photos', 'image_url',
  'imageUrl', 'price', 'price_override', 'selling_price', 'price_source', 'quantity',
  'stock_qty', 'isAvailable', 'is_active', 'attributes',
];

const pick = (source, fields) => Object.fromEntries(
  fields.filter((field) => Object.prototype.hasOwnProperty.call(source, field)).map((field) => [field, source[field]]),
);
const sanitizeVariant = (variant) => {
  if (!variant || typeof variant !== 'object') return null;
  const result = pick(variant, publicVariantFields);
  if (Array.isArray(result.photos)) {
    result.photos = result.photos
      .filter((photo) => photo && typeof photo === 'object')
      .map((photo) => pick(photo, ['alt', 'url']));
  }
  return result;
};

let previous = [];
try {
  const parsed = JSON.parse(await readFile(snapshotPath, 'utf8'));
  if (Array.isArray(parsed)) previous = parsed;
} catch {
  // The first build has no history. A route is established from the public name and ERP ID.
}
const headers = { accept: 'application/json', 'user-agent': 'ArtzyStudio-StaticBuild/1.0' };
if (feedToken) headers.authorization = `Bearer ${feedToken}`;
const response = await fetch(feedUrl, { headers });
if (!response.ok) throw new Error(`Published storefront product feed failed with ${response.status}. Existing data was not changed.`);

const payload = await response.json();
const records = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.products) ? payload.products : [];
const published = records.filter((record) =>
  record && typeof record === 'object' && String(record.id || '').trim() && String(record.name || '').trim() && Number(record.price) > 0,
);
if (!published.length) throw new Error('Published storefront product feed was empty. Existing data was not changed.');

const safePublished = establishStableProductRoutes(published, previous).map(({ record, id, routeSlug }) => {
  const safeRecord = pick(record, publicProductFields);
  safeRecord.id = id;
  safeRecord.route_slug = routeSlug;
  safeRecord.variants = Array.isArray(record.variants)
    ? record.variants.map(sanitizeVariant).filter(Boolean)
    : [];
  return safeRecord;
});

safePublished.sort((left, right) => String(left.name).localeCompare(String(right.name)) || String(left.id).localeCompare(String(right.id)));
await writeFile(snapshotPath, `${JSON.stringify(safePublished, null, 2)}\n`, 'utf8');
console.log(`Synced ${safePublished.length} published ERP-authoritative storefront products with stable routes for static SEO generation.`);
