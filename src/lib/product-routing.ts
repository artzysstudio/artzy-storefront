import type { Product } from '@/lib/api';

const cleanProductId = (id: string): string =>
  String(id).toLowerCase().replace(/[^a-z0-9-]/g, '');

export const derivedProductSlug = (product: Pick<Product, 'id' | 'name'>): string => {
  const name = product.name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'studio-piece';
  return `${name}--${cleanProductId(product.id)}`;
};

export const isProductSlugForId = (slug: string, id: string): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*--[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  && slug.endsWith(`--${cleanProductId(id)}`);

export const productSlug = (product: Pick<Product, 'id' | 'name' | 'routeSlug'>): string =>
  product.routeSlug && isProductSlugForId(product.routeSlug, product.id)
    ? product.routeSlug
    : derivedProductSlug(product);

export const productPath = (product: Pick<Product, 'id' | 'name' | 'routeSlug'>): string =>
  `/products/${productSlug(product)}/`;

export const findProductBySlug = (products: Product[], slug: string): Product | undefined =>
  products.find((product) => productSlug(product) === slug);

export const storefrontCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    'Mirrors & Decorative Hangings': 'Mirrors & Wall Décor',
    'Table & Utility Art': 'Tabletop & Utility',
    'Spiritual & Festive Art': 'Spiritual & Festive',
    'Wall Art & Frames': 'Wall Art',
    'Hand-painted Décor': 'Hand-painted Décor',
  };
  return labels[category] || category;
};
