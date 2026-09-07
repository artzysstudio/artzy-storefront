export const cleanProductId = (id) => String(id).toLowerCase().replace(/[^a-z0-9-]/g, '');

export const deriveProductSlug = (record) => {
  const name = String(record.name)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'studio-piece';
  return `${name}--${cleanProductId(record.id)}`;
};

export const isProductSlugForId = (slug, id) =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*--[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  && slug.endsWith(`--${cleanProductId(id)}`);

export function establishStableProductRoutes(records, previousRecords = []) {
  const previousRoutes = new Map();
  for (const record of previousRecords) {
    const id = String(record?.id || '').trim();
    if (!id) continue;
    const routeSlug = String(record.route_slug || record.routeSlug || deriveProductSlug(record));
    if (!isProductSlugForId(routeSlug, id)) {
      throw new Error(`Stored product route is invalid for ERP product ${id}. Existing data was not changed.`);
    }
    if (previousRoutes.has(id) && previousRoutes.get(id) !== routeSlug) {
      throw new Error(`Stored product route is duplicated for ERP product ${id}. Existing data was not changed.`);
    }
    previousRoutes.set(id, routeSlug);
  }

  const seenIds = new Set();
  const seenSlugs = new Set();
  return records.map((record) => {
    const id = String(record.id).trim();
    if (seenIds.has(id)) {
      throw new Error(`Published storefront feed contains duplicate ERP product ID ${id}. Existing data was not changed.`);
    }
    seenIds.add(id);
    const routeSlug = previousRoutes.get(id) || deriveProductSlug(record);
    if (!isProductSlugForId(routeSlug, id)) {
      throw new Error(`Product route is invalid for ERP product ${id}. Existing data was not changed.`);
    }
    if (seenSlugs.has(routeSlug)) {
      throw new Error(`Published storefront feed contains duplicate product route ${routeSlug}. Existing data was not changed.`);
    }
    seenSlugs.add(routeSlug);
    return { record, id, routeSlug };
  });
}
