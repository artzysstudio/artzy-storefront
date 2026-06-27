"use client";

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCustomer } from '@/context/CustomerContext';

export default function AccountPage() {
  const { isAuthenticated, login, logout, wishlist, recentlyViewed, savedCollections } = useCustomer();
  const [activeTab, setActiveTab] = useState<'profile' | 'wishlist' | 'collections' | 'orders'>('profile');

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
          <div style={{ background: 'var(--bg-color)', padding: 'var(--spacing-xl)', textAlign: 'center', maxWidth: '400px', width: '100%', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-lg)' }}>Sign in to view your bespoke orders, wishlist, and saved collections.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="email" placeholder="Email Address" style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)' }} />
              <input type="password" placeholder="Password" style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)' }} />
              <button className="btn btn-solid" onClick={login}>Sign In</button>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Don't have an account? <span style={{ color: 'var(--text-main)', textDecoration: 'underline', cursor: 'pointer' }}>Create one</span>
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
              <p style={{ color: 'var(--text-muted)' }}>Welcome back. Here you can manage your shipping addresses and preferences.</p>
              
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
