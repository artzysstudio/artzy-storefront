"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type GiftHamper = {
  id: string;
  name: string;
  occasion?: string;
  personalisation?: string;
  price?: number;
  sale_price?: number;
  cover_image?: string;
  images?: string[];
};

function imageUrl(path?: string): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `https://media.artzysstudio.in/${path.replace(/^\/+/, '')}`;
}

function HamperCard({ hamper, featured = false }: { hamper: GiftHamper; featured?: boolean }) {
  const image = imageUrl(hamper.cover_image || hamper.images?.[0]);
  const price = Number(hamper.sale_price || hamper.price || 0);

  return <article className={`home-gift-piece${featured ? ' home-gift-piece--featured' : ''}`}>
    {image && <Image src={image} alt={`${hamper.name} gift hamper presentation`} fill sizes={featured ? '(max-width: 760px) 88vw, 48vw' : '(max-width: 760px) 88vw, 24vw'} unoptimized />}
    <span className="home-gift-piece__shade" aria-hidden="true" />
    <span className="home-gift-piece__stock">{hamper.occasion || 'Made for meaningful moments'}</span>
    <span className="home-gift-piece__copy">
      <small>Gift hamper inspiration</small>
      <strong>{hamper.name}</strong>
      {hamper.personalisation && <span>{hamper.personalisation}</span>}
      {price > 0 && <b>From ₹{price.toLocaleString('en-IN')}</b>}
      <Link href="/gifts/#gift-finder">Create a hamper like this <i aria-hidden="true">→</i></Link>
    </span>
  </article>;
}

export default function HomeGiftHamper() {
  const [hampers, setHampers] = useState<GiftHamper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const loadHampers = async () => {
      try {
        const response = await fetch(`/api/storefront/gift-hampers?ts=${Date.now()}`, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Gift hamper refresh failed with ${response.status}`);
        const payload = await response.json();
        const records = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
        setHampers(records.filter((item: GiftHamper) => item?.id && item?.name && (item.cover_image || item.images?.[0])).slice(0, 3));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) console.warn('Gift hamper inspiration is temporarily unavailable.', error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadHampers();
    return () => controller.abort();
  }, []);

  return <section className="home-hamper" aria-labelledby="home-hamper-title">
    <div className="home-hamper__copy">
      <span>Gift hampers from the studio</span>
      <h2 id="home-hamper-title">A gift should feel<br/><em>chosen for them.</em></h2>
      <p>Start with a hamper presentation created by Deepti&apos;s studio, then make it personal for the recipient, occasion and budget. The studio confirms the contents, wrapping, message and delivery with you.</p>
      <div className="home-hamper__trust" aria-label="How Artzy gifting works">
        <span><b>01</b> Choose a hamper direction</span>
        <span><b>02</b> Tell us who it is for</span>
        <span><b>03</b> Personalise the wrap and message</span>
      </div>
      <div className="home-hamper__actions"><Link href="/gifts/#gift-finder">Help me build a hamper</Link><Link href="/gifts/">Explore all gifting</Link></div>
      <small className="home-hamper__note">Published studio hamper designs · Final contents, availability and presentation are confirmed before ordering.</small>
    </div>

    <div className={`home-hamper__gallery${hampers.length === 1 ? ' home-hamper__gallery--single' : ''}`} aria-live="polite" aria-busy={loading}>
      {loading && <div className="home-gift-loading" role="status"><span/><span/><span/><p>Bringing in the latest hamper designs…</p></div>}
      {!loading && hampers.length > 0 && <>
        {hampers.map((hamper, index) => <HamperCard key={hamper.id} hamper={hamper} featured={index === 0} />)}
        <div className="home-gift-gallery__seal"><b>✿</b><span>Designed and finished by Artzy&apos;s Studio</span></div>
      </>}
      {!loading && hampers.length === 0 && <div className="home-gift-unavailable" role="status"><b>Our hamper collection is being refreshed.</b><span>The Gift Finder is ready to shape a thoughtful hamper around the person, moment and budget.</span><Link href="/gifts/#gift-finder">Start with the recipient →</Link></div>}
    </div>
  </section>;
}
