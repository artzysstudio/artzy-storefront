import type { Metadata } from 'next';

export { default } from '../personalised/page';

export const metadata: Metadata = {
  title: "Personalised Art & Gifts | Artzy's Studio",
  description: "Caricatures, digital art, custom paintings and occasion gifts created personally at Artzy's Studio in Pune.",
  alternates: { canonical: '/personalised/' },
  robots: { index: false, follow: true },
};
