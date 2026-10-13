'use client';
import { useEffect, useState } from 'react';
import { erpCategoryNames } from '@/lib/catalogue-categories';

/** Read the public ERP taxonomy independently of stock counts. */
export function useERPCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    let active = true;
    let controller: AbortController;
    const refresh = async () => {
      controller?.abort();
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch('/api/storefront/categories', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Categories unavailable');
        const names = erpCategoryNames(await response.json());
        if (active) setCategories(names);
      } catch { /* Retain verified categories; Shop also uses product labels as a fallback. */ }
      finally { window.clearTimeout(timeout); }
    };
    void refresh();
    const timer = window.setInterval(refresh, 60000);
    return () => { active = false; controller?.abort(); window.clearInterval(timer); };
  }, []);
  return categories;
}
