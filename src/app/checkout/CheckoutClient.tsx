"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { api, Product } from '@/lib/api';
import { useRouter } from 'next/navigation';

type CheckoutStep = 'auth' | 'address' | 'gifting' | 'shipping' | 'payment';

export default function CheckoutClient() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  
  const [step, setStep] = useState<CheckoutStep>('auth');
  const [cartProducts, setCartProducts] = useState<(Product & { quantity: number })[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Auth State
  const [authMode, setAuthMode] = useState<'guest' | 'login'>('guest');
  const [authEmail, setAuthEmail] = useState('');

  // Form State
  const [address, setAddress] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [shippingRate, setShippingRate] = useState<{rate: number, provider: string} | null>(null);
  
  // Gifting State
  const [isGift, setIsGift] = useState(false);
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [occasion, setOccasion] = useState('');
  const [hidePrice, setHidePrice] = useState(true);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Promo State
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  
  // Transaction State
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCartDetails = async () => {
      if (items.length === 0) {
        setIsLoading(false);
        return;
      }
      
      let loadedProducts = [];
      let total = 0;
      for (const item of items) {
        const product = await api.products.get(item.productId);
        if (product) {
          loadedProducts.push({ ...product, quantity: item.quantity });
          total += product.price * item.quantity;
        }
      }
      setCartProducts(loadedProducts);
      setSubtotal(total);
      setIsLoading(false);
    };
    
    loadCartDetails();
  }, [items]);

  const handleAuthContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'guest') {
      setAddress(prev => ({ ...prev, email: authEmail }));
    }
    setStep('address');
  };

  const handleAddressContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('gifting');
  };

  const handleGiftingContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const result = await api.commerce.calculateShipping(items, address.pincode);
      setShippingRate(result);
      setStep('shipping');
    } catch (err) {
      setError('Failed to calculate shipping rates. Please check your pincode.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyPromo = async () => {
    // Mock promo code validation
    if (promoCode.toUpperCase() === 'ARTZY10') {
      setDiscount(subtotal * 0.1);
      setError(null);
    } else {
      setError('Invalid or expired promo code.');
      setDiscount(0);
    }
  };

  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Load Razorpay script dynamically
      const res = await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!res) {
        setError('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      // 2. Get ERP Order ID
      const finalAmount = subtotal + (shippingRate?.rate || 0) - discount + (giftWrapping ? 500 : 0);
      const { orderId } = await api.commerce.initiatePayment(items, finalAmount);
      
      // 3. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_123',
        amount: finalAmount * 100, // in paise
        currency: 'INR',
        name: "Artzy's Studio",
        description: "Premium Handcrafted Art",
        order_id: orderId, // The ERP generated Razorpay order ID
        handler: async function (response: any) {
          try {
            // 4. Verify signature with ERP
            const verify = await api.commerce.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_signature
            );
            if (verify.success) {
              clearCart();
              router.push(`/checkout/success?orderId=${verify.erpOrderId}&guest=${authMode === 'guest'}`);
            } else {
              setError('Payment verification failed.');
              setIsProcessing(false);
            }
          } catch (err) {
            setError('Error verifying payment.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone
        },
        theme: {
          color: '#5C4033'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        setError(`Payment Failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
      
    } catch (err) {
      setError('Payment gateway error. Please try again later.');
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center' }}>Loading Secure Checkout...</div>;
  if (items.length === 0 && step === 'auth') {
    return <div style={{ textAlign: 'center' }}><h2>Your Cart is Empty</h2><button className="btn" onClick={() => router.push('/shop')}>Return to Shop</button></div>;
  }

  const finalTotal = subtotal + (shippingRate?.rate || 0) - discount + (giftWrapping ? 500 : 0);

  return (
    <div className="checkout-layout" style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
      
      {/* Left Column: Flow */}
      <div className="checkout-flow" style={{ flex: '1 1 600px' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: step === 'auth' ? 'bold' : 'normal', color: step === 'auth' ? 'var(--text-primary)' : '' }}>Auth</span> &gt;
          <span style={{ fontWeight: step === 'address' ? 'bold' : 'normal', color: step === 'address' ? 'var(--text-primary)' : '' }}>Address</span> &gt;
          <span style={{ fontWeight: step === 'gifting' ? 'bold' : 'normal', color: step === 'gifting' ? 'var(--text-primary)' : '' }}>Gifting</span> &gt;
          <span style={{ fontWeight: step === 'shipping' ? 'bold' : 'normal', color: step === 'shipping' ? 'var(--text-primary)' : '' }}>Shipping</span> &gt;
          <span style={{ fontWeight: step === 'payment' ? 'bold' : 'normal', color: step === 'payment' ? 'var(--text-primary)' : '' }}>Payment</span>
        </div>

        {error && <div style={{ background: '#ffecec', color: '#cc0000', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>{error}</div>}

        {step === 'auth' && (
          <form onSubmit={handleAuthContinue} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2>Welcome</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="auth" checked={authMode === 'guest'} onChange={() => setAuthMode('guest')} /> Guest Checkout
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="auth" checked={authMode === 'login'} onChange={() => setAuthMode('login')} /> Login
              </label>
            </div>
            
            <input required type="email" placeholder="Email Address" value={authEmail} onChange={e => setAuthEmail(e.target.value)} style={{ padding: '0.8rem' }} />
            
            {authMode === 'login' && (
              <input required type="password" placeholder="Password" style={{ padding: '0.8rem' }} />
            )}
            
            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
              {authMode === 'guest' ? 'Continue as Guest' : 'Login & Continue'}
            </button>
          </form>
        )}

        {step === 'address' && (
          <form onSubmit={handleAddressContinue} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2>Delivery Address</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input required type="text" placeholder="Full Name" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} style={{ flex: 1, padding: '0.8rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input required type="email" placeholder="Email" value={address.email} onChange={e => setAddress({...address, email: e.target.value})} style={{ flex: 1, padding: '0.8rem' }} />
              <input required type="tel" placeholder="Phone" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} style={{ flex: 1, padding: '0.8rem' }} />
            </div>
            <input required type="text" placeholder="Street Address" value={address.address} onChange={e => setAddress({...address, address: e.target.value})} style={{ padding: '0.8rem' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input required type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} style={{ flex: 1, padding: '0.8rem' }} />
              <input required type="text" placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} style={{ flex: 1, padding: '0.8rem' }} />
              <input required type="text" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} style={{ flex: 1, padding: '0.8rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn" style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} onClick={() => setStep('auth')}>Back</button>
              <button type="submit" className="btn" style={{ flex: 1 }}>Continue</button>
            </div>
          </form>
        )}

        {step === 'gifting' && (
          <form onSubmit={handleGiftingContinue} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2>Gifting Experience</h2>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
              <input type="checkbox" checked={isGift} onChange={e => setIsGift(e.target.checked)} />
              Is this a gift?
            </label>

            {isGift && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--bg-secondary)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={giftWrapping} onChange={e => setGiftWrapping(e.target.checked)} />
                  Premium Gift Wrapping (+₹500)
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={hidePrice} onChange={e => setHidePrice(e.target.checked)} />
                  Hide price from packing slip
                </label>
                
                <select value={occasion} onChange={e => setOccasion(e.target.value)} style={{ padding: '0.8rem' }}>
                  <option value="">Select Occasion (Optional)</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate</option>
                  <option value="housewarming">Housewarming</option>
                </select>
                
                <textarea placeholder="Gift Message (Handwritten on premium card)" value={giftMessage} onChange={e => setGiftMessage(e.target.value)} rows={3} style={{ padding: '0.8rem' }}></textarea>
              </div>
            )}
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Delivery Notes (Optional)</label>
              <textarea placeholder="e.g. Leave at front door, call before delivery" value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} rows={2} style={{ padding: '0.8rem', width: '100%' }}></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn" style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} onClick={() => setStep('address')}>Back</button>
              <button type="submit" className="btn" disabled={isProcessing} style={{ flex: 1 }}>
                {isProcessing ? 'Calculating Shipping...' : 'Continue to Shipping'}
              </button>
            </div>
          </form>
        )}

        {step === 'shipping' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2>Shipping Method</h2>
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{shippingRate?.provider} Standard Delivery</strong>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>Estimated delivery in 5-7 days</p>
              </div>
              <div style={{ fontWeight: 'bold' }}>
                {shippingRate?.rate === 0 ? 'FREE' : `₹${shippingRate?.rate}`}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} onClick={() => setStep('gifting')}>Back</button>
              <button className="btn" onClick={() => setStep('payment')} style={{ flex: 1 }}>Continue to Payment</button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2>Secure Payment</h2>
            <p>Your payment will be processed securely via Razorpay.</p>
            <div style={{ padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '4px', textAlign: 'center', background: '#f9f9f9' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <h3>Total to Pay: ₹{finalTotal.toLocaleString('en-IN')}</h3>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} onClick={() => setStep('shipping')} disabled={isProcessing}>Back</button>
              <button className="btn" onClick={handleInitiatePayment} disabled={isProcessing} style={{ flex: 1 }}>
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Order Summary */}
      <div className="checkout-summary" style={{ flex: '1 1 350px', background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '4px', height: 'fit-content' }}>
        <h3 style={{ marginTop: 0, marginBottom: '2rem' }}>Order Summary</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {cartProducts.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '50px', height: '50px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                  Img
                </div>
                <div>
                  <div style={{ fontWeight: '500' }}>{p.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {p.quantity}</div>
                </div>
              </div>
              <div>₹{(p.price * p.quantity).toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
        
        {/* Promo Code Input */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <input type="text" placeholder="Promo Code (Try ARTZY10)" value={promoCode} onChange={e => setPromoCode(e.target.value)} style={{ flex: 1, padding: '0.5rem' }} />
          <button className="btn" onClick={handleApplyPromo} style={{ padding: '0.5rem 1rem' }}>Apply</button>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#008000' }}>
              <span>Discount</span>
              <span>-₹{discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          {giftWrapping && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Gift Wrapping</span>
              <span>₹500</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Shipping</span>
            <span>{shippingRate ? (shippingRate.rate === 0 ? 'FREE' : `₹${shippingRate.rate}`) : 'Calculated at next step'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <span>Total</span>
            <span>₹{finalTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
