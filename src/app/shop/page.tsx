import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopClient from './ShopClient';
import { api, isStorefrontInventoryProduct, normalizeStorefrontProduct, type Product } from '@/lib/api';
import erpProducts from '@/data/erp-products.json';
import { productPath } from '@/lib/product-routing';
import Link from 'next/link';

export const metadata = {
  title: 'Shop Art & Gifts | Artzy\'s Studio',
  description: 'Explore the full portfolio of Deepti J. Shah\'s original paintings, resin art, and bespoke gifts.',
  alternates: { canonical: '/shop/' },
};

export default async function ShopPage() {
  const products = await api.products.list();
  const legacyProductRoutes = (erpProducts as Product[])
    .map(normalizeStorefrontProduct)
    .filter(isStorefrontInventoryProduct)
    .map((product) => ({ id: String(product.id), path: productPath(product) }));

  return (
    <>
      <Header />
      <main className="shop-page" style={{ minHeight: '80vh' }}>
        <section className="shop-intro"><span>Available from the studio</span><h1>Handmade art,<br/><em>ready to discover.</em></h1><p>Browse only real products published by Artzy’s Studio. Filter by category, price, room and occasion, then open any piece for stock, dimensions and delivery information.</p><div><a href="#shop-products">Browse products</a><Link href="/personalised">Need something custom?</Link></div></section>
        <div id="shop-products" className="shop-anchor"/>
        <ShopClient initialProducts={products} legacyProductRoutes={legacyProductRoutes} />
      </main>
      <Footer />
    </>
  );
}
