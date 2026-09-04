import fs from 'node:fs';
import sharp from 'sharp';

const source = 'public/images/artzy-studio-logo.png';
const emblem = await sharp(source)
  .extract({ left: 48, top: 30, width: 192, height: 174 })
  .flatten({ background: '#fffcf8' })
  .resize(220, 200, { fit: 'contain', background: '#fffcf8' })
  .extend({ top: 28, bottom: 28, left: 18, right: 18, background: '#fffcf8' })
  .composite([{ input: { create: { width: 256, height: 32, channels: 4, background: '#fffcf8' } }, left: 0, top: 224 }])
  .ensureAlpha()
  .png()
  .toBuffer();

for (const file of ['src/app/icon.png', 'src/app/apple-icon.png', 'public/images/artzy-favicon.png']) {
  fs.writeFileSync(file, emblem);
}

const sizes = [16, 32, 48, 256];
const pngs = [];
for (const size of sizes) {
  pngs.push(await sharp(emblem)
    .resize(size, size, { fit: 'contain', background: '#fffcf8' })
    .ensureAlpha()
    .png()
    .toBuffer());
}

const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
pngs.forEach((png, index) => {
  const entry = 6 + index * 16;
  const size = sizes[index];
  header[entry] = size === 256 ? 0 : size;
  header[entry + 1] = size === 256 ? 0 : size;
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(png.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += png.length;
});
fs.writeFileSync('src/app/favicon.ico', Buffer.concat([header, ...pngs]));

const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#fffaf5"/>
  <rect width="24" height="630" fill="#ad4f55"/>
  <path d="M550 92V538" stroke="#e7d7ca" stroke-width="2"/>
  <text x="620" y="205" font-family="Georgia,serif" font-size="66" fill="#49372f">Art created</text>
  <text x="620" y="282" font-family="Georgia,serif" font-size="66" font-style="italic" fill="#ad4f55">with heart.</text>
  <text x="624" y="352" font-family="Arial,sans-serif" font-size="24" fill="#66534a">HAND-PAINTED ART · MEANINGFUL GIFTS</text>
  <text x="624" y="405" font-family="Arial,sans-serif" font-size="25" fill="#66534a">Created in Pune by Deepti J. Shah</text>
  <text x="624" y="475" font-family="Arial,sans-serif" font-size="22" font-weight="bold" fill="#49372f">www.artzysstudio.in</text>
</svg>`);
const logo = await sharp(source).resize(390, 390, { fit: 'contain' }).png().toBuffer();
await sharp(background)
  .composite([{ input: logo, left: 105, top: 120 }])
  .png()
  .toFile('public/images/artzy-social-share.png');

console.log('Generated Artzy favicon and social-share assets.');
