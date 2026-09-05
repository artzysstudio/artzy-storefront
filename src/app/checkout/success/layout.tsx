import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Order Confirmation | Artzy's Studio",
  description: "Your Artzy's Studio order confirmation and next steps.",
  robots: { index: false, follow: false },
  alternates: { canonical: '/checkout/success/' },
};

export default function CheckoutSuccessLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
