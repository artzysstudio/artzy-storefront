"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ARTZY-0000';

  return (
    <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--text-primary)', color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      
      <h1 style={{ marginBottom: '1rem' }}>Thank You For Your Order</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Your payment was successful and your order is now being processed. We will send you an email confirmation shortly.
      </p>
      
      <div style={{ padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Order Reference</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{orderId}</div>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
        <Link href={`/account/orders/${orderId}`} className="btn" style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
          Track Order
        </Link>
        <Link href="/shop" className="btn">
          Continue Shopping
        </Link>
      </div>

      {searchParams.get('guest') === 'true' && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '1rem' }}>Save your details for next time</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Create an account to track this order and speed up future checkouts.</p>
          <form style={{ display: 'flex', gap: '1rem' }} onSubmit={(e) => { e.preventDefault(); alert('Mock registration successful!'); }}>
            <input required type="password" autoComplete="new-password" placeholder="Choose a password" style={{ flex: 1, padding: '0.8rem' }} />
            <button type="submit" className="btn">Create Account</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', minHeight: '80vh' }}>
      <Suspense fallback={<div style={{ textAlign: 'center' }}>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
