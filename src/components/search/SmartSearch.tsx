"use client";

import React, { useState, useEffect } from 'react';
import { getAllProducts } from '@/actions/products';
import { Product } from '@/lib/api';
import Link from 'next/link';

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartSearch({ isOpen, onClose }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && products.length === 0) {
      setIsLoading(true);
      getAllProducts().then(data => {
        setProducts(data);
        setIsLoading(false);
      });
    }
  }, [isOpen, products.length]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Fuzzy matching logic based on PIM fields
    const filtered = products.filter(product => {
      // 1. Name & Category
      if (product.name.toLowerCase().includes(lowerQuery)) return true;
      if (product.category.toLowerCase().includes(lowerQuery)) return true;
      
      // 2. Intent-based fields (Occasion, Room Type)
      if (product.occasion?.some(o => o.toLowerCase().includes(lowerQuery))) return true;
      if (product.roomType?.some(r => r.toLowerCase().includes(lowerQuery))) return true;
      
      // 3. Aesthetic fields (Color, Style, Medium)
      if (product.colorPalette?.some(c => c.toLowerCase().includes(lowerQuery))) return true;
      if (product.style?.some(s => s.toLowerCase().includes(lowerQuery))) return true;
      if (product.medium?.toLowerCase().includes(lowerQuery)) return true;
      if (product.material?.toLowerCase().includes(lowerQuery)) return true;
      
      return false;
    });

    setResults(filtered);
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <div className="search-overlay-header">
        <input 
          type="text" 
          placeholder="Search for gifts, artworks, occasions, or materials..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="search-input"
        />
        <button onClick={onClose} className="search-close-btn" aria-label="Close search">
          ✕
        </button>
      </div>

      <div className="search-results container">
        {isLoading && <p>Loading catalog...</p>}
        {!isLoading && query && results.length === 0 && (
          <p>We couldn't find anything for "{query}". Try searching for an occasion like "Anniversary" or a color like "Blue".</p>
        )}
        {!isLoading && results.length > 0 && (
          <div className="product-grid" style={{ marginTop: '2rem' }}>
            {results.map(product => (
              <div key={product.id} className="search-result-card" onClick={onClose}>
                <Link href={`/shop/product/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                  <img src="/images/deepti_painting.png" alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1', marginBottom: '1rem' }} />
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>{product.category}</h4>
                  <h3 style={{ margin: '0.2rem 0', fontSize: '1.1rem' }}>{product.name}</h3>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>₹{product.price.toLocaleString('en-IN')}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
        
        {!query && !isLoading && (
          <div className="search-suggestions">
            <p style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '1rem' }}>Popular Searches</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Corporate Gifts', 'Housewarming', 'Resin Art', 'Blue', 'Teak Wood'].map(s => (
                <button key={s} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--bg-secondary)', border: 'none' }} onClick={() => setQuery(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
