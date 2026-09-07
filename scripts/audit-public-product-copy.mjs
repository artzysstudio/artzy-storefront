import fs from 'node:fs';

const sourcePath = new URL('../src/data/erp-products.json', import.meta.url);
const products = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const nameCounts = new Map();

for (const product of products) {
  const key = String(product.name || '').trim().toLowerCase();
  nameCounts.set(key, (nameCounts.get(key) || 0) + 1);
}

const records = products.flatMap((product) => {
  const name = String(product.name || '').trim();
  const description = String(product.description || '').trim();
  const problems = [];
  if (/auto-generated description based on image analysis/i.test(description)) problems.push('auto-generated placeholder');
  if (/before publishing|confirm (?:the )?material, dimensions and care instructions/i.test(description)) problems.push('internal publishing instruction');
  if (!description || description.length < 100) problems.push('thin or missing description');
  if ((nameCounts.get(name.toLowerCase()) || 0) > 1) problems.push('duplicate product name');
  if (/\bdesgin\b|\bhager\b/i.test(name)) problems.push('probable name typo');
  if (/\(\d+\)\s*$/.test(name)) problems.push('numeric copy suffix');
  return problems.length ? [{ id: product.id, name, problems }] : [];
});

console.log(JSON.stringify({ generatedFrom: 'src/data/erp-products.json', affectedRecordCount: records.length, records }, null, 2));
