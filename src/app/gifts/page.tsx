import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopClient from '@/app/shop/ShopClient';
import { api } from '@/lib/api';

export const metadata = { title: "Personalised & Occasion Gifts | Artzy's Studio", description: 'Artist-made wedding, celebration, corporate and personalised gifts from Artzy’s Studio.' };

export default async function GiftsPage() {
  const products = await api.products.list();
  return <><Header/><main className="gifts-page">
    <section className="gifts-hero"><div className="gifts-hero-copy"><span className="service-eyebrow">Gifts with a personal story</span><h1>Made for the moment.<br/><em>Remembered long after.</em></h1><p>Artist-made gifts for weddings, anniversaries, birthdays, housewarmings, festivals and meaningful milestones—thoughtfully personalised by Deepti&apos;s studio.</p><div className="service-actions"><a className="service-primary" href="#gift-products">Shop gift collection</a><Link className="service-secondary" href="/custom-corporate">Plan a custom gift</Link></div></div><div className="gifts-hero-art" aria-label="A curated selection of artistic gifts"><span className="gift-box gift-one">✿</span><span className="gift-box gift-two">For you</span><span className="gift-frame">Together</span><i>Hand finished in Pune</i></div></section>
    <section className="occasion-strip" aria-label="Gift occasions"><span>Weddings</span><span>Anniversaries</span><span>Birthdays</span><span>Housewarmings</span><span>Festivals</span><span>Corporate milestones</span></section>
    <section className="gift-intro"><span className="service-eyebrow">Shop from the ERP collection</span><h2>Gifts currently selected by the studio.</h2><p>Only products assigned to a gift category in Artzy&apos;s ERP appear below. New gift products will be added automatically when the studio publishes them.</p></section>
    <div id="gift-products"><ShopClient initialProducts={products} categoryScope={['gift']} /></div>
    <section className="gift-custom-cta" id="corporate-gifts"><div><span className="service-eyebrow">Need quantities or personalisation?</span><h2>Wedding sets, event gifting and corporate collections.</h2></div><div><p>Tell us the occasion, quantity, budget, preferred colours and delivery date. The studio will recommend a practical, artistic direction.</p><Link className="service-primary" href="/custom-corporate">Explore custom &amp; corporate gifting</Link></div></section>
  </main><Footer/></>;
}
