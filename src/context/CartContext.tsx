"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { GiftCartBundle } from '@/features/gifts/types';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  giftBundles: GiftCartBundle[];
  addToCart: (productId: string, quantity?: number) => void;
  addGiftBundle: (bundle: GiftCartBundle) => void;
  removeGiftBundle: (bundleId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

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

  const addToCart = (productId: string, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };
  const addGiftBundle = (bundle: GiftCartBundle) => {
    setItems((previous) => {
      const next = [...previous];
      bundle.items.forEach((bundleItem) => {
        const existing = next.find((item) => item.productId === bundleItem.productId);
        if (existing) existing.quantity += bundleItem.quantity;
        else next.push({ productId: bundleItem.productId, quantity: bundleItem.quantity });
      });
      return next;
    });
    setGiftBundles((previous) => [...previous, bundle]);
  };
  const removeGiftBundle = (bundleId: string) => setGiftBundles((previous) => previous.filter((bundle) => bundle.id !== bundleId));
  const clearCart = () => { setItems([]); setGiftBundles([]); };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, giftBundles, addToCart, addGiftBundle, removeGiftBundle, removeFromCart, clearCart, cartCount }}>
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
