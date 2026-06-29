"use client";

import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product, className }: { product: Product, className?: string }) {
  const { addToCart } = useCart();

  return (
    <div className={`product-card ${className || ''}`}>
      <Link href={`/shop/product/${product.id}`} className="product-image-wrapper">
        {product.images?.[0] ? (
          <Image 
            src={product.images[0]} 
            alt={product.name}
            fill
            className="product-image"
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        ) : (
          <img src="/images/deepti_painting.png" alt="Product Placeholder" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="product-image" />
        )}
        
        {!product.isSoldOut ? (
          <div className="add-to-cart-overlay" onClick={(e) => {
            e.preventDefault();
            if (product.collectionId === 'c-corporate-gifts') {
              alert('Corporate Request Proposal Flow initiated.');
            } else {
              addToCart(product.id);
            }
          }}>
            <button className="add-btn">
              {product.collectionId === 'c-corporate-gifts' 
                ? 'Request Proposal'
                : `Add to Bag — ₹${product.price.toLocaleString('en-IN')}`
              }
            </button>
          </div>
        ) : (
          <div className="add-to-cart-overlay" style={{background: 'rgba(255,255,255,0.7)'}}>
            <span className="add-btn" style={{cursor: 'not-allowed', color: 'var(--text-muted)'}}>Sold Out</span>
          </div>
        )}
      </Link>
      
      <div className="product-meta">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
