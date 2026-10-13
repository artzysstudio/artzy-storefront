import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogueCategory, matchesCategory, erpCategoryNames, resolveCategory } from '../src/lib/catalogue-categories';
import { catalogueProducts } from '../src/hooks/useLiveCatalogue';
import { normalizeStorefrontProduct, type Product } from '../src/lib/api';
import { recommendGifts } from '../src/features/gifts/giftEngine';
import { defaultGiftIntent } from '../src/features/gifts/types';

const tray: Product = { id: 'tray', name: 'Handpainted Tray', category: 'Art On Table', price: 899, quantity: 3, images: ['https://media.artzysstudio.in/products/tray.jpg'], availability: 'in_stock' };
test('legacy navigation categories select the correct live ERP products', () => {
  assert.equal(matchesCategory(tray, 'table-and-utility-art'), true);
  assert.equal(matchesCategory(tray, 'mirrors-and-decorative-hangings'), false);
  assert.equal(matchesCategory(tray, 'digital-prints'), false);
  assert.equal(matchesCategory(tray, 'caricatures'), false);
  assert.equal(matchesCategory(tray, 'does-not-exist'), false);
  assert.equal(catalogueCategory('Wall D\u00e9cor'), 'Wall D\u00e9cor');
  assert.equal(catalogueCategory('Uncategorized'), 'Uncategorized');
});
test('gift finder accepts live payload and birthday quick start finds a budget-safe gift', () => {
  const products = catalogueProducts({ data: [tray] });
  const result = recommendGifts(products, { ...defaultGiftIntent, occasion: 'birthday', recipient: 'friend', budget: 1500, styles: ['colourful', 'artistic'] });
  assert.ok(result.recommendations.length);
  assert.ok(result.recommendations.every(plan => plan.pricing.total <= 1500));
  assert.deepEqual(catalogueProducts({ products: [] }), []);
  assert.throws(() => catalogueProducts({ error: 'unavailable' }));
});
test('empty catalogue does not offer an ineffective style relaxation', () => {
  const result = recommendGifts([], { ...defaultGiftIntent, styles: ['colourful'] });
  assert.deepEqual(result.relaxations, []);
  assert.match(result.message, /No ready-stock/);
});
test('gift plans carry the price and stock of an available variant', () => {
  const variants = [{ id: 'sold', name: 'Blue', price: 499, quantity: 0 }, { id: 'pink', name: 'Pink', price: 999, quantity: 2 }];
  const plan = recommendGifts([{ ...tray, price: 499, variants }], { ...defaultGiftIntent, budget: 1500 }).recommendations[0];
  assert.equal(plan.items[0].variantId, 'pink');
  assert.equal(plan.items[0].product.quantity, 2);
  assert.equal(plan.pricing.products, 999);
  assert.equal(recommendGifts([{ ...tray, variants }], { ...defaultGiftIntent, budget: 800 }).recommendations.length, 0);
});
test('customer copy removes editorial notes while preserving verified product facts', () => {
  const product = normalizeStorefrontProduct({ ...tray, artworkStory: 'Hand-painted tray. Please review the product image and confirm the material, dimensions and care instructions before publishing.', dimensions: '20 × 30 cm' });
  assert.equal(product.artworkStory, 'Hand-painted tray.');
  assert.equal(product.dimensions, '20 × 30 cm');
});

test('ERP category names stay separate and never follow misleading ERP slugs', () => {
  const names = erpCategoryNames({ data: [
    { name: 'Art On Table', slug: 'home-decor', sort_order: 0 },
    { name: 'Home Decor', slug: 'home_decor', sort_order: 1 },
    { name: 'Wall Décor', sort_order: 2 },
    { name: 'Wooden Spoon Stand', sort_order: 3 },
    { name: 'Hidden', is_active: false },
  ] });
  assert.deepEqual(names, ['Art On Table', 'Home Decor', 'Wall Décor', 'Wooden Spoon Stand']);
  assert.equal(resolveCategory('art-on-table', names), 'Art On Table');
  assert.equal(resolveCategory('home-decor', names), 'Home Decor');
  assert.equal(matchesCategory(tray, 'home-decor'), false);
  assert.equal(matchesCategory({ ...tray, category: 'Wooden Spoon Stand' }, 'art-on-table'), false);
  assert.equal(matchesCategory({ ...tray, category: 'Home Decor' }, 'wall-decor'), false);
});
