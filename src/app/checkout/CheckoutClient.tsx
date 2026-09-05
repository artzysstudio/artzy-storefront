"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { api, Product, ShippingOption } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useCustomer } from '@/context/CustomerContext';
import Image from 'next/image';
import Link from 'next/link';
import { RichProductName } from '@/components/RichProductText';
import { clampCartQuantity, normaliseStockLimit } from '@/lib/cart-stock';

type CheckoutStep = 'address' | 'gifting' | 'shipping' | 'payment';
type CartProduct = Product & {
  cartQuantity: number;
  stockQuantity: number | null;
  cartVariantId?: string;
  cartVariantLabel?: string;
};

function CartThumbnail({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);
  const image = product.images?.[0];

  return (
    <span className="checkout-item__image" aria-hidden="true">
      {!failed && image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 640px) 72px, 88px"
          style={{ objectFit: 'cover' }}
          unoptimized
          onError={() => setFailed(true)}
        />
      ) : (
        <Image
          src="/images/artzy-studio-logo.png"
          alt=""
          width={54}
          height={54}
          className="checkout-item__fallback"
          unoptimized
        />
      )}
    </span>
  );
}

export default function CheckoutClient({ initialProducts }: { initialProducts: Product[] }) {
  const { items, giftBundles, setCartQuantity, removeFromCart, removeGiftBundle, clearCart } = useCart();
  const { isAuthenticated, user } = useCustomer();
  const router = useRouter();
  
  const [step, setStep] = useState<CheckoutStep>('address');
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [inventoryMessage, setInventoryMessage] = useState<string | null>(null);
  
  // Form State
  const [address, setAddress] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [shippingRate, setShippingRate] = useState<ShippingOption | null>(null);
  const [shippingNeedsConfirmation, setShippingNeedsConfirmation] = useState(false);
  
  // Gifting State
  const [isGift, setIsGift] = useState(false);
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [occasion, setOccasion] = useState('');
  const [hidePrice, setHidePrice] = useState(true);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Transaction State
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCartDetails = async () => {
      if (items.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      let availableProducts = initialProducts;
      try {
        availableProducts = await api.products.listLive();
      } catch {
        // A bundled list is only a resilience fallback; ERP validates the
        // current price and stock again before payment.
      }

      const loadedProducts: CartProduct[] = [];
      const stockChanges: string[] = [];
      let total = 0;
      for (const item of items) {
        const product = availableProducts.find((candidate) => candidate.id === item.productId);
        if (product) {
          const variant = item.variantId
            ? product.variants?.find((candidate, index) => String(candidate.id || candidate.sku || index) === item.variantId)
            : undefined;
          const stockQuantity = normaliseStockLimit(variant?.quantity ?? product.quantity);
          const safeQuantity = clampCartQuantity(item.quantity, stockQuantity);
          if (safeQuantity === 0) {
            removeFromCart(item.productId, item.variantId);
            stockChanges.push(`${product.name} is no longer available and was removed from your bag.`);
            continue;
          }
          if (safeQuantity !== item.quantity || item.availableStock !== stockQuantity) {
            setCartQuantity(item.productId, safeQuantity, {
              variantId: item.variantId,
              variantLabel: item.variantLabel,
              availableStock: stockQuantity,
            });
            if (safeQuantity !== item.quantity) stockChanges.push(`${product.name} was adjusted to ${safeQuantity}, matching current studio availability.`);
          }
          const effectivePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
          loadedProducts.push({
            ...product,
            price: variant?.price ?? effectivePrice,
            cartQuantity: safeQuantity,
            stockQuantity,
            cartVariantId: item.variantId,
            cartVariantLabel: item.variantLabel,
          });
          total += (variant?.price ?? effectivePrice) * safeQuantity;
        }
      }
      if (cancelled) return;
      setCartProducts(loadedProducts);
      setSubtotal(total);
      setInventoryMessage(stockChanges.length ? stockChanges.join(' ') : availableProducts.length ? 'Bag quantities checked against current studio availability.' : 'Live availability could not be refreshed. Stock will be checked again before payment.');
      setIsLoading(false);
    };

    void loadCartDetails();
    return () => { cancelled = true; };
  }, [initialProducts, items, removeFromCart, setCartQuantity]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setAddress((previous) => ({ ...previous, name: previous.name || user.name, email: user.email }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (giftBundles.length > 0) {
      setIsGift(true);
      setOccasion((current) => current || giftBundles[0].occasion);
    }
  }, [giftBundles]);

  const handleAddressContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('gifting');
  };

  const updateBagQuantity = (product: CartProduct, quantity: number) => {
    setCartQuantity(product.id, quantity, {
      variantId: product.cartVariantId,
      variantLabel: product.cartVariantLabel,
      availableStock: product.stockQuantity,
    });
    setShippingOptions([]);
    setShippingRate(null);
    setShippingNeedsConfirmation(false);
    setStep('address');
  };

  const resetDeliveryQuote = () => {
    setShippingOptions([]);
    setShippingRate(null);
    setShippingNeedsConfirmation(false);
    setStep('address');
  };

  const removeBagProduct = (product: CartProduct) => {
    removeFromCart(product.id, product.cartVariantId);
    resetDeliveryQuote();
  };

  const removeBagBundle = (bundleId: string) => {
    removeGiftBundle(bundleId);
    resetDeliveryQuote();
  };

  const handleGiftingContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const result = await api.commerce.calculateShipping(items, address.pincode);
      setShippingNeedsConfirmation(Boolean(result.requiresStudioConfirmation));
      setShippingOptions(result.options);
      if (result.requiresStudioConfirmation) {
        setShippingRate(null);
        setError(null);
        setStep('shipping');
        return;
      }
      const economical = result.options.find((option) => option.service === result.defaultService) || result.options[0];
      setShippingRate(economical || null);
      if (!economical) throw new Error('No courier option is available.');
      setStep('shipping');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate shipping rates. Please check your PIN code.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInitiatePayment = async () => {
    if (!shippingRate) {
      setError('Select a delivery method first.');
      return;
    }
    setIsProcessing(true);
    setError(null);
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

      // 2. ERP recalculates inventory, prices and the selected courier before
      // creating the Razorpay order. Browser totals are display-only.
      const paymentOrder = await api.commerce.initiatePayment({
        items,
        address,
        shipping: { id: shippingRate.id, service: shippingRate.service },
        isGift: isGift || giftBundles.length > 0,
        giftWrapping: giftWrapping || giftBundles.some((bundle) => bundle.packaging.unitPrice > 0),
        giftMessage,
        occasion,
        hidePrice,
        deliveryNotes,
        giftBundles
      });
      
      // 3. Initialize Razorpay
      let razorpayFinished = false;
      let razorpayVisibilityTimer: ReturnType<typeof setTimeout> | null = null;
      const finishRazorpayAttempt = (message: string) => {
        if (razorpayFinished) return;
        razorpayFinished = true;
        if (razorpayVisibilityTimer) clearTimeout(razorpayVisibilityTimer);
        setError(message);
        setIsProcessing(false);
      };
      const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "Artzy's Studio",
        description: "Premium Handcrafted Art",
        order_id: paymentOrder.razorpayOrderId,
        handler: async function (response: any) {
          if (razorpayVisibilityTimer) clearTimeout(razorpayVisibilityTimer);
          try {
            // 4. The ERP verifies all three Razorpay fields, fetches the live
            // payment and updates stock only after that verification succeeds.
            const verify = await api.commerce.verifyPayment({
              erpOrderId: paymentOrder.erpOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            if (verify.success) {
              razorpayFinished = true;
              clearCart();
              router.push(`/checkout/success?orderId=${verify.erpOrderId}&guest=${!isAuthenticated}`);
            } else {
              finishRazorpayAttempt('Payment verification failed. No inventory was changed. Please contact Artzy’s Studio with your order number.');
            }
          } catch {
            finishRazorpayAttempt('Payment verification could not be completed. Please contact Artzy’s Studio before retrying.');
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone
        },
        theme: {
          color: '#5C4033'
        },
        modal: {
          ondismiss: function () {
            finishRazorpayAttempt('Payment window closed. No payment was charged. You can safely try again.');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        finishRazorpayAttempt(`Payment failed: ${response.error.description || 'Razorpay declined the payment attempt.'}`);
      });
      rzp.open();
      razorpayVisibilityTimer = setTimeout(() => {
        const checkoutVisible = Array.from(document.querySelectorAll<HTMLIFrameElement>('iframe[src*="razorpay.com"]'))
          .some((frame) => {
            const rect = frame.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          });
        if (!checkoutVisible) {
          finishRazorpayAttempt('Razorpay could not open payment options. No payment was charged. Please try again later.');
        }
      }, 10000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment gateway error. Please try again later.');
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center' }}>Loading Secure Checkout...</div>;
  if (items.length === 0) {
    return <div style={{ textAlign: 'center' }}><h2>Your Cart is Empty</h2><button className="btn" onClick={() => router.push('/shop')}>Return to Shop</button></div>;
  }

  const configuredGiftExtras = giftBundles.reduce((total, bundle) => total + bundle.packaging.total + bundle.personalisation.total, 0);
  const manualGiftWrap = giftBundles.length === 0 && giftWrapping ? 500 : 0;
  const finalTotal = subtotal + (shippingRate?.rate || 0) + configuredGiftExtras + manualGiftWrap;
  const readyStockCount = cartProducts.filter((product) => product.availability === 'in_stock' && !product.madeToOrder).length;
  const madeToOrderCount = cartProducts.filter((product) => product.availability === 'made_to_order' || product.madeToOrder).length;

  return (
    <div className="checkout-layout" style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
      
      {/* Left Column: Flow */}
      <div className="checkout-flow" style={{ flex: '1 1 600px' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: step === 'address' || step === 'gifting' ? 'bold' : 'normal', color: step === 'address' || step === 'gifting' ? 'var(--text-primary)' : '' }}>Delivery details</span> &gt;
          <span style={{ fontWeight: step === 'shipping' ? 'bold' : 'normal', color: step === 'shipping' ? 'var(--text-primary)' : '' }}>Shipping method</span> &gt;
          <span style={{ fontWeight: step === 'payment' ? 'bold' : 'normal', color: step === 'payment' ? 'var(--text-primary)' : '' }}>Payment</span>
        </div>

        {error && <div style={{ background: '#ffecec', color: '#cc0000', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>{error}</div>}

        {step === 'address' && (
          <form onSubmit={handleAddressContinue} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2>Delivery Address</h2>
            {!isAuthenticated && <div style={{ padding: '1rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}><strong>Guest checkout is available.</strong><p style={{ margin: '.35rem 0 0' }}>Enter your delivery details below. Prefer an account? <a href="/account">Sign in with Google or a secure email link</a>; your bag stays saved on this device.</p></div>}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input required type="text" autoComplete="name" placeholder="Full Name" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} style={{ flex: 1, padding: '0.8rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input required type="email" autoComplete="email" placeholder="Email" value={address.email} onChange={e => setAddress({...address, email: e.target.value})} style={{ flex: 1, padding: '0.8rem' }} />
              <input required type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[0-9]{10}" maxLength={10} placeholder="10-digit Phone" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} style={{ flex: 1, padding: '0.8rem' }} />
            </div>
            <input required type="text" autoComplete="street-address" placeholder="Street Address" value={address.address} onChange={e => setAddress({...address, address: e.target.value})} style={{ padding: '0.8rem' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input required type="text" autoComplete="address-level2" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} style={{ flex: 1, padding: '0.8rem' }} />
              <input required type="text" autoComplete="address-level1" placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} style={{ flex: 1, padding: '0.8rem' }} />
              <input required type="text" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} placeholder="6-digit PIN code" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})} style={{ flex: 1, padding: '0.8rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn" style={{ flex: 1 }}>Continue</button>
            </div>
          </form>
        )}

        {step === 'gifting' && (
          <form onSubmit={handleGiftingContinue} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2>Gifting Experience</h2>
            
            {giftBundles.length > 0 && <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)' }}><strong>Your Gift Concierge plan is attached.</strong><p style={{ marginBottom: 0 }}>You can add a message and delivery notes below. Its selected packaging is already included.</p></div>}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
              <input type="checkbox" checked={isGift} onChange={e => setIsGift(e.target.checked)} />
              Is this a gift?
            </label>

            {isGift && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--bg-secondary)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" disabled={giftBundles.length > 0} checked={giftBundles.length > 0 ? giftBundles.some((bundle) => bundle.packaging.unitPrice > 0) : giftWrapping} onChange={e => setGiftWrapping(e.target.checked)} />
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
            <div style={{ display: 'grid', gap: '.45rem', padding: '1rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
              <strong>How this order will be prepared</strong>
              {readyStockCount > 0 && <span>{readyStockCount} ready-stock item{readyStockCount === 1 ? '' : 's'} can move to packing after payment confirmation.</span>}
              {madeToOrderCount > 0 && <span>{madeToOrderCount} made-to-order item{madeToOrderCount === 1 ? '' : 's'} follow the production time confirmed by the studio.</span>}
              {readyStockCount > 0 && madeToOrderCount > 0 && <small>These items may ship separately. Any separate shipment and its cost must be confirmed before payment.</small>}
            </div>
            {!shippingNeedsConfirmation && <p style={{ marginTop: 0, color: 'var(--text-muted)' }}>
              Economical is selected by default. Express and urgent use available air services for PIN {address.pincode}.
            </p>}
            {shippingNeedsConfirmation && <div role="status" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
              <strong>Delivery confirmation is needed</strong>
              <p>Artzy&apos;s Studio must confirm courier availability, delivery time and shipping cost for PIN {address.pincode}. No delivery price has been assumed and payment is not available until this is confirmed.</p>
              <a className="btn" target="_blank" rel="noreferrer" href={`https://wa.me/919158680722?text=${encodeURIComponent(`Hello Artzy's Studio, please confirm shipping for PIN ${address.pincode}. My bag has ${items.reduce((total, item) => total + item.quantity, 0)} item(s).`)}`}>Ask the studio on WhatsApp</a>
            </div>}
            {shippingOptions.map((option) => {
              const selected = shippingRate?.id === option.id && shippingRate?.service === option.service;
              return (
                <label key={`${option.service}-${option.id}`} style={{ padding: '1.25rem', border: `2px solid ${selected ? 'var(--text-primary)' : 'var(--border-color)'}`, borderRadius: '8px', display: 'flex', justifyContent: 'space-between', gap: '1rem', cursor: 'pointer', background: selected ? 'var(--bg-secondary)' : 'transparent' }}>
                  <span style={{ display: 'flex', gap: '0.75rem' }}>
                    <input type="radio" name="shipping" checked={selected} onChange={() => setShippingRate(option)} />
                    <span>
                      <strong>{option.label} · {option.courier}</strong>
                      <span style={{ display: 'block', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {option.mode === 'air' ? 'Air courier' : 'Surface courier'} · {option.etd || (option.estimatedDays ? `${option.estimatedDays} days` : 'ETA shown after booking')}
                      </span>
                    </span>
                  </span>
                  <strong>{option.rate === 0 ? 'FREE' : `₹${option.rate.toLocaleString('en-IN')}`}</strong>
                </label>
              );
            })}
            {!shippingNeedsConfirmation && <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{shippingRate?.label} · {shippingRate?.courier}</strong>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{shippingRate?.mode === 'air' ? 'Air courier' : 'Surface courier'} · {shippingRate?.etd || 'ETA shown after booking'}</p>
              </div>
              <div style={{ fontWeight: 'bold' }}>
                {shippingRate?.rate === 0 ? 'FREE' : `₹${shippingRate?.rate}`}
              </div>
            </div>}
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} onClick={() => setStep('gifting')}>Back</button>
              {!shippingNeedsConfirmation && <button className="btn" onClick={() => setStep('payment')} style={{ flex: 1 }}>Continue to Payment</button>}
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
      <aside className="checkout-summary" aria-labelledby="order-summary-title">
        <div className="checkout-summary__head">
          <div>
            <span>Review before ordering</span>
            <h3 id="order-summary-title">Your bag</h3>
          </div>
          <Link href="/shop/">Continue shopping</Link>
        </div>
        {inventoryMessage && <p className="checkout-inventory-status" role="status">{inventoryMessage}</p>}
        <div className="checkout-items">
          {cartProducts.map(p => (
            <article key={`${p.id}-${p.cartVariantId || 'standard'}`} className="checkout-item">
              <Link href={`/shop/?product=${encodeURIComponent(String(p.id))}`} className="checkout-item__preview" aria-label={`View ${p.name}`}>
                <CartThumbnail product={p} />
                <span className="checkout-item__quantity" aria-label={`Quantity ${p.cartQuantity}`}>{p.cartQuantity}</span>
              </Link>
              <div className="checkout-item__details">
                <Link href={`/shop/?product=${encodeURIComponent(String(p.id))}`} className="checkout-item__name">
                  <RichProductName name={p.name} />
                </Link>
                <div className="checkout-item__meta">
                  <span>{p.category}</span>
                  {p.cartVariantLabel && <span>{p.cartVariantLabel}</span>}
                </div>
                <div className="checkout-item__controls" aria-label={`Quantity for ${p.name}`}>
                  <button type="button" onClick={() => updateBagQuantity(p, p.cartQuantity - 1)} aria-label={p.cartQuantity === 1 ? `Remove ${p.name}` : `Decrease ${p.name} quantity`}>−</button>
                  <output aria-live="polite" aria-label={`${p.cartQuantity} selected`}>{p.cartQuantity}</output>
                  <button type="button" onClick={() => updateBagQuantity(p, p.cartQuantity + 1)} disabled={p.stockQuantity !== null && p.cartQuantity >= p.stockQuantity} aria-label={`Add another ${p.name}`}>+</button>
                  <button type="button" className="checkout-item__remove" onClick={() => removeBagProduct(p)}>Remove</button>
                </div>
                <small className="checkout-item__stock">
                  {p.stockQuantity === 1
                    ? 'Only 1 available'
                    : p.stockQuantity !== null
                      ? p.cartQuantity >= p.stockQuantity
                        ? `All ${p.stockQuantity} available units are in your bag`
                        : `${p.stockQuantity - p.cartQuantity} more available · ${p.stockQuantity} total available`
                      : 'Availability confirmed again before payment'}
                </small>
              </div>
              <strong className="checkout-item__price">₹{(p.price * p.cartQuantity).toLocaleString('en-IN')}</strong>
            </article>
          ))}
        </div>
        {giftBundles.map((bundle) => <div className="checkout-gift-bundle" key={bundle.id}><strong>Artzy Gift Plan · {bundle.occasion}</strong><div>{bundle.quantity} gift{bundle.quantity === 1 ? '' : 's'} · {bundle.packaging.name}</div><p>{bundle.museReason}</p><button type="button" onClick={() => removeBagBundle(bundle.id)}>Remove gift plan</button></div>)}
        
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {manualGiftWrap > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Gift Wrapping</span>
              <span>₹500</span>
            </div>
          )}
          {configuredGiftExtras > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Configured gift packaging</span><span>₹{configuredGiftExtras.toLocaleString('en-IN')}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Shipping</span>
            <span>{shippingRate ? (shippingRate.rate === 0 ? 'FREE' : `₹${shippingRate.rate}`) : 'Calculated at next step'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '.82rem', color: 'var(--text-muted)' }}>
            <span>Tax</span>
            <span>Availability confirmed before payment</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <span>Total</span>
            <span>₹{finalTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </aside>

    </div>
  );
}
