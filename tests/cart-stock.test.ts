import assert from 'node:assert/strict';
import test from 'node:test';
import { clampCartQuantity, normaliseStockLimit, remainingStock } from '../src/lib/cart-stock';

test('one-off ERP stock never allows a second unit', () => {
  assert.equal(clampCartQuantity(1, 1), 1);
  assert.equal(clampCartQuantity(2, 1), 1);
  assert.equal(remainingStock(1, 1), 0);
});

test('quantity can increase only up to available ERP stock', () => {
  assert.equal(clampCartQuantity(2, 4), 2);
  assert.equal(clampCartQuantity(9, 4), 4);
  assert.equal(remainingStock(4, 2), 2);
});

test('unknown stock remains unbounded while invalid stock is normalised safely', () => {
  assert.equal(clampCartQuantity(7, null), 7);
  assert.equal(normaliseStockLimit('3'), 3);
  assert.equal(normaliseStockLimit(-2), 0);
});
