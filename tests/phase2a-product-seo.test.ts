import assert from 'node:assert/strict';
import test from 'node:test';
import erpProducts from '../src/data/erp-products.json';
import { isStorefrontInventoryProduct, normalizeStorefrontProduct, type Product } from '../src/lib/api';
import { buildProductOffers } from '../src/lib/product-structured-data';
import { validErpLastModified } from '../src/lib/sitemap-dates';

const products = (erpProducts as Product[]).map(normalizeStorefrontProduct).filter(isStorefrontInventoryProduct);

test('all published products expose positive ERP-backed structured prices', () => {
  assert.equal(products.length, 50);
  for (const product of products) {
    const offers = buildProductOffers(product, `https://www.artzysstudio.in/products/${product.routeSlug}/`);
    const list = Array.isArray(offers) ? offers : [offers];
    assert.ok(list.length > 0, `${product.id} has no offer`);
    for (const offer of list) {
      assert.equal(offer['@type'], 'Offer');
      assert.equal(offer.priceCurrency, 'INR');
      assert.ok(Number.isFinite(offer.price) && offer.price > 0, `${product.id} has invalid price`);
    }
  }
});

test('Lotus Elegance publishes every approved ERP variant price: ₹499, ₹599 and ₹699', () => {
  const lotus = products.find((product) => product.id === '01d6e373-a146-495e-836d-3977f323e3d0');
  assert.ok(lotus);
  const offers = buildProductOffers(lotus, 'https://www.artzysstudio.in/products/lotus/');
  assert.ok(Array.isArray(offers));
  const erpPrices = (lotus.variants || []).filter((variant) => variant.isAvailable !== false).map((variant) => variant.price).sort((a, b) => Number(a) - Number(b));
  assert.deepEqual(erpPrices, [499, 599, 699], 'The verified ₹499, ₹599 and ₹699 variants must all be present');
  assert.deepEqual(offers.map((offer) => offer.price).sort((a, b) => a - b), erpPrices);
  assert.deepEqual(offers.map((offer) => offer.sku), (lotus.variants || []).filter((variant) => variant.isAvailable !== false).map((variant) => variant.sku));
});

test('one effective price produces exactly one Offer', () => {
  const product = normalizeStorefrontProduct({
    id: 'same-price', name: 'Same price piece', category: 'Decor', price: 700,
    quantity: 2, images: ['products/same-price.png'],
    variants: [
      { id: 'one', sku: 'ONE', name: 'One', price: 700, quantity: 1, isAvailable: true },
      { id: 'two', sku: 'TWO', name: 'Two', price: 700, quantity: 1, isAvailable: true },
    ],
  });
  const offers = buildProductOffers(product, 'https://www.artzysstudio.in/products/same-price/');
  if (Array.isArray(offers)) assert.fail('Expected one Offer for one effective price');
  assert.equal(offers.price, 700);
});

test('ERP sitemap dates reject malformed and future values without substituting a date', () => {
  const now = new Date('2026-09-07T12:00:00.000Z');
  assert.equal(validErpLastModified(undefined, now), undefined);
  assert.equal(validErpLastModified('not-a-date', now), undefined);
  assert.equal(validErpLastModified('2026-09-08T00:00:00.000Z', now), undefined);
  assert.equal(validErpLastModified('2026-09-03T10:42:30.288Z', now)?.toISOString(), '2026-09-03T10:42:30.288Z');
});

test('all current catalogue updated_at values normalize to valid non-future dates', () => {
  const now = new Date('2026-09-07T23:59:59.999Z');
  for (const product of products) {
    assert.ok(product.erpUpdatedAt, `${product.id} did not map updated_at`);
    assert.ok(validErpLastModified(product.erpUpdatedAt, now), `${product.id} has an invalid or future updated_at`);
  }
});
