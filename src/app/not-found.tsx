import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', color: 'var(--accent-terracotta)' }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px' }}>
          We couldn't find the page you were looking for. It may have been moved or removed.
        </p>
        <Link href="/" className="btn btn-solid">Return Home</Link>
      </main>
      <Footer />
    </>
  );
}
