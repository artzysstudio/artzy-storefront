import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const ERP_ORIGIN = process.env.ERP_ORIGIN || 'https://erp.artzysstudio.in';
const email = process.env.ERP_EMAIL;
const pin = process.env.ERP_PIN;

if (!email || !pin) {
  throw new Error('Set ERP_EMAIL and ERP_PIN before importing the catalogue.');
}

const loginResponse = await fetch(`${ERP_ORIGIN}/api/auth/login/pin`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', accept: 'application/json' },
  body: JSON.stringify({ email, pin }),
});
const login = await loginResponse.json();
if (!loginResponse.ok || !login?.token) throw new Error('ERP catalogue authentication failed.');

const requestHeaders = { accept: 'application/json', 'x-session-token': login.token };
const records = [];
for (let page = 1; ; page += 1) {
  const response = await fetch(`${ERP_ORIGIN}/api/inventory?page=${page}&limit=100`, { headers: requestHeaders });
  const payload = await response.json();
  if (!response.ok || payload?.success === false) throw new Error(`ERP inventory page ${page} failed.`);
  records.push(...(Array.isArray(payload?.data) ? payload.data : []));
  if (payload?.has_more !== true) break;
}

const text = (value) => String(value ?? '').trim();
const number = (value) => Number(value ?? 0) || 0;
const unique = (values) => [...new Set(values.filter(Boolean))];

function mediaUrl(value) {
  const url = text(typeof value === 'string' ? value : value?.url || value?.image_url);
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url.startsWith('/') ? url : `/${url}`, ERP_ORIGIN).href;
}

function customerCategory(record) {
  const raw = `${text(record.category)} ${text(record.item_name)}`.toLowerCase();
  if (/agarbatti|dhup|dhoop|sarswati|saraswati|tealight|candle|diwali|festival|spiritual|pooja|puja/.test(raw)) return 'Spiritual & Festive Art';
  if (/mirror|earring.*hanger|car.*hanging|rear.*view/.test(raw)) return 'Mirrors & Decorative Hangings';
  if (/wall|frame|artwork|painting|canvas|print/.test(raw)) return 'Wall Art & Frames';
  if (/table|spoon|coaster|pen stand|flower pot|holder|tray|utility/.test(raw)) return 'Table & Utility Art';
  return 'Hand-painted Décor';
}

function productImages(record) {
  const rawImages = Array.isArray(record.image_urls)
    ? record.image_urls
    : record.image_urls ? Object.values(record.image_urls) : [];
  return unique([
    ...rawImages.map(mediaUrl),
    mediaUrl(record.photo),
    ...(record.item_variants || []).map((variant) => mediaUrl(variant.image_url)),
  ]).slice(0, 4);
}

function dimensions(record) {
  if (text(record.dimensions)) return text(record.dimensions);
  const values = [record.length, record.width, record.height].map(number);
  if (!values.some(Boolean)) return undefined;
  return `${values.map((value) => value || '—').join(' × ')} ${text(record.length_unit) || 'cm'}`;
}

let products = records
  .filter((record) => !['draft', 'archived'].includes(text(record.status).toLowerCase()))
  .map((record) => {
    const stock = Array.isArray(record.stock) ? record.stock[0] || {} : {};
    const quantity = number(stock.quantity ?? record.quantity);
    const regularPrice = number(record.selling_price || record.price);
    const salePrice = number(record.sale_price);
    const category = customerCategory(record);
    const rawCategory = text(record.category) || 'Uncategorised';
    const variants = (record.item_variants || []).map((variant) => ({
      id: text(variant.id) || undefined,
      sku: text(variant.sku) || undefined,
      name: text(variant.variant_name || variant.name) || undefined,
      price: number(variant.selling_price || variant.price) || undefined,
      quantity: number(variant.quantity),
      isAvailable: number(variant.quantity) > 0,
      attributes: variant.attributes || undefined,
    }));

    return {
      id: text(record.id),
      sku: text(record.sku) || undefined,
      name: text(record.item_name) || 'Untitled studio piece',
      category,
      sourceCategory: rawCategory,
      price: regularPrice,
      salePrice: salePrice > 0 && salePrice < regularPrice ? salePrice : null,
      quantity,
      images: productImages(record),
      variants: variants.length ? variants : undefined,
      artworkStory: text(record.description) || text(record.seo_description) || undefined,
      artist: 'Deepti J. Shah & Artzy\'s Studio',
      medium: text(record.medium) || undefined,
      material: Array.isArray(record.materials) ? record.materials.join(', ') : text(record.materials) || undefined,
      dimensions: dimensions(record),
      weight: number(record.weight) ? `${number(record.weight)} ${text(record.weight_unit) || 'kg'}` : undefined,
      roomType: category === 'Wall Art & Frames' ? ['Living Room', 'Bedroom', 'Office'] : ['Living Room', 'Dining Room'],
      availability: quantity > 0 ? 'in_stock' : 'out_of_stock',
      isSoldOut: quantity <= 0,
      personalizationOptions: record.customizable ? ['Custom colours', 'Personalised details'] : undefined,
      seo: {
        title: text(record.seo_title) || text(record.item_name),
        description: text(record.seo_description) || text(record.description),
        keywords: Array.isArray(record.tags) ? record.tags : [],
      },
      erpUpdatedAt: text(record.updated_at) || undefined,
    };
  })
  .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

async function imageExists(url) {
  try {
    const response = await fetch(url, { headers: { range: 'bytes=0-0' } });
    await response.body?.cancel();
    return response.ok;
  } catch {
    return false;
  }
}

const imageUrls = unique(products.flatMap((product) => product.images));
const validImages = new Set();
for (let index = 0; index < imageUrls.length; index += 16) {
  const batch = imageUrls.slice(index, index + 16);
  const results = await Promise.all(batch.map(async (url) => [url, await imageExists(url)]));
  results.forEach(([url, valid]) => { if (valid) validImages.add(url); });
}
products = products.map((product) => ({
  ...product,
  images: product.images.filter((url) => validImages.has(url)),
}));

const outputPath = resolve('src/data/erp-products.json');
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(products, null, 2)}\n`, 'utf8');

const counts = Object.fromEntries(unique(products.map((product) => product.category)).map((category) => [category, products.filter((product) => product.category === category).length]));
console.log(`Imported ${products.length} sellable ERP products into ${outputPath}.`);
console.log(`Validated ${validImages.size} of ${imageUrls.length} ERP image URLs.`);
console.log(counts);
