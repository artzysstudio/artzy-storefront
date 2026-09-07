import assert from 'node:assert/strict';
import test from 'node:test';
import { findProductBySlug, isProductSlugForId, productPath, productSlug, storefrontCategoryLabel } from '../src/lib/product-routing';
import type { Product } from '../src/lib/api';

const product: Product = {
  id: '2d7c837a-57c5-4877-b8a3-9ec57fcba29f',
  name: 'Decorative Wooden Key Holder Cabinet',
  category: 'Mirrors & Decorative Hangings',
  price: 999,
  quantity: 7,
  availability: 'in_stock',
  images: ['https://media.artzysstudio.in/key-holder.png'],
};

test('creates a readable permanent product path while retaining the ERP product ID', () => {
  assert.equal(productSlug(product), 'decorative-wooden-key-holder-cabinet--2d7c837a-57c5-4877-b8a3-9ec57fcba29f');
  assert.equal(productPath(product), '/products/decorative-wooden-key-holder-cabinet--2d7c837a-57c5-4877-b8a3-9ec57fcba29f/');
  assert.equal(findProductBySlug([product], productSlug(product))?.id, product.id);
});

test('keeps the first-published route stable when an ERP product name changes', () => {
  const firstPublishedSlug = productSlug(product);
  const renamed = { ...product, name: 'New Display Name', routeSlug: firstPublishedSlug };
  assert.equal(productSlug(renamed), firstPublishedSlug);
  assert.equal(productPath(renamed), `/products/${firstPublishedSlug}/`);
  assert.equal(isProductSlugForId(firstPublishedSlug, product.id), true);
  assert.equal(isProductSlugForId('duplicate-or-invalid', product.id), false);
});

test('simplifies category labels without changing the ERP category value', () => {
  assert.equal(storefrontCategoryLabel(product.category), 'Mirrors & Wall Décor');
  assert.equal(product.category, 'Mirrors & Decorative Hangings');
  assert.equal(storefrontCategoryLabel('A new ERP category'), 'A new ERP category');
});
