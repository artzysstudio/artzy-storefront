"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

const ARTZY_AI_ENABLED = false;

export default function ProductCard({ product, className, onView }: { product: Product, className?: string, onView?: () => void }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const isCorporate = product.collectionId === 'c-corporate-gifts';

  const handlePrimaryAction = () => {
    if (isCorporate) {
      window.location.href = `/contact?type=corporate&product=${encodeURIComponent(String(product.id))}`;
      return;
    }

    addToCart(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const productImage = (
    <>
      {product.images?.[0] ? (
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 560px) 50vw, (max-width: 1024px) 33vw, 300px"
          className="product-image"
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      ) : (
        <img
          src="/images/deepti_painting.png"
          alt={product.name}
          className="product-image"
        />
      )}
      {product.isSoldOut && <span className="product-status">Sold out</span>}
    </>
  );

  return (
    <article className={`product-card ${className || ''}`}>
      {onView ? (
        <button type="button" className="product-image-wrapper product-view-trigger" aria-label={`View ${product.name}`} onClick={onView}>
          {productImage}
        </button>
      ) : (
        <Link href={`/shop?product=${encodeURIComponent(String(product.id))}`} className="product-image-wrapper" aria-label={`View ${product.name}`}>
          {productImage}
        </Link>
      )}

      <div className="product-meta">
        <span className="product-category">{product.category}</span>
        {onView ? <button type="button" className="product-name-link product-name-trigger" onClick={onView}>
          <h3 className="product-name">{product.name}</h3>
        </button> : <Link href={`/shop?product=${encodeURIComponent(String(product.id))}`} className="product-name-link"><h3 className="product-name">{product.name}</h3></Link>}
        <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
      </div>

      <div className="product-card-actions">
        {ARTZY_AI_ENABLED && <a
          href={`https://artzyai.artzysstudio.in/?source=storefront&productId=${encodeURIComponent(String(product.id))}&productName=${encodeURIComponent(product.name)}&image=${encodeURIComponent(product.images?.[0] || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="visualize-card-button"
          aria-label={`Visualize ${product.name} with ArtzyAI`}
        >
          ✦ ArtzyAI
        </a>}
        <button
          className={`quick-add-button${added ? ' added' : ''}`}
          disabled={product.isSoldOut}
          onClick={handlePrimaryAction}
        >
          {product.isSoldOut
            ? 'Sold out'
            : isCorporate
              ? 'Enquire'
              : added
                ? 'Added ✓'
                : 'Add to bag'}
        </button>
      </div>
    </article>
  );
}
