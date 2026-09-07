import type { Product, ProductVariant } from '@/lib/api';

const IN_STOCK = 'https://schema.org/InStock';
const OUT_OF_STOCK = 'https://schema.org/OutOfStock';
const NEW_CONDITION = 'https://schema.org/NewCondition';

export interface StructuredOffer {
  '@type': 'Offer';
  url: string;
  priceCurrency: 'INR';
  price: number;
  availability: typeof IN_STOCK | typeof OUT_OF_STOCK;
  itemCondition: typeof NEW_CONDITION;
  name?: string;
  sku?: string;
}

function verifiedPrice(value: unknown): number | undefined {
  const price = typeof value === 'number' ? value : Number.NaN;
  return Number.isFinite(price) && price > 0 ? price : undefined;
}

export function effectiveProductPrice(product: Product): number {
  return verifiedPrice(product.salePrice) ?? verifiedPrice(product.price) ?? 0;
}

function variantName(variant: ProductVariant, index: number): string {
  return variant.name
    || variant.title
    || [variant.option, variant.value].filter(Boolean).join(': ')
    || `Variant ${index + 1}`;
}

function isAvailable(product: Product, variant?: ProductVariant): boolean {
  if (product.isSoldOut || product.availability === 'out_of_stock') return false;
  if (!variant) return product.quantity !== 0;
  return variant.isAvailable !== false && variant.quantity !== 0;
}

function offer(
  product: Product,
  canonical: string,
  price: number,
  variant?: ProductVariant,
  index = 0,
): StructuredOffer {
  return {
    '@type': 'Offer',
    url: canonical,
    priceCurrency: 'INR',
    price,
    availability: isAvailable(product, variant) ? IN_STOCK : OUT_OF_STOCK,
    itemCondition: NEW_CONDITION,
    ...(variant ? { name: variantName(variant, index) } : {}),
    ...(variant?.sku ? { sku: variant.sku } : {}),
  };
}

/**
 * Product schema follows the effective ERP catalogue prices. When all active
 * variants share one price, one Offer describes that effective price. Products
 * with genuinely different variant prices expose one Offer per active variant.
 */
export function buildProductOffers(product: Product, canonical: string): StructuredOffer | StructuredOffer[] {
  const basePrice = effectiveProductPrice(product);
  const activeVariants = (product.variants || []).filter((variant) => variant.isAvailable !== false);

  if (activeVariants.length === 0) return offer(product, canonical, basePrice);

  const variantOffers = activeVariants.map((variant, index) => (
    offer(product, canonical, verifiedPrice(variant.price) ?? basePrice, variant, index)
  ));
  const effectivePrices = new Set(variantOffers.map((candidate) => candidate.price));

  if (effectivePrices.size === 1) {
    const single = offer(product, canonical, variantOffers[0].price);
    single.availability = variantOffers.some((candidate) => candidate.availability === IN_STOCK)
      ? IN_STOCK
      : OUT_OF_STOCK;
    return single;
  }

  return variantOffers;
}
