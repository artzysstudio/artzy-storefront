import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateNamePlateEstimate } from '../src/features/name-plates/pricing';

test('standard + Warli-inspired + natural wood is ₹3,990', () => {
  assert.equal(calculateNamePlateEstimate({ size: 2490, shape: 0, painting: 650, material: 850, protection: 0, mounting: 0 }), 3990);
});

test('all deterministic additions are included exactly once', () => {
  assert.equal(calculateNamePlateEstimate({ size: 3690, shape: 350, painting: 750, material: 1200, protection: 350, mounting: 350 }), 6690);
});

test('invalid price input is rejected', () => {
  assert.throws(() => calculateNamePlateEstimate({ size: 2490, shape: -1, painting: 0, material: 0, protection: 0, mounting: 0 }));
});
