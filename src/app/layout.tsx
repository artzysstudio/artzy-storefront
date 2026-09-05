import type { Metadata } from "next";
import "./globals.css";
import LaunchGate from "@/components/LaunchGate";
import ArtzyMuseFloater from "@/components/ArtzyMuseFloater";
import MediaProtection from "@/components/MediaProtection";

// Keep the public shell composed while the full, versioned stylesheet is fetched.
// Header component styles are emitted after its markup, so these few rules belong
// in <head> to prevent a cold-load flash of raw navigation and oversized SVGs.
const criticalShellCss = `
  *,*::before,*::after{box-sizing:border-box}
  html,body{margin:0;min-height:100%;background:#fdfbf7;color:#4a4036}
  body{font-family:"DM Sans",Inter,"Segoe UI",Arial,sans-serif;line-height:1.6}
  img,svg{max-width:100%}
  .store-announcement{min-height:33px;display:flex;align-items:center;justify-content:center;gap:9px;padding:7px 16px;background:#f3eee7;border-bottom:1px solid #e4d8ce;color:#4b3a32;font-size:.7rem;letter-spacing:.06em;text-align:center;text-transform:uppercase}
  .store-announcement em{color:#b25156}
  .store-header{position:sticky;top:0;z-index:1000;background:#fffcf8;border-bottom:1px solid #eadfd6}
  .store-header__inner{width:min(1500px,100%);height:92px;margin:auto;padding:0 clamp(16px,3vw,44px);display:grid;grid-template-columns:166px 1fr auto;align-items:center;gap:18px}
  .store-brand{width:max-content;display:grid;justify-items:center;color:#a74d52;text-decoration:none}
  .store-brand img{display:block;width:78px;height:72px;object-fit:contain}
  .store-brand span{margin-top:-4px;font-size:.56rem;letter-spacing:.16em;text-transform:uppercase}
  .desktop-nav{height:100%;display:flex;align-items:stretch;justify-content:center}
  .desktop-nav__group{display:flex;align-items:stretch}
  .desktop-nav__group>button,.desktop-nav__direct{display:flex;align-items:center;padding:0 10px;border:0;background:transparent;color:#3d302a;font:600 .69rem "DM Sans",Inter,"Segoe UI",Arial,sans-serif;letter-spacing:.045em;text-decoration:none;text-transform:uppercase;white-space:nowrap}
  .store-utilities{display:flex;align-items:center;justify-content:flex-end;gap:7px}
  .ask-studio{display:flex;align-items:center;gap:7px;min-height:40px;padding:8px 14px;border-radius:99px;background:#b25156;color:#fff;font-size:.7rem;font-weight:700;text-decoration:none;white-space:nowrap}
  .utility-icon,.menu-toggle{width:40px;height:40px;display:grid;place-items:center;padding:0;border:1px solid transparent;border-radius:50%;background:transparent;color:#3f322c}
  .utility-icon svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.5}
  .menu-toggle{display:none}
  .mobile-navigation{position:fixed;inset:0;visibility:hidden;pointer-events:none}
  .muse-floater{position:fixed;right:18px;bottom:18px;z-index:1250;display:flex;align-items:center;gap:9px;min-height:58px;padding:5px 15px 5px 5px;border:1px solid #e2d1c6;border-radius:999px;background:#fffaf5;color:#493731}
  .muse-floater-mark{flex:0 0 48px;width:48px;height:48px;display:grid;place-items:center;border-radius:50%;background:#b45157;color:#fffaf4;overflow:hidden}
  .muse-floater-mark svg{display:block;width:34px;height:34px}
  .muse-floater-copy{display:grid;text-align:left;line-height:1.05}
  .muse-guide-shell:not(.open){display:none}
  @media(max-width:900px){.store-announcement{font-size:.58rem}.store-header__inner{height:76px;grid-template-columns:1fr auto;padding-inline:14px}.store-brand{justify-items:start}.store-brand img{width:67px;height:56px}.store-brand span{font-size:.49rem}.desktop-nav,.desktop-account{display:none}.menu-toggle{display:block}.store-utilities{gap:3px}.utility-icon,.menu-toggle{width:44px;height:44px}.muse-floater{right:12px;bottom:12px;width:54px;min-width:54px;height:54px;min-height:54px;padding:3px;border-radius:50%}.muse-floater-copy{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}}
  @media(max-width:430px){.store-announcement em,.store-announcement span{display:none}.ask-studio{padding:7px 10px}}
`;

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
      <head>
        <style id="artzy-critical-shell" dangerouslySetInnerHTML={{ __html: criticalShellCss }} />
      </head>
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
