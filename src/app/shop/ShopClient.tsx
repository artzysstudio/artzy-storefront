"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

const slugify = (value: string) =>
  value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  const categories = useMemo(
    () => Array.from(new Set(initialProducts.map((product) => product.category))).filter(Boolean),
    [initialProducts],
  );
  const occasions = useMemo(
    () => Array.from(new Set(initialProducts.flatMap((product) => product.occasion || []))).filter(Boolean),
    [initialProducts],
  );
  const rooms = useMemo(
    () => Array.from(new Set(initialProducts.flatMap((product) => product.roomType || []))).filter(Boolean),
    [initialProducts],
  );
  const highestPrice = useMemo(
    () => Math.max(0, ...initialProducts.map((product) => product.price)),
    [initialProducts],
  );
  const [maxPrice, setMaxPrice] = useState(highestPrice);

  useEffect(() => {
    setMaxPrice(highestPrice);
    const requestedCategory = new URLSearchParams(window.location.search).get('category');
    if (!requestedCategory) return;
    const matchingCategory = categories.find(
      (category) => slugify(category) === requestedCategory || slugify(category).includes(requestedCategory),
    );
    if (matchingCategory) setSelectedCategory(matchingCategory);
  }, [categories, highestPrice]);

  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  const filteredProducts = useMemo(() => {
    const filtered = initialProducts.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory) return false;
      if (selectedOccasion && (!product.occasion || !product.occasion.includes(selectedOccasion))) return false;
      if (selectedRoom && (!product.roomType || !product.roomType.includes(selectedRoom))) return false;
      return product.price <= maxPrice;
    });

    if (sortBy === 'price-low') return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === 'name') return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [initialProducts, maxPrice, selectedCategory, selectedOccasion, selectedRoom, sortBy]);

  const activeFilterCount =
    [selectedCategory, selectedOccasion, selectedRoom].filter(Boolean).length +
    (maxPrice < highestPrice ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedOccasion('');
    setSelectedRoom('');
    setMaxPrice(highestPrice);
  };

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterPanel = (
    <>
      <div className="filter-panel-heading">
        <div>
          <span className="filter-eyebrow">Refine results</span>
          <h2>Filters</h2>
        </div>
        {activeFilterCount > 0 && (
          <button className="filter-clear" onClick={clearFilters}>Clear all</button>
        )}
      </div>

      <fieldset className="filter-group">
        <legend>Category</legend>
        <label className="filter-option">
          <input
            type="radio"
            name="category"
            checked={!selectedCategory}
            onChange={() => setSelectedCategory('')}
          />
          <span>All products</span>
        </label>
        {categories.map((category) => (
          <label className="filter-option" key={category}>
            <input
              type="radio"
              name="category"
              checked={selectedCategory === category}
              onChange={() => setSelectedCategory(category)}
            />
            <span>{category}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="filter-group">
        <legend>Maximum price</legend>
        <div className="price-value">Up to ₹{maxPrice.toLocaleString('en-IN')}</div>
        <input
          className="price-range"
          type="range"
          min="0"
          max={highestPrice || 1}
          step="100"
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          aria-label="Maximum price"
        />
      </fieldset>

      {occasions.length > 0 && (
        <fieldset className="filter-group">
          <legend>Gifting occasion</legend>
          {occasions.map((occasion) => (
            <label className="filter-option" key={occasion}>
              <input
                type="radio"
                name="occasion"
                checked={selectedOccasion === occasion}
                onChange={() => setSelectedOccasion(occasion)}
              />
              <span>{occasion}</span>
            </label>
          ))}
        </fieldset>
      )}

      {rooms.length > 0 && (
        <fieldset className="filter-group">
          <legend>Room</legend>
          {rooms.map((room) => (
            <label className="filter-option" key={room}>
              <input
                type="radio"
                name="room"
                checked={selectedRoom === room}
                onChange={() => setSelectedRoom(room)}
              />
              <span>{room}</span>
            </label>
          ))}
        </fieldset>
      )}
    </>
  );

  return (
    <div className="shop-shell container">
      <nav className="category-strip" aria-label="Shop categories">
        <button className={!selectedCategory ? 'active' : ''} onClick={() => chooseCategory('')}>All</button>
        {categories.map((category) => (
          <button
            className={selectedCategory === category ? 'active' : ''}
            key={category}
            onClick={() => chooseCategory(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      <div className="shop-toolbar">
        <div className="results-count"><strong>{filteredProducts.length}</strong> pieces</div>
        <div className="shop-toolbar-actions">
          <button
            className="mobile-filter-button"
            onClick={() => setMobileFiltersOpen(true)}
            aria-expanded={mobileFiltersOpen}
          >
            Filters {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
          </button>
          <label className="sort-control">
            <span>Sort</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
      </div>

      <div className="shop-layout">
        <aside className="shop-filters desktop-filters">{filterPanel}</aside>
        <section className="shop-results" aria-live="polite">
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="empty-results">
              <h2>No pieces match these filters</h2>
              <p>Clear one or more filters to see more of Deepti’s collection.</p>
              <button className="btn btn-solid" onClick={clearFilters}>Show all products</button>
            </div>
          )}
        </section>
      </div>

      {mobileFiltersOpen && (
        <div
          className="filter-drawer-backdrop"
          role="presentation"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <aside
            className="filter-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Product filters"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="filter-drawer-top">
              <strong>Filter products</strong>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">×</button>
            </div>
            <div className="filter-drawer-content">{filterPanel}</div>
            <div className="filter-drawer-actions">
              <button className="btn" onClick={clearFilters}>Clear</button>
              <button className="btn btn-solid" onClick={() => setMobileFiltersOpen(false)}>
                View {filteredProducts.length} pieces
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
