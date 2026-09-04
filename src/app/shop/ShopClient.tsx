"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { isStorefrontInventoryProduct, normalizeStorefrontProduct, Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';

const ERP_PRODUCT_FEED = '/api/storefront/products';
const PRODUCT_BATCH_SIZE = 12;

const slugify = (value: string) =>
  value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function ShopClient({ initialProducts, categoryScope = [] }: { initialProducts: Product[]; categoryScope?: string[] }) {
  const inScope = (product: Product) => isStorefrontInventoryProduct(product) && (categoryScope.length === 0 || categoryScope.some((scope) => slugify(product.category).includes(slugify(scope))));
  const [products, setProducts] = useState<Product[]>(() => initialProducts.map(normalizeStorefrontProduct).filter(inScope));
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [readyToShipOnly, setReadyToShipOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(PRODUCT_BATCH_SIZE);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const productCategories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).filter(Boolean),
    [products],
  );
  const categories = productCategories;
  const occasions = useMemo(
    () => Array.from(new Set(products.flatMap((product) => product.occasion || []))).filter(Boolean),
    [products],
  );
  const rooms = useMemo(
    () => Array.from(new Set(products.flatMap((product) => product.roomType || []))).filter(Boolean),
    [products],
  );
  const highestPrice = useMemo(
    () => Math.max(0, ...products.map((product) => product.price)),
    [products],
  );
  const [maxPrice, setMaxPrice] = useState(highestPrice);

  useEffect(() => {
    let isCurrent = true;
    let controller: AbortController | null = null;

    const refreshProducts = async () => {
      controller?.abort();
      controller = new AbortController();

      try {
        const statusResponse = await fetch('/api/storefront/status', {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        const status = statusResponse.ok
          ? await statusResponse.json() as { configured?: boolean }
          : { configured: false };
        // Without the authenticated ERP proxy, do not attempt a public fetch.
        if (!status.configured) return;

        const response = await fetch(`${ERP_PRODUCT_FEED}?ts=${Date.now()}`, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Product sync failed with ${response.status}`);

        const payload = await response.json();
        const records = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.products) ? payload.products : [];
        // Replace the catalogue even when the live feed is empty. Retaining old
        // products here could leave a newly drafted item visible indefinitely.
        if (isCurrent) setProducts(records.map(normalizeStorefrontProduct).filter(inScope));
      } catch (error) {
        if (isCurrent && !(error instanceof DOMException && error.name === 'AbortError')) {
          console.warn('Live ERP refresh is unavailable.', error);
        }
      }
    };

    void refreshProducts();
    const refreshTimer = window.setInterval(refreshProducts, 60_000);

    return () => {
      isCurrent = false;
      controller?.abort();
      window.clearInterval(refreshTimer);
    };
  }, []);

  useEffect(() => {
    setMaxPrice(highestPrice);
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get('category');
    const requestedRoom = params.get('room');
    const requestedOccasion = params.get('occasion');
    setReadyToShipOnly(params.get('availability') === 'in-stock');
    if (requestedCategory) {
      const matchingCategory = categories.find(
        (category) => slugify(category) === requestedCategory || slugify(category).includes(requestedCategory),
      );
      if (matchingCategory) setSelectedCategory(matchingCategory);
    }
    if (requestedRoom) {
      const matchingRoom = rooms.find((room) => slugify(room) === requestedRoom || slugify(room).includes(requestedRoom));
      if (matchingRoom) setSelectedRoom(matchingRoom);
    }
    if (requestedOccasion) {
      const matchingOccasion = occasions.find((occasion) => slugify(occasion) === requestedOccasion || slugify(occasion).includes(requestedOccasion));
      if (matchingOccasion) setSelectedOccasion(matchingOccasion);
    }
  }, [categories, highestPrice, occasions, rooms]);

  useEffect(() => {
    const requestedProduct = new URLSearchParams(window.location.search).get('product');
    if (!requestedProduct) return;
    const match = products.find((product) => String(product.id) === requestedProduct);
    if (match) setSelectedProduct(match);
  }, [products]);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    const url = new URL(window.location.href);
    url.searchParams.set('product', String(product.id));
    window.history.replaceState({}, '', url);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('product');
    window.history.replaceState({}, '', url);
  };

  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory) return false;
      if (selectedOccasion && (!product.occasion || !product.occasion.includes(selectedOccasion))) return false;
      if (selectedRoom && (!product.roomType || !product.roomType.includes(selectedRoom))) return false;
      if (readyToShipOnly && product.availability !== 'in_stock') return false;
      return product.price <= maxPrice;
    });

    if (sortBy === 'price-low') return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') return [...filtered].sort((a, b) => Date.parse(b.erpUpdatedAt || '') - Date.parse(a.erpUpdatedAt || ''));
    if (sortBy === 'availability') return [...filtered].sort((a, b) => Number(b.availability === 'in_stock') - Number(a.availability === 'in_stock'));
    if (sortBy === 'name') return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [products, maxPrice, readyToShipOnly, selectedCategory, selectedOccasion, selectedRoom, sortBy]);

  const activeFilterCount =
    [selectedCategory, selectedOccasion, selectedRoom].filter(Boolean).length +
    (maxPrice < highestPrice ? 1 : 0) + (readyToShipOnly ? 1 : 0);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const remainingProducts = Math.max(0, filteredProducts.length - visibleProducts.length);

  useEffect(() => {
    setVisibleCount(PRODUCT_BATCH_SIZE);
  }, [maxPrice, readyToShipOnly, selectedCategory, selectedOccasion, selectedRoom, sortBy]);

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 650);
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    return () => window.removeEventListener('scroll', updateBackToTop);
  }, [categoryScope.join('|')]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedOccasion('');
    setSelectedRoom('');
    setMaxPrice(highestPrice);
    setReadyToShipOnly(false);
  };

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    document.getElementById('shop-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

      <fieldset className="filter-group">
        <legend>Availability</legend>
        <label className="filter-option"><input type="checkbox" checked={readyToShipOnly} onChange={(event) => setReadyToShipOnly(event.target.checked)} /><span>Ready to ship</span></label>
      </fieldset>
    </>
  );

  return (
    <div className="shop-shell container">
      <div className="shop-controls" id="shop-products">
        <div className="category-strip-heading">
          <strong>Browse categories</strong>
          <span>Swipe or tap to explore</span>
        </div>
        <nav className="category-strip" aria-label="Shop categories">
          <button className={!selectedCategory ? 'active' : ''} onClick={() => chooseCategory('')}>All products</button>
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

        {activeFilterCount > 0 && <div className="active-filter-chips" aria-label="Active filters">
          {selectedCategory && <button onClick={() => setSelectedCategory('')}>{selectedCategory} <span aria-hidden="true">×</span></button>}
          {selectedOccasion && <button onClick={() => setSelectedOccasion('')}>{selectedOccasion} <span aria-hidden="true">×</span></button>}
          {selectedRoom && <button onClick={() => setSelectedRoom('')}>{selectedRoom} <span aria-hidden="true">×</span></button>}
          {readyToShipOnly && <button onClick={() => setReadyToShipOnly(false)}>Ready to ship <span aria-hidden="true">×</span></button>}
          {maxPrice < highestPrice && <button onClick={() => setMaxPrice(highestPrice)}>Up to ₹{maxPrice.toLocaleString('en-IN')} <span aria-hidden="true">×</span></button>}
        </div>}

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
                <option value="newest">Newest</option>
                <option value="availability">Availability</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="shop-layout">
        <aside className="shop-filters desktop-filters">{filterPanel}</aside>
        <section className="shop-results" aria-live="polite">
          {filteredProducts.length > 0 ? (
            <>
              <div className="product-grid">
                {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onView={() => openProduct(product)} />)}
              </div>
              {remainingProducts > 0 && (
                <div className="shop-load-more">
                  <p>Showing {visibleProducts.length} of {filteredProducts.length} pieces</p>
                  <button type="button" onClick={() => setVisibleCount((count) => count + PRODUCT_BATCH_SIZE)}>
                    View {PRODUCT_BATCH_SIZE} more <span>{remainingProducts} remaining</span>
                  </button>
                </div>
              )}
            </>
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
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={closeProduct} />}
      <button
        className={`back-to-top${showBackToTop ? ' visible' : ''}`}
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <span aria-hidden="true">↑</span>
        <strong>Top</strong>
      </button>
    </div>
  );
}
