"use client";

import React, { useState, useEffect } from 'react';
import { SectionContent, Product } from '@/lib/api';
import { getAllProducts } from '@/actions/products';
import ProductCard from '@/components/ProductCard';
import { useAnalytics } from '@/hooks/useAnalytics';

type MuseState = 'home' | 'gift-finder-q1' | 'gift-finder-q2' | 'gift-finder-q3' | 'gift-finder-results';

export default function ArtzyMuse({ content }: { content?: SectionContent }) {
  const { trackGiftFinderComplete } = useAnalytics();
  const [activeView, setActiveView] = useState<MuseState>('home');
  const [products, setProducts] = useState<Product[]>([]);
  
  // Gift Finder State
  const [giftOccasion, setGiftOccasion] = useState('');
  const [giftStyle, setGiftStyle] = useState('');

  useEffect(() => {
    // Pre-load catalog for the wizard
    getAllProducts().then(setProducts);
  }, []);

  const resetMuse = () => {
    setActiveView('home');
    setGiftOccasion('');
    setGiftStyle('');
  };

  const getGiftRecommendations = () => {
    return products.filter(p => {
      if (giftOccasion && (!p.occasion || !p.occasion.includes(giftOccasion))) return false;
      if (giftStyle && (!p.style || !p.style.includes(giftStyle))) return false;
      return true;
    }).slice(0, 3); // Top 3 recommendations
  };

  return (
    <div className="artzy-muse-container" style={{ background: 'var(--bg-secondary)', padding: 'var(--spacing-lg)', borderRadius: '8px' }}>
      
      {activeView === 'home' && (
        <>
          <div className="artzy-muse-header" style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h4>{content?.subtitle || "Artzy Muse AI"}</h4>
            <h2>{content?.title || "Your personal guide"}</h2>
            <p>{content?.body || "Discover bespoke gifting and custom artwork tailored to you."}</p>
          </div>
          
          <div className="artzy-muse-options" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <button className="btn btn-solid" onClick={() => setActiveView('gift-finder-q1')}>Gift Finder</button>
            <button className="btn">Artwork Finder</button>
            <button className="btn">Room Décor Suggestions</button>
            <button className="btn">Corporate Advisor</button>
          </div>
          
          <div style={{ maxWidth: '600px', margin: '0 auto', aspectRatio: '16/9', position: 'relative' }}>
            <img src="/concepts/muse-samples/abstract-landscape.jpg" alt="Artzy Muse AI concept sample — not stock" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', left: '12px', bottom: '12px', padding: '7px 10px', borderRadius: '999px', background: 'rgba(75,42,38,.9)', color: '#fff', fontSize: '.72rem', fontWeight: 700 }}>AI concept sample · not stock</span>
          </div>
        </>
      )}

      {activeView === 'gift-finder-q1' && (
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <button onClick={resetMuse} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem' }}>← Back</button>
          <h2>What is the occasion?</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            {['Wedding', 'Anniversary', 'Housewarming', 'Corporate', 'Diwali'].map(occ => (
              <button key={occ} className="btn" onClick={() => { setGiftOccasion(occ); setActiveView('gift-finder-q2'); }}>
                {occ}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeView === 'gift-finder-q2' && (
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <button onClick={() => setActiveView('gift-finder-q1')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem' }}>← Back</button>
          <h2>What aesthetic do they appreciate?</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            {['Contemporary', 'Abstract', 'Minimalist', 'Fluid Art', 'Elegant'].map(style => (
              <button key={style} className="btn" onClick={() => { 
                setGiftStyle(style); 
                trackGiftFinderComplete(giftOccasion, style);
                setActiveView('gift-finder-results'); 
              }}>
                {style}
              </button>
            ))}
            <button className="btn" onClick={() => { 
              setGiftStyle(''); 
              trackGiftFinderComplete(giftOccasion, 'Not Sure');
              setActiveView('gift-finder-results'); 
            }}>I'm not sure</button>
          </div>
        </div>
      )}

      {activeView === 'gift-finder-results' && (
        <div style={{ textAlign: 'center' }}>
          <button onClick={resetMuse} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem' }}>Start Over</button>
          <h2 style={{ marginBottom: '1rem' }}>I've curated these pieces for you</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Based on a {giftOccasion} occasion with a {giftStyle || 'versatile'} aesthetic.</p>
          
          {getGiftRecommendations().length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
              {getGiftRecommendations().map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem', background: 'var(--bg-color)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <p>I couldn't find an exact match, but you might love exploring our full gifting portfolio.</p>
              <button className="btn btn-solid" style={{ marginTop: '1rem' }} onClick={() => window.location.href = '/shop'}>View All Gifts</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
