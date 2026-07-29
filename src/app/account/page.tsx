"use client";

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCustomer } from '@/context/CustomerContext';

export default function AccountPage() {
  const { isAuthenticated, user, isAuthLoading, login, signup, logout, wishlist, recentlyViewed, savedCollections } = useCustomer();
  const [activeTab, setActiveTab] = useState<'profile' | 'wishlist' | 'collections' | 'orders'>('profile');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setAuthError('');
    setAuthMessage('');
    try {
      if (authMode === 'signup') {
        const result = await signup(name, email, password);
        if (result.emailConfirmationRequired) {
          setAuthMessage('Account created. Please confirm the email sent to you, then sign in.');
          setAuthMode('login');
        }
      } else {
        await login(email, password);
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>Checking your account…</main>;
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
          <div style={{ background: 'var(--bg-color)', padding: 'var(--spacing-xl)', textAlign: 'center', maxWidth: '400px', width: '100%', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>{authMode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-lg)' }}>
              {authMode === 'login' ? 'Sign in to view your bespoke orders, wishlist, and saved collections.' : 'Save delivery details and keep every Artzy order together.'}
            </p>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {authMode === 'signup' && (
                <input required value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder="Full Name" style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)' }} />
              )}
              <input required value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email Address" autoComplete="email" style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)' }} />
              <input required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password (8+ characters)" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)' }} />
              {authError && <p role="alert" style={{ color: '#a21d1d', margin: 0 }}>{authError}</p>}
              {authMessage && <p role="status" style={{ color: '#176b45', margin: 0 }}>{authMessage}</p>}
              <button className="btn btn-solid" type="submit" disabled={submitting}>
                {submitting ? 'Please wait…' : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {authMode === 'login' ? "Don't have an account? " : 'Already registered? '}
              <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }} style={{ background: 'none', border: 0, padding: 0, color: 'var(--text-main)', textDecoration: 'underline', cursor: 'pointer' }}>
                {authMode === 'login' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container" style={{ minHeight: '80vh', paddingTop: 'var(--spacing-xl)', display: 'grid', gridTemplateColumns: '250px 1fr', gap: 'var(--spacing-xl)' }}>
        <aside style={{ borderRight: '1px solid rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '2rem' }}>My Account</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>
              <button onClick={() => setActiveTab('profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'profile' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: activeTab === 'profile' ? 'bold' : 'normal' }}>
                Profile & Settings
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'orders' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: activeTab === 'orders' ? 'bold' : 'normal' }}>
                Order History
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('wishlist')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'wishlist' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: activeTab === 'wishlist' ? 'bold' : 'normal' }}>
                Wishlist ({wishlist.length})
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('collections')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'collections' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: activeTab === 'collections' ? 'bold' : 'normal' }}>
                Saved Collections ({savedCollections.length})
              </button>
            </li>
          </ul>
          <button onClick={logout} style={{ marginTop: '3rem', background: 'none', border: 'none', color: 'var(--accent-terracotta)', cursor: 'pointer' }}>
            Sign Out
          </button>
        </aside>

        <section>
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ marginBottom: '1rem' }}>Profile</h2>
              <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name || user?.email}. Here you can manage your shipping addresses and preferences.</p>
              
              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Recently Viewed</h4>
                {recentlyViewed.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>You haven't viewed any items yet.</p>
                ) : (
                  <p>You have {recentlyViewed.length} items in your browsing history.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 style={{ marginBottom: '1rem' }}>Order History</h2>
              <div style={{ padding: '2rem', background: 'var(--bg-secondary)', textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
                <p>You haven't placed any orders yet.</p>
                <button className="btn btn-solid" style={{ marginTop: '1rem' }} onClick={() => window.location.href = '/shop'}>Explore Collections</button>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h2 style={{ marginBottom: '1rem' }}>Your Wishlist</h2>
              {wishlist.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Your wishlist is empty.</p>
              ) : (
                <div className="product-grid">
                  {/* We would map through full product objects here after fetching them by ID */}
                  {wishlist.map(id => (
                    <div key={id} style={{ padding: '1rem', border: '1px solid rgba(0,0,0,0.05)' }}>Product ID: {id}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'collections' && (
            <div>
              <h2 style={{ marginBottom: '1rem' }}>Saved Collections</h2>
              {savedCollections.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>You haven't created any collections.</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {savedCollections.map(c => (
                    <div key={c.id} style={{ padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                      <h4 style={{ margin: 0 }}>{c.name}</h4>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{c.productIds.length} items</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
