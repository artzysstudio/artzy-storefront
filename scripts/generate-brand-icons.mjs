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

const background = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200"><rect width="1200" height="1200" rx="64" fill="#fffaf5"/></svg>');
const logo = await sharp(source)
  .resize(920, 920, { fit: 'contain' })
  .sharpen({ sigma: 0.7 })
  .png()
  .toBuffer();
await sharp(background)
  .composite([{ input: logo, left: 140, top: 140 }])
  .png()
  .toFile('public/images/artzy-social-share.png');

console.log('Generated Artzy favicon and social-share assets.');
