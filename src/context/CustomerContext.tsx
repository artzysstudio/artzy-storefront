"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Collection {
  id: string;
  name: string;
  productIds: string[];
}

interface CustomerContextType {
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;
  
  savedCollections: Collection[];
  createCollection: (name: string) => void;
  addToCollection: (collectionId: string, productId: string) => void;
  
  // Basic Auth Shell
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [savedCollections, setSavedCollections] = useState<Collection[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load from LocalStorage on mount (Fallback until ERP auth is live)
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('artzy_wishlist');
      const storedRecent = localStorage.getItem('artzy_recent');
      const storedCollections = localStorage.getItem('artzy_collections');
      
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));
      if (storedCollections) setSavedCollections(JSON.parse(storedCollections));
    } catch (e) {
      console.warn("Could not load customer state from localStorage", e);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('artzy_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('artzy_recent', JSON.stringify(recentlyViewed));
    localStorage.setItem('artzy_collections', JSON.stringify(savedCollections));
  }, [wishlist, recentlyViewed, savedCollections]);

  const addToWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev : [...prev, productId]);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10); // Keep last 10
    });
  };

  const createCollection = (name: string) => {
    const newCol: Collection = { id: Date.now().toString(), name, productIds: [] };
    setSavedCollections(prev => [...prev, newCol]);
  };

  const addToCollection = (collectionId: string, productId: string) => {
    setSavedCollections(prev => prev.map(c => {
      if (c.id === collectionId && !c.productIds.includes(productId)) {
        return { ...c, productIds: [...c.productIds, productId] };
      }
      return c;
    }));
  };

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <CustomerContext.Provider value={{
      wishlist, addToWishlist, removeFromWishlist,
      recentlyViewed, addRecentlyViewed,
      savedCollections, createCollection, addToCollection,
      isAuthenticated, login, logout
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}
