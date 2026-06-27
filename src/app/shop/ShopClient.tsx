"use client";

import React, { useState, useMemo } from 'react';
import { Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  
  // Extract unique filter options from the PIM data
  const categories = useMemo(() => Array.from(new Set(initialProducts.map(p => p.category))), [initialProducts]);
  const occasions = useMemo(() => Array.from(new Set(initialProducts.flatMap(p => p.occasion || []))), [initialProducts]);
  const rooms = useMemo(() => Array.from(new Set(initialProducts.flatMap(p => p.roomType || []))), [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedOccasion && (!p.occasion || !p.occasion.includes(selectedOccasion))) return false;
      if (selectedRoom && (!p.roomType || !p.roomType.includes(selectedRoom))) return false;
      return true;
    });
  }, [initialProducts, selectedCategory, selectedOccasion, selectedRoom]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedOccasion('');
    setSelectedRoom('');
  };

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 'var(--spacing-lg)' }}>
      {/* Sidebar Filters */}
      <aside className="shop-filters" style={{ borderRight: '1px solid rgba(0,0,0,0.05)', paddingRight: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>Filters</h3>
          {(selectedCategory || selectedOccasion || selectedRoom) && (
            <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--accent-terracotta)', cursor: 'pointer', fontSize: '0.85rem' }}>
              Clear All
            </button>
          )}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>Category</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {categories.map(cat => (
              <li key={cat}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="category" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} />
                  {cat}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>Gifting Occasion</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {occasions.map(occ => (
              <li key={occ}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="occasion" checked={selectedOccasion === occ} onChange={() => setSelectedOccasion(occ)} />
                  {occ}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>Room Type</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {rooms.map(room => (
              <li key={room}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="room" checked={selectedRoom === room} onChange={() => setSelectedRoom(room)} />
                  {room}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Product Grid */}
      <div>
        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Showing {filteredProducts.length} results
        </div>
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
            <h3>No pieces found</h3>
            <p>Try adjusting your filters to discover more.</p>
            <button className="btn btn-solid" style={{ marginTop: '1rem' }} onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
