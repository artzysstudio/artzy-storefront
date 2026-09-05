import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopClient from '@/app/shop/ShopClient';
import { api } from '@/lib/api';
import Link from 'next/link';

export const metadata = {
  title: "Available Original Art | Artzy's Studio",
  description: 'Available wall art and frames created by Deepti J. Shah and the Artzy Studio team in Pune.',
  alternates: { canonical: '/original-art/' },
};

export default async function OriginalArtPage() {
  const products = await api.products.list();
  return <>
    <Header />
    <main className="shop-page">
      <section className="shop-intro">
        <span>Original art · Available from the studio</span>
        <h1>Art with a hand,<br/><em>heart and history.</em></h1>
        <p>Browse only the wall art and frames currently supplied by the Artzy ERP. Open a piece to check its SKU, availability and the details recorded by the studio.</p>
        <div><a href="#shop-products">View available art</a><Link href="/personalised/#custom-artwork">Commission an artwork</Link></div>
      </section>
      <ShopClient initialProducts={products} categoryScope={['Wall Art & Frames']} />
    </main>
    <Footer />
  </>;
}
