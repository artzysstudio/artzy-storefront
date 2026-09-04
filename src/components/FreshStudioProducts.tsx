"use client";

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { isStorefrontInventoryProduct, normalizeStorefrontProduct, type Product } from '@/lib/api';

const priorities = [
  'Handpainted Wooden Mirror Frame',
  'Handpainted Wooden Medium Size Sarswati Frame',
  'Handpainted Candle Tealight Holder Set Of 2',
  'Bamboo Pen Stand',
  'Cozy Tea Time Essentials',
  'Hand-painted Spoon Stand of 3',
  'Hand-painted Wooden Key Holder Cabinet',
  'Wooden Hand-painted Warli design Round wall hager',
];

function chooseFreshProducts(records: Product[]): Product[] {
  const available = records.map(normalizeStorefrontProduct).filter(isStorefrontInventoryProduct);
  const chosen: Product[] = [];

  for (const name of priorities) {
    const match = available.find((product) => product.name === name && !chosen.some((item) => item.id === product.id));
    if (match) chosen.push(match);
  }
  for (const product of available) {
    if (chosen.length >= 8) break;
    if (!chosen.some((item) => item.id === product.id)) chosen.push(product);
  }

  return chosen.slice(0, 8);
}

export default function FreshStudioProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(`/api/storefront/products?ts=${Date.now()}`, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Product sync failed with ${response.status}`);
        const payload = await response.json();
        const records = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.products)
              ? payload.products
              : [];
        setProducts(chooseFreshProducts(records));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.warn('Live homepage catalogue refresh is unavailable.', error);
          setProducts([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, []);

  if (loading) {
    return <div className="home-products-unavailable" role="status">Loading live studio catalogue…</div>;
  }

  if (products.length === 0) {
    return <div className="home-products-unavailable" role="status">
      <h3>The next studio pieces are being prepared.</h3>
      <p>Current availability will appear here as soon as the live studio catalogue reconnects. For a specific piece, please ask the studio directly.</p>
      <a href="https://wa.me/919158680722">Ask the studio on WhatsApp →</a>
    </div>;
  }

  return <div className="product-grid">
    {products.map((product) => <ProductCard key={product.id} product={product} />)}
  </div>;
}
