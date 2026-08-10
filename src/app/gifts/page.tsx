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
    <section className="gift-concierge-hero gift-concierge-hero--illustrated">
      <img className="gift-packages-hero__image" src="/images/gift-packages-hero.webp" alt="Artzy-style hand-painted gift boxes, fabric-wrapped packages, a decorative tray, flowers and message cards for Indian celebrations"/>
      <div className="gift-packages-hero__shade" aria-hidden="true"/>
      <div className="gift-concierge-hero__copy"><span>Handmade in Pune · chosen for someone special</span><h1>A gift should say,<br/><em>“I saw you.”</em></h1><p>Choose a hand-painted piece that carries warmth, colour and the unmistakable touch of Deepti&apos;s studio—from one heartfelt surprise to a beautifully planned celebration.</p><div><a href="#gift-quick-start">Help me choose a gift</a><Link href="/shop">Browse all studio pieces</Link></div><small>Artzy-style illustration · Gifts matched from current ERP stock</small></div>
      <a className="gift-packages-hero__peek" href="#gift-quick-start">Find their perfect gift <span aria-hidden="true">↓</span></a>
    </section>
    <div className="gift-trust-strip"><span><b>Real stock first</b> ERP-validated products</span><span><b>Clear budgets</b> Full price breakdown</span><span><b>Human confirmation</b> For custom work &amp; timelines</span></div>
    <GiftBuilder products={products}/>
    <section className="gift-seo-links"><div><span>Explore by moment</span><h2>Every reason to make someone feel seen.</h2></div><div>{['Wedding gifts','Birthday gifts','Housewarming gifts','Festival gifts','Employee gifts','Client gifts','Return gifts','Anniversary gifts'].map((label) => <a href="#gift-concierge" key={label}>{label}<span>→</span></a>)}</div></section>
    <section className="gift-studio-cta"><div><span>Can’t find the exact fit?</span><h2>A custom gift begins with a conversation.</h2></div><p>Share a photograph, story, palette, company brief or quantity. Deepti&apos;s studio will confirm what can be made, the exact cost and a realistic delivery date.<br/><Link href="/custom-corporate">Discuss a custom or corporate gift →</Link></p></section>
  </main><Footer/></>;
}
