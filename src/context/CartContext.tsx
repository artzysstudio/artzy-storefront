"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import type { GiftCartBundle } from '@/features/gifts/types';
import { clampCartQuantity, normaliseStockLimit } from '@/lib/cart-stock';

export interface CartItem {
  productId: string;
  quantity: number;
  variantId?: string;
  variantLabel?: string;
  availableStock?: number | null;
}

export interface AddToCartOptions {
  variantId?: string;
  variantLabel?: string;
  availableStock?: number | null;
}

interface CartContextType {
  items: CartItem[];
  giftBundles: GiftCartBundle[];
  addToCart: (productId: string, quantity?: number, options?: AddToCartOptions) => void;
  setCartQuantity: (productId: string, quantity: number, options?: AddToCartOptions) => void;
  addGiftBundle: (bundle: GiftCartBundle) => void;
  removeGiftBundle: (bundleId: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const sameLine = (item: CartItem, productId: string, variantId?: string) =>
  item.productId === productId && (item.variantId || '') === (variantId || '');
const optionStock = (options: AddToCartOptions, fallback?: number | null) =>
  normaliseStockLimit(Object.prototype.hasOwnProperty.call(options, 'availableStock') ? options.availableStock : fallback);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [giftBundles, setGiftBundles] = useState<GiftCartBundle[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('artzy_cart');
      if (saved) setItems(JSON.parse(saved));
      const savedBundles = localStorage.getItem('artzy_gift_bundles');
      if (savedBundles) setGiftBundles(JSON.parse(savedBundles));
    } catch {
      localStorage.removeItem('artzy_cart');
      localStorage.removeItem('artzy_gift_bundles');
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem('artzy_cart', JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('artzy_gift_bundles', JSON.stringify(giftBundles));
  }, [giftBundles, hydrated]);

  const addToCart = useCallback((productId: string, quantity = 1, options: AddToCartOptions = {}) => {
    setItems(prev => {
      const existing = prev.find(item => sameLine(item, productId, options.variantId));
      const stock = optionStock(options, existing?.availableStock);
      if (existing) {
        return prev.map(item => 
          sameLine(item, productId, options.variantId)
            ? { ...item, ...options, availableStock: stock, quantity: clampCartQuantity(item.quantity + quantity, stock) }
            : item
        );
      }
      const nextQuantity = clampCartQuantity(quantity, stock);
      return nextQuantity > 0 ? [...prev, { productId, quantity: nextQuantity, ...options, availableStock: stock }] : prev;
    });
  }, []);

  const setCartQuantity = useCallback((productId: string, quantity: number, options: AddToCartOptions = {}) => {
    setItems((previous) => previous.flatMap((item) => {
      if (!sameLine(item, productId, options.variantId)) return [item];
      const stock = optionStock(options, item.availableStock);
      const nextQuantity = clampCartQuantity(quantity, stock);
      return nextQuantity > 0 ? [{ ...item, ...options, availableStock: stock, quantity: nextQuantity }] : [];
    }));
  }, []);

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    setItems(prev => prev.filter(item => !sameLine(item, productId, variantId)));
  }, []);
  const addGiftBundle = (bundle: GiftCartBundle) => {
    setItems((previous) => {
      const next = [...previous];
      bundle.items.forEach((bundleItem) => {
        const existing = next.find((item) => sameLine(item, bundleItem.productId));
        if (existing) existing.quantity += bundleItem.quantity;
        else next.push({ productId: bundleItem.productId, quantity: bundleItem.quantity });
      });
      return next;
    });
    setGiftBundles((previous) => [...previous, bundle]);
  };
  const removeGiftBundle = (bundleId: string) => {
    const bundle = giftBundles.find((candidate) => candidate.id === bundleId);
    setGiftBundles((previous) => previous.filter((candidate) => candidate.id !== bundleId));
    if (!bundle) return;
    setItems((previous) => previous.flatMap((item) => {
      const bundleItem = bundle.items.find((candidate) => candidate.productId === item.productId);
      if (!bundleItem) return [item];
      const quantity = item.quantity - bundleItem.quantity;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };
  const clearCart = () => { setItems([]); setGiftBundles([]); };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, giftBundles, addToCart, setCartQuantity, addGiftBundle, removeGiftBundle, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
