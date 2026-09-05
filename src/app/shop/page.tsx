import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopClient from './ShopClient';
import { api } from '@/lib/api';
import Link from 'next/link';

export const metadata = {
  title: 'Shop Art & Gifts | Artzy\'s Studio',
  description: 'Explore the full portfolio of Deepti J. Shah\'s original paintings, resin art, and bespoke gifts.',
  alternates: { canonical: '/shop/' },
};

export default async function ShopPage() {
  const products = await api.products.list();

  return (
    <>
      <Header />
      <main className="shop-page" style={{ minHeight: '80vh' }}>
        <section className="shop-intro"><span>Available from the studio</span><h1>Handmade art,<br/><em>ready to discover.</em></h1><p>Browse only real products supplied by Artzy’s Studio ERP. Filter by category, price, room and occasion, then open any piece for stock, dimensions and delivery information.</p><div><a href="#shop-products">Browse products</a><Link href="/personalised">Need something custom?</Link></div></section>
        <div id="shop-products" className="shop-anchor"/>
        <ShopClient initialProducts={products} />
      </main>
      <Footer />
    </>
  );
}
