import type { Metadata } from "next";
import "./globals.css";
import LaunchGate from "@/components/LaunchGate";
import ArtzyMuseFloater from "@/components/ArtzyMuseFloater";
import MediaProtection from "@/components/MediaProtection";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.artzysstudio.in';
const isIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE !== 'false';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Artzy's Studio | Premium Handcrafted Art & Gifting",
  description: "Authentic resin art, original paintings, and curated bespoke corporate gifting by Deepti J. Shah. Elevate your space with our contemporary handcrafted collections.",
  keywords: ["resin art", "original paintings", "corporate gifting", "handcrafted home decor", "Deepti J. Shah", "custom artwork"],
  openGraph: {
    title: "Artzy's Studio | Premium Handcrafted Art & Gifting",
    description: "Authentic resin art, original paintings, and curated bespoke corporate gifting by Deepti J. Shah.",
    url: siteUrl,
    siteName: "Artzy's Studio",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: '/images/artzy-social-share-square.png',
        width: 1200,
        height: 1200,
        alt: "Artzy's Studio — art created with heart",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Artzy's Studio | Premium Handcrafted Art & Gifting",
    description: "Authentic art, original paintings and meaningful gifts created by Deepti J. Shah and her artist team.",
    images: ['/images/artzy-social-share-square.png'],
  },
  robots: {
    index: isIndexable,
    follow: isIndexable,
  },
};

import { CartProvider } from "@/context/CartContext";
import { CustomerProvider } from "@/context/CustomerContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': ['Organization', 'LocalBusiness'],
          name: "Artzy's Studio",
          founder: { '@type': 'Person', name: 'Deepti J. Shah' },
          url: siteUrl,
          email: 'artzysstudio@gmail.com',
          telephone: '+91 91586 80722',
          address: { '@type': 'PostalAddress', streetAddress: 'Prashant Society, Preetishilp Bldg, Ground Floor, Lane #3, Plot #22, Paud Road, Kothrud', addressLocality: 'Pune', addressRegion: 'Maharashtra', postalCode: '411038', addressCountry: 'IN' },
          sameAs: ['https://www.instagram.com/artzysstudio/', 'https://www.facebook.com/artzysstudio', 'https://www.youtube.com/@ArtzysStudio']
        }) }} />
        <CustomerProvider>
          <CartProvider>
            <LaunchGate>
              {children}
              <MediaProtection />
              <ArtzyMuseFloater />
            </LaunchGate>
          </CartProvider>
        </CustomerProvider>
      </body>
    </html>
  );
}
