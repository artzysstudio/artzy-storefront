import assert from 'node:assert/strict';
import test from 'node:test';
import { establishStableProductRoutes } from '../scripts/product-route-identity.mjs';

const original = { id: 'product-123', name: 'Original Name', route_slug: 'original-name--product-123' };

test('preserves the first-published slug when a product name changes', () => {
  const [result] = establishStableProductRoutes([{ id: original.id, name: 'Renamed Product' }], [original]);
  assert.equal(result.routeSlug, original.route_slug);
});

test('rejects an invalid stored slug before producing a replacement snapshot', () => {
  assert.throws(
    () => establishStableProductRoutes([{ id: original.id, name: original.name }], [{ ...original, route_slug: 'wrong-product-route' }]),
    /Stored product route is invalid/,
  );
});

test('rejects duplicate ERP identities before producing a replacement snapshot', () => {
  assert.throws(
    () => establishStableProductRoutes([{ id: original.id, name: original.name }, { id: original.id, name: 'Duplicate' }]),
    /duplicate ERP product ID/,
  );
});
