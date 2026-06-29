const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'out');
const destDir = path.join(__dirname, '..', '.vercel', 'output', 'static');

if (fs.existsSync(sourceDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  fs.cpSync(sourceDir, destDir, { recursive: true });
  
  // Write Vercel Build Output API config.json so Cloudflare Pages accepts it
  const vercelOutputDir = path.join(__dirname, '..', '.vercel', 'output');
  fs.writeFileSync(
    path.join(vercelOutputDir, 'config.json'),
    JSON.stringify({ version: 3 }, null, 2)
  );

  console.log('Successfully copied build output and generated config.json');
} else {
  console.error('Source directory not found:', sourceDir);
  process.exit(1);
}
