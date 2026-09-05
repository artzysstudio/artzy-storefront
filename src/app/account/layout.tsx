import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Your Artzy Account | Orders, Saved Art & Approvals",
  description: "Sign in securely to view Artzy's Studio orders, approvals, saved pieces and delivery updates.",
  robots: { index: false, follow: false },
  alternates: { canonical: '/account/' },
};

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
