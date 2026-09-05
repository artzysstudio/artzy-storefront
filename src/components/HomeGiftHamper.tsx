"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { isStorefrontInventoryProduct, normalizeStorefrontProduct, type Product } from '@/lib/api';

const giftWords = /gift|hamper|keepsake|jewel|wedding|anniversary|housewarming|festive|celebration/i;
const giftFriendlyCategories = /customized gifts|tea coaster|art on table|wooden spoon stand|agarbatti|wall d[eé]cor/i;

function giftPriority(product: Product): number {
  const identity = `${product.name} ${product.category}`;
  const context = `${identity} ${product.artworkStory || ''} ${product.seo?.description || ''}`;
  let score = 0;

  if (/hamper/i.test(identity)) score += 120;
  if (/customized gifts/i.test(product.category)) score += 90;
  if (product.giftEligible) score += 50;
  if (giftWords.test(context)) score += 25;
  if (giftFriendlyCategories.test(product.category)) score += 15;
  score += Math.min(Number(product.giftPopularityScore) || 0, 10);
  return score;
}

function chooseGiftPieces(records: Product[]): Product[] {
  return records
    .map(normalizeStorefrontProduct)
    .filter(isStorefrontInventoryProduct)
    .filter((product) => giftPriority(product) > 0)
    .sort((left, right) => giftPriority(right) - giftPriority(left))
    .slice(0, 3);
}

function GiftPiece({ product, featured = false }: { product: Product; featured?: boolean }) {
  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  return <Link
    className={`home-gift-piece${featured ? ' home-gift-piece--featured' : ''}`}
    href={`/shop/?product=${encodeURIComponent(product.id)}`}
    aria-label={`View ${product.name}`}
  >
    <Image src={product.images[0]} alt={product.name} fill sizes={featured ? '(max-width: 760px) 82vw, 35vw' : '(max-width: 760px) 68vw, 20vw'} unoptimized />
    <span className="home-gift-piece__shade" aria-hidden="true" />
    <span className="home-gift-piece__stock">{Number(product.quantity) === 1 ? 'One in the studio' : `${product.quantity} available`}</span>
    <span className="home-gift-piece__copy">
      <small>{product.category}</small>
      <strong>{product.name}</strong>
      <b>₹{price.toLocaleString('en-IN')} <i aria-hidden="true">→</i></b>
    </span>
  </Link>;
}

export default function HomeGiftHamper() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const loadGifts = async () => {
      try {
        const response = await fetch(`/api/storefront/products?home=gifts&ts=${Date.now()}`, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Gift catalogue sync failed with ${response.status}`);
        const payload = await response.json();
        const records = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.products) ? payload.products : [];
        setProducts(chooseGiftPieces(records));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) console.warn('Live gift selection is temporarily unavailable.', error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadGifts();
    return () => controller.abort();
  }, []);

  const hasPublishedHamper = useMemo(() => products.some((product) => /hamper/i.test(`${product.name} ${product.category}`)), [products]);

  return <section className="home-hamper" aria-labelledby="home-hamper-title">
    <div className="home-hamper__copy">
      <span>Gifting, first</span>
      <h2 id="home-hamper-title">A gift should feel<br/><em>chosen for them.</em></h2>
      <p>Begin with real pieces available from Deepti&apos;s studio. Choose one you love, or let the Gift Finder compose a personal hamper around the recipient, occasion and budget.</p>
      <div className="home-hamper__trust" aria-label="How Artzy gifting works">
        <span><b>01</b> Tell us who it is for</span>
        <span><b>02</b> Choose real studio pieces</span>
        <span><b>03</b> Confirm wrapping and message</span>
      </div>
      <div className="home-hamper__actions"><Link href="/gifts/#gift-finder">Help me choose a gift</Link><Link href="/gifts/">Explore gifts &amp; hampers</Link></div>
      <small className="home-hamper__note">Live ERP availability · Hamper contents and presentation are confirmed by the studio.</small>
    </div>

    <div className="home-hamper__gallery" aria-live="polite" aria-busy={loading}>
      {loading && <div className="home-gift-loading" role="status"><span/><span/><span/><p>Finding today&apos;s gift-worthy studio pieces…</p></div>}
      {!loading && products.length > 0 && <>
        {products.map((product, index) => <GiftPiece key={product.id} product={product} featured={index === 0} />)}
        <div className="home-gift-gallery__seal"><b>✿</b><span>{hasPublishedHamper ? 'Real hampers and gift pieces from ERP' : 'Real pieces, composed into your hamper'}</span></div>
      </>}
      {!loading && products.length === 0 && <div className="home-gift-unavailable" role="status"><b>Today&apos;s gift selection is being refreshed.</b><span>The Gift Finder is still ready to help, and the studio will confirm every available piece before ordering.</span><Link href="/gifts/#gift-finder">Start with the recipient →</Link></div>}
    </div>
  </section>;
}
