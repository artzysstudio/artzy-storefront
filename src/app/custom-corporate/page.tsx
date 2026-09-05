import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Corporate Gifting & Commercial Art | Artzy's Studio",
  alternates: { canonical: '/for-business/' },
  robots: { index: false, follow: true },
};

export default function CustomCorporatePage() {
  redirect('/for-business/');
}
