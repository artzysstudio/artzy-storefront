import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";


const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ['300', '400', '500'],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Artzy's Studio | Premium Handcrafted Art & Gifting",
  description: "Authentic resin art, original paintings, and curated bespoke corporate gifting by Deepti J. Shah. Elevate your space with our contemporary handcrafted collections.",
  keywords: ["resin art", "original paintings", "corporate gifting", "handcrafted home decor", "Deepti J. Shah", "custom artwork"],
  openGraph: {
    title: "Artzy's Studio | Premium Handcrafted Art & Gifting",
    description: "Authentic resin art, original paintings, and curated bespoke corporate gifting by Deepti J. Shah.",
    url: "https://www.artzysstudio.in",
    siteName: "Artzy's Studio",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { CartProvider } from "@/context/CartContext";
import { CustomerProvider } from "@/context/CustomerContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <CustomerProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CustomerProvider>
      </body>
    </html>
  );
}
