"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { isStorefrontInventoryProduct, Product } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { RichProductName } from '@/components/RichProductText';

export default function ProductCard({ product, className, onView }: { product: Product, className?: string, onView?: () => void }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const isCorporate = product.collectionId === 'c-corporate-gifts';

  if (!isStorefrontInventoryProduct(product)) return null;

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
      <Image
        src={product.images[0]}
        alt={product.name}
        fill
        sizes="(max-width: 560px) 50vw, (max-width: 1024px) 33vw, 300px"
        className="product-image"
        style={{ objectFit: 'cover' }}
        unoptimized
      />
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
          <h3 className="product-name"><RichProductName name={product.name} /></h3>
        </button> : <Link href={`/shop?product=${encodeURIComponent(String(product.id))}`} className="product-name-link"><h3 className="product-name"><RichProductName name={product.name} /></h3></Link>}
        <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
      </div>

      <div className="product-card-actions">
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
