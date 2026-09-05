import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Meet Deepti J. Shah & Artzy's Studio | Pune",
  description: "Meet visual artist Deepti J. Shah and discover the deaf-led Pune studio behind Artzy's hand-painted art, meaningful gifts and personal commissions.",
  alternates: { canonical: '/about/' },
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
