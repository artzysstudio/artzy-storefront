"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { isStorefrontInventoryProduct, Product } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { RichProductName } from '@/components/RichProductText';
import { normaliseStockLimit, remainingStock } from '@/lib/cart-stock';

export default function ProductCard({ product, className, onView }: { product: Product, className?: string, onView?: () => void }) {
  const { addToCart, items } = useCart();
  const [added, setAdded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const isCorporate = product.collectionId === 'c-corporate-gifts';
  const stockQuantity = normaliseStockLimit(product.quantity);
  const quantityInBag = items.find((item) => item.productId === product.id && !item.variantId)?.quantity || 0;
  const remaining = remainingStock(stockQuantity, quantityInBag);
  const stockReached = remaining === 0;

  if (!isStorefrontInventoryProduct(product)) return null;

  const handlePrimaryAction = () => {
    if (isCorporate) {
      window.location.href = `/contact?type=corporate&product=${encodeURIComponent(String(product.id))}`;
      return;
    }

    addToCart(product.id, 1, { availableStock: stockQuantity });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const productImage = (
    <>
      {!imageFailed && product.images[0] ? <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 560px) 50vw, (max-width: 1024px) 33vw, 300px"
          className="product-image"
          style={{ objectFit: 'cover' }}
          unoptimized
          onError={() => setImageFailed(true)}
        /> : <span className="product-image-fallback" role="img" aria-label={`${product.name} image temporarily unavailable`}>
          <Image src="/images/artzy-studio-logo.png" alt="" width={88} height={88} unoptimized />
          <small>Studio image coming soon</small>
        </span>}
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
          disabled={product.isSoldOut || stockReached}
          onClick={handlePrimaryAction}
        >
          {product.isSoldOut
            ? 'Sold out'
            : isCorporate
              ? 'Enquire'
              : stockReached
                ? stockQuantity === 1 ? 'Only one · in bag' : 'All available · in bag'
              : added
                ? 'Added ✓'
                : quantityInBag > 0 ? 'Add another' : 'Add to bag'}
        </button>
        {!isCorporate && stockQuantity !== null && stockQuantity > 0 && (
          <small className="product-card-stock">{stockQuantity === 1 ? 'One available' : `${stockQuantity} available`}</small>
        )}
      </div>
      <style jsx>{`
        .product-card-stock{display:block;grid-column:1/-1;padding:7px 6px 0;color:#75665e;font-size:.65rem;line-height:1.3;text-align:center}
      `}</style>
    </article>
  );
}
