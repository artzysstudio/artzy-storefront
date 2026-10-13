import type { Product } from './api';

export const categorySlug = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
/** Keep the ERP display name, including distinct categories and spelling. */
export const catalogueCategory = (value: string) => value.trim();
const legacyCategories: Record<string, string> = {
  'table-and-utility-art': 'Art On Table',
  'tabletop-and-utility': 'Art On Table',
  'mirrors-and-decorative-hangings': 'Wall Décor',
  'spiritual-and-festive': 'Agarbatti & Dhup Stand',
  'spiritual-and-festive-art': 'Agarbatti & Dhup Stand',
  'personalised-gifts': 'Customized Gifts',
};
export function resolveCategory(selection: string, categories: string[]): string {
  return categories.find(name => categorySlug(name) === categorySlug(selection))
    || legacyCategories[categorySlug(selection)] || selection;
}
export function matchesCategory(product: Product, selection: string): boolean {
  return !selection || categorySlug(product.category) === categorySlug(resolveCategory(selection, [product.category]));
}
export function erpCategoryNames(payload: unknown, products?: Product[]): string[] {
  const envelope = payload as { data?: unknown; categories?: unknown } | null;
  const rows = Array.isArray(payload) ? payload : Array.isArray(envelope?.data) ? envelope.data : envelope?.categories;
  if (!Array.isArray(rows)) throw new Error('Invalid ERP category response');
  return [...new Set(rows.filter(row => row && row.is_active !== false && typeof row.name === 'string' && row.name.trim())
    .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0) || a.name.localeCompare(b.name))
    .map(row => row.name.trim() as string))].filter(name => !products || products.some(product => categorySlug(product.category) === categorySlug(name)));
}
