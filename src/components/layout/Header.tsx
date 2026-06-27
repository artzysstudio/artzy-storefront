"use client";

import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '@/context/CartContext';

const SmartSearch = dynamic(() => import('@/components/search/SmartSearch'), {
  ssr: false, // It relies on a heavy overlay and window, so we can avoid SSR
});

export default function Header() {
  const { cartCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className="announcement">
        Complimentary shipping on orders above ₹1,499 &nbsp;|&nbsp; <em>Where intention meets canvas</em>
      </div>
      <header className="header container">
        <div className="header-left">
          <Link href="/shop">Artworks</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/inspiration">Inspiration</Link>
          <Link href="/personalized">Commissions</Link>
        </div>
        
        <Link href="/" className="header-logo">
          <h1>Artzy's Studio</h1>
          <span>By Deepti J. Shah</span>
        </Link>
        
        <div className="header-right">
          <button className="header-icon" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <Link href="/account" className="header-icon" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
          <Link href="/checkout" className="header-icon" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </header>
      
      <SmartSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
