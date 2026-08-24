import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';
import { api } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Secure Checkout | Artzy\'s Studio',
  description: 'Complete your purchase securely.',
  robots: 'noindex, nofollow'
};

export default async function CheckoutPage() {
  const products = await api.products.list();
  return (
    <main className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', minHeight: '80vh' }}>
      <CheckoutClient initialProducts={products} />
    </main>
  );
}
