import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCaricatureEstimate } from '../src/features/caricatures/pricing';

test('single-person digital portrait uses the fixed starting amount', () => {
  assert.equal(calculateCaricatureEstimate({ finishBase: 1490, typeAddition: 0, people: 1, pets: 0, commercialUsage: false }), 1490);
});

test('couple scene framed print includes each deterministic addition once', () => {
  assert.equal(calculateCaricatureEstimate({ finishBase: 3490, typeAddition: 800, people: 2, pets: 0, commercialUsage: false }), 4940);
});

test('commercial usage is a separate visible addition', () => {
  assert.equal(calculateCaricatureEstimate({ finishBase: 1490, typeAddition: 0, people: 1, pets: 0, commercialUsage: true }), 2990);
});
