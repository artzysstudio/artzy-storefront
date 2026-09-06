import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [input, output, left, top, size] = process.argv.slice(2);
if (!input || !output || [left, top, size].some((value) => !Number.isFinite(Number(value)))) {
  throw new Error('Usage: node scripts/generate-round-product-cutout.mjs <input> <output> <left> <top> <size>');
}

const diameter = Number(size);
const inset = Math.max(3, Math.round(diameter * 0.012));
const mask = Buffer.from(`<svg width="${diameter}" height="${diameter}"><circle cx="${diameter / 2}" cy="${diameter / 2}" r="${diameter / 2 - inset}" fill="white"/></svg>`);

fs.mkdirSync(path.dirname(output), { recursive: true });
await sharp(input)
  .extract({ left: Number(left), top: Number(top), width: diameter, height: diameter })
  .composite([{ input: mask, blend: 'dest-in' }])
  .resize(720, 720, { fit: 'contain' })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(output);
