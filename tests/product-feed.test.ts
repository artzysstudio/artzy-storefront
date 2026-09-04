import assert from 'node:assert/strict';
import test from 'node:test';
import { isStorefrontInventoryProduct, normalizeStorefrontProduct, type Product } from '../src/lib/api';

const product = (image: string): Product => ({
  id: 'erp-1',
  name: 'Hand-painted test piece',
  category: 'Home Decor',
  price: 999,
  quantity: 2,
  availability: 'in_stock',
  images: [image],
});

test('normalizes a relative ERP product image to the Artzy media origin', () => {
  const normalized = normalizeStorefrontProduct(product('products/studio-piece.png'));
  assert.equal(normalized.images[0], 'https://media.artzysstudio.in/products/studio-piece.png');
  assert.equal(isStorefrontInventoryProduct(normalized), true);
});

test('accepts products hosted on the Artzy CDN', () => {
  const normalized = normalizeStorefrontProduct(product('https://cdn.artzysstudio.in/products/legacy-piece.png'));
  assert.equal(normalized.images[0], 'https://cdn.artzysstudio.in/products/legacy-piece.png');
  assert.equal(isStorefrontInventoryProduct(normalized), true);
});

test('rejects non-Artzy remote imagery from storefront inventory', () => {
  const normalized = normalizeStorefrontProduct(product('https://example.com/generated-concept.png'));
  assert.deepEqual(normalized.images, []);
  assert.equal(isStorefrontInventoryProduct(normalized), false);
});
