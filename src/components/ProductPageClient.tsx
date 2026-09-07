"use client";

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/api';
import { isStorefrontInventoryProduct, normalizeStorefrontProduct } from '@/lib/api';
import ProductDetailModal from '@/components/ProductDetailModal';

export default function ProductPageClient({ initialProduct }: { initialProduct: Product }) {
  const [product, setProduct] = useState(initialProduct);
  const [commerceReady, setCommerceReady] = useState(false);
  const [status, setStatus] = useState('Checking current studio availability…');

  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch(`/api/storefront/products?ts=${Date.now()}`, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Catalogue refresh failed with ${response.status}`);
        const payload = await response.json();
        const records = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.products) ? payload.products : [];
        const match = records
          .map(normalizeStorefrontProduct)
          .find((candidate: Product) => candidate.id === initialProduct.id && isStorefrontInventoryProduct(candidate));
        if (!match) {
          setStatus('This piece is not currently available in the live studio catalogue.');
          return;
        }
        setProduct(match);
        setCommerceReady(true);
        setStatus('Price, options and availability checked against the live studio catalogue.');
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setStatus('Live availability could not be checked. Ordering is paused for this piece.');
        }
      }
    };
    void refresh();
    return () => controller.abort();
  }, [initialProduct.id]);

  return <ProductDetailModal product={product} standalone commerceReady={commerceReady} availabilityStatus={status} />;
}
