import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GiftBuilder from '@/features/gifts/GiftBuilder';
import { api, isStorefrontInventoryProduct } from '@/lib/api';

export const metadata = {
  title: "Gift Concierge | Personalised, Occasion & Corporate Gifts | Artzy's Studio",
  description: "Build an artistic gift plan for weddings, birthdays, housewarmings, festivals, employees and clients using real Artzy's Studio inventory.",
};

export default async function GiftsPage() {
  const products = (await api.products.list()).filter(isStorefrontInventoryProduct);
  return <><Header/><main className="gift-concierge-page">
    <section className="gift-concierge-hero">
      <div className="gift-concierge-hero__copy"><span>Handmade in Pune · chosen for one person</span><h1>Gift with intention.<br/><em>Give something Artzy.</em></h1><p>From a single birthday surprise to a hundred employee gifts, begin with the person—not a crowded product grid.</p><div><a href="#gift-concierge">Build my gift plan</a><Link href="/shop">Browse all studio pieces</Link></div></div>
      <div className="gift-concierge-hero__art" aria-label="Artist-made gifts wrapped at Artzy's Studio"><div className="gift-ribbon">✿</div><div className="gift-card-one"><small>For the story</small><b>they will remember</b></div><div className="gift-card-two"><span>Made by hand</span><strong>Wrapped with care</strong></div><i>By Deepti J. Shah &amp; her artist team</i></div>
    </section>
    <div className="gift-trust-strip"><span><b>Real stock first</b> ERP-validated products</span><span><b>Clear budgets</b> Full price breakdown</span><span><b>Human confirmation</b> For custom work &amp; timelines</span></div>
    <GiftBuilder products={products}/>
    <section className="gift-seo-links"><div><span>Explore by moment</span><h2>Every reason to make someone feel seen.</h2></div><div>{['Wedding gifts','Birthday gifts','Housewarming gifts','Festival gifts','Employee gifts','Client gifts','Return gifts','Anniversary gifts'].map((label) => <a href="#gift-concierge" key={label}>{label}<span>→</span></a>)}</div></section>
    <section className="gift-studio-cta"><div><span>Can’t find the exact fit?</span><h2>A custom gift begins with a conversation.</h2></div><p>Share a photograph, story, palette, company brief or quantity. Deepti&apos;s studio will confirm what can be made, the exact cost and a realistic delivery date.<br/><Link href="/custom-corporate">Discuss a custom or corporate gift →</Link></p></section>
  </main><Footer/></>;
}
