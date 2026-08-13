import test from 'node:test';
import assert from 'node:assert/strict';
import type { Product } from '../src/lib/api';
import { defaultGiftIntent } from '../src/features/gifts/types';
import { GIFT_PACKAGING, parseGiftIntent, recommendGifts } from '../src/features/gifts/giftEngine';

const product = (overrides: Partial<Product> = {}): Product => ({
  id: 'erp-1', name: 'Handpainted Floral Tray', category: 'Table & Utility Art', price: 800,
  quantity: 12, images: ['https://media.artzysstudio.in/products/tray.jpg'], availability: 'in_stock',
  ...overrides,
});

test('never recommends a plan above the total budget', () => {
  const intent = { ...defaultGiftIntent, occasion: 'birthday', recipient: 'friend', budget: 1000 };
  const result = recommendGifts([product()], intent);
  assert.ok(result.recommendations.length > 0);
  assert.ok(result.recommendations.every((item) => item.pricing.total <= 1000));
});

test('excludes out-of-stock and non-Artzy-media products', () => {
  const invalid = [product({ quantity: 0 }), product({ id: 'erp-2', images: ['https://example.com/random.jpg'] })];
  assert.equal(recommendGifts(invalid, defaultGiftIntent).recommendations.length, 0);
});

test('does not invent unsupported personalisation', () => {
  const intent = { ...defaultGiftIntent, personalisation: 'name' };
  const result = recommendGifts([product()], intent);
  assert.equal(result.recommendations.length, 0);
  assert.ok(result.message.includes('No current ERP product confirms'));
});

test('bulk plan requires verified quantity for every SKU', () => {
  const intent = { ...defaultGiftIntent, quantity: 20, budget: 20000 };
  const result = recommendGifts([product({ quantity: 12 })], intent);
  assert.equal(result.recommendations.length, 0);
  assert.equal(result.excluded.quantity, 1);
});

test('premium packaging is included in the displayed total', () => {
  const intent = { ...defaultGiftIntent, budget: 2000, packagingId: 'premium-wrap' };
  const plan = recommendGifts([product()], intent).recommendations[0];
  assert.equal(plan.pricing.products, 800);
  assert.equal(plan.pricing.packaging, 500);
  assert.equal(plan.pricing.total, 1300);
});

test('urgent delivery excludes products without confirmed lead time', () => {
  const intent = { ...defaultGiftIntent, deliveryWindow: 'two-days' as const };
  assert.equal(recommendGifts([product()], intent).recommendations.length, 0);
});

test('Muse parses recipient, quantity and total budget', () => {
  const parsed = parseGiftIntent('Need 10 artistic gifts for employees, ₹15,000 total', defaultGiftIntent);
  assert.equal(parsed.quantity, 10);
  assert.equal(parsed.budget, 15000);
  assert.equal(parsed.budgetMode, 'total');
  assert.equal(parsed.recipient, 'employee');
  assert.ok(parsed.styles.includes('artistic'));
});

test('Muse recognises a hamper brief and builds only multi-product ERP combinations', () => {
  const intent = parseGiftIntent('Imagine a premium wedding gift hamper under Rs 2,500', defaultGiftIntent);
  const result = recommendGifts([
    product({ id: 'erp-1', price: 800 }),
    product({ id: 'erp-2', name: 'Handpainted Coaster Set', price: 600 }),
  ], intent);
  assert.equal(intent.giftType, 'hamper');
  assert.ok(result.recommendations.length > 0);
  assert.ok(result.recommendations.every((plan) => plan.items.length >= 2));
});

test('hamper mode never presents a single ERP product as a hamper', () => {
  const intent = { ...defaultGiftIntent, giftType: 'hamper' as const, budget: 2500 };
  const result = recommendGifts([product()], intent);
  assert.equal(result.recommendations.length, 0);
  assert.match(result.message, /No ERP-verified combination/);
});

test('unconfirmed packaging falls back to the safe standard option', () => {
  const intent = { ...defaultGiftIntent, packagingId: 'wedding-packaging' };
  const plan = recommendGifts([product()], intent, GIFT_PACKAGING).recommendations[0];
  assert.equal(plan.packaging.id, 'standard-wrap');
});

