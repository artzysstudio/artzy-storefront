import type { Product } from './api';

export const categorySlug = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const groups = [
  { label: 'Home Décor', aliases: ['home-decor', 'mirrors-and-decorative-hangings', 'wall-decor', 'handpainted-wooden-car-rear-view-mirror-hanging', 'handpainted-wooden-mirror-frame', 'hand-painted-decor'] },
  { label: 'Tabletop & Utility', aliases: ['table-and-utility-art', 'tabletop-and-utility', 'art-on-table', 'tea-coaster', 'wooden-spoon-stand'] },
  { label: 'Spiritual & Festive', aliases: ['spiritual-and-festive-art', 'spiritual-and-festive', 'agarbatti-and-dhup-stand'] },
  { label: 'Wall Art', aliases: ['wall-art', 'art-frames', 'wall-art-and-frames'] },
  { label: 'Personalised Gifts', aliases: ['personalised-gifts', 'customized-gifts', 'customised-gifts'] },
  { label: 'Digital Prints', aliases: ['digital-prints'] },
  { label: 'Caricatures', aliases: ['caricatures'] },
];
export function catalogueCategory(value: string): string {
  const slug = categorySlug(value);
  return groups.find(group => group.aliases.includes(slug))?.label || (slug === 'uncategorized' || !slug ? 'Studio Finds' : value);
}
export function matchesCategory(product: Product, selection: string): boolean {
  return !selection || categorySlug(catalogueCategory(product.category)) === categorySlug(catalogueCategory(selection));
}
