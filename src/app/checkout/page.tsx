import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Secure Checkout | Artzy\'s Studio',
  description: 'Complete your purchase securely.',
  robots: 'noindex, nofollow'
};

export default function CheckoutPage() {
  return (
    <main className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', minHeight: '80vh' }}>
      <CheckoutClient />
    </main>
  );
}
