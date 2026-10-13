'use client';

import { useCallback, useEffect, useState } from 'react';
import { isStorefrontInventoryProduct, normalizeStorefrontProduct, type Product } from '@/lib/api';

export function catalogueProducts(payload: unknown): Product[] {
  const data = payload as { data?: unknown; products?: unknown } | null;
  const records = Array.isArray(payload) ? payload : Array.isArray(data?.data) ? data.data : Array.isArray(data?.products) ? data.products : null;
  if (!records) throw new Error('Invalid catalogue response');
  return records.map(normalizeStorefrontProduct).filter(isStorefrontInventoryProduct);
}

/** Stock is fetched at runtime: the static export intentionally contains no inventory. */
export function useLiveCatalogue(initialProducts: Product[]) {
  const [products, setProducts] = useState(() => catalogueProducts(initialProducts));
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  useEffect(() => {
    let active = true;
    let controller: AbortController;
    const refresh = async () => {
      controller?.abort();
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch('/api/storefront/products', { cache: 'no-store', signal: controller.signal, headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Catalogue unavailable');
        const current = catalogueProducts(await response.json());
        if (active) { setProducts(current); setStatus('ready'); }
      } catch {
        if (active) setStatus('error');
      } finally { window.clearTimeout(timeout); }
    };
    setStatus('loading');
    void refresh();
    const timer = window.setInterval(refresh, 60000);
    return () => { active = false; controller?.abort(); window.clearInterval(timer); };
  }, [attempt]);
  return { products, status, retry };
}
