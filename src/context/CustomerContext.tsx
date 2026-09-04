"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

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
  
  isAuthenticated: boolean;
  user: { id?: string; name: string; email: string } | null;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ emailConfirmationRequired: boolean }>;
  logout: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [savedCollections, setSavedCollections] = useState<Collection[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id?: string; name: string; email: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Accept the one-time Supabase Auth callback, then validate the session
  // through the ERP before treating the visitor as signed in.
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('artzy_wishlist');
      const storedRecent = localStorage.getItem('artzy_recent');
      const storedCollections = localStorage.getItem('artzy_collections');
      
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));
      if (storedCollections) setSavedCollections(JSON.parse(storedCollections));
      const callback = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const callbackToken = callback.get('access_token');
      const callbackRefresh = callback.get('refresh_token');
      if (callbackToken) {
        localStorage.setItem('artzy_customer_access_token', callbackToken);
        if (callbackRefresh) localStorage.setItem('artzy_customer_refresh_token', callbackRefresh);
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      }
      const accessToken = callbackToken || localStorage.getItem('artzy_customer_access_token');
      if (accessToken) {
        api.customerAuth.me(accessToken)
          .then((result) => {
            setUser(result.user);
            setIsAuthenticated(true);
          })
          .catch(() => {
            localStorage.removeItem('artzy_customer_access_token');
            localStorage.removeItem('artzy_customer_refresh_token');
          })
          .finally(() => setIsAuthLoading(false));
        return;
      }
    } catch (e) {
      console.warn("Could not load customer state from localStorage", e);
    }
    setIsAuthLoading(false);
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

  const saveSession = (result: any) => {
    if (!result.accessToken) return;
    localStorage.setItem('artzy_customer_access_token', result.accessToken);
    if (result.refreshToken) localStorage.setItem('artzy_customer_refresh_token', result.refreshToken);
    setUser(result.user);
    setIsAuthenticated(true);
  };

  const login = async (email: string, password: string) => {
    const result = await api.customerAuth.login(email, password);
    saveSession(result);
  };

  const signup = async (name: string, email: string, password: string) => {
    const result = await api.customerAuth.signup(name, email, password);
    saveSession(result);
    return { emailConfirmationRequired: Boolean(result.emailConfirmationRequired) };
  };

  const logout = () => {
    localStorage.removeItem('artzy_customer_access_token');
    localStorage.removeItem('artzy_customer_refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <CustomerContext.Provider value={{
      wishlist, addToWishlist, removeFromWishlist,
      recentlyViewed, addRecentlyViewed,
      savedCollections, createCollection, addToCollection,
      isAuthenticated, user, isAuthLoading, login, signup, logout
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
