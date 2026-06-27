import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopClient from './ShopClient';
import { api } from '@/lib/api';

export const metadata = {
  title: 'Shop Art & Gifts | Artzy\'s Studio',
  description: 'Explore the full portfolio of Deepti J. Shah\'s original paintings, resin art, and bespoke gifts.',
};

export default async function ShopPage() {
  const products = await api.products.list();

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--spacing-xl)', minHeight: '80vh' }}>
        <div className="container" style={{ marginBottom: 'var(--spacing-md)' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '0.5rem' }}>Portfolio &amp; Gifts</h1>
          <p style={{ color: 'var(--text-muted)' }}>Discover pieces tailored to your space and occasion.</p>
        </div>
        <ShopClient initialProducts={products} />
      </main>
      <Footer />
    </>
  );
}
