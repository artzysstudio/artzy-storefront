import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Visit & Contact Artzy's Studio | Kothrud, Pune",
  description: "Visit Artzy's Studio in Kothrud, Pune, or contact Deepti's team about original art, personalised gifts, corporate gifting and custom commissions.",
  alternates: { canonical: '/contact/' },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
