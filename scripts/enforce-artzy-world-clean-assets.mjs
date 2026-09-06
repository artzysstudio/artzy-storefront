import fs from 'node:fs';

const previewIndex = new URL('../public/artzy-world/preview/index.html', import.meta.url);
const html = fs.readFileSync(previewIndex, 'utf8');
const bundleMatch = html.match(/src="\/artzy-world\/preview\/assets\/([^"?]+\.js)"/);
if (!bundleMatch) throw new Error('Unable to find the active Artzy World JavaScript bundle.');
const bundle = new URL(`../public/artzy-world/preview/assets/${bundleMatch[1]}`, import.meta.url);
let source = fs.readFileSync(bundle, 'utf8');

const replacements = [
  [
    'image:`https://media.artzysstudio.in/products/originals/2ef6a4f8-342f-41c0-86e0-40e9ee72ff3c.png`',
    'image:`/artzy-world/preview/products/blue-clock-wall-hanger.webp`',
  ],
  [
    '.filter(e=>e.quantity>0&&e.image.includes(`/products/originals/`))',
    '.filter(e=>e.quantity>0&&e.image.startsWith(`/artzy-world/preview/products/`))',
  ],
];

for (const [before, after] of replacements) {
  const matches = source.split(before).length - 1;
  const alreadyApplied = source.split(after).length - 1;
  if (matches === 0 && alreadyApplied === 1) continue;
  if (matches !== 1) throw new Error(`Expected exactly one bundle match, found ${matches}: ${before}`);
  source = source.replace(before, after);
}

fs.writeFileSync(bundle, source);

const requiredSignals = [
  'product-cutout frame-none',
  'Continue with this preview',
  'Approximate placement',
];
for (const signal of requiredSignals) {
  if (!source.includes(signal)) throw new Error(`Artzy World bundle is missing: ${signal}`);
}
