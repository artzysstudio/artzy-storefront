"use client";

import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // We would log to an external service here (e.g. Sentry or custom Analytics)
    console.error('[Global Error Boundary]', error);
  }, [error]);

  return (
    <>
      <Header />
      <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Something went wrong!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px' }}>
          We apologize for the inconvenience. Our team has been notified. 
          Please try again or return to the homepage.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-solid" onClick={() => reset()}>Try Again</button>
          <Link href="/" className="btn">Return Home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
