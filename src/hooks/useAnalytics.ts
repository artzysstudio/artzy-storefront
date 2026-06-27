"use client";

import { useEffect } from 'react';

type AnalyticsEvent = {
  eventName: string;
  properties?: Record<string, any>;
};

export function useAnalytics() {
  // Setup generic analytics window object to queue events if provider script isn't loaded yet
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).dataLayer) {
      (window as any).dataLayer = [];
    }
  }, []);

  const trackEvent = ({ eventName, properties }: AnalyticsEvent) => {
    try {
      if (typeof window === 'undefined') return;
      
      const payload = { event: eventName, ...properties, timestamp: new Date().toISOString() };
      
      // Standard dataLayer push (GTM/GA4 compatible)
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push(payload);
      }

      // Log in dev mode to verify hook
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Analytics Track] ${eventName}`, payload);
      }
    } catch (e) {
      console.warn('Analytics tracking failed', e);
    }
  };

  const trackProductView = (productId: string, name: string, category: string, price: number) => {
    trackEvent({
      eventName: 'view_item',
      properties: {
        ecommerce: {
          items: [{ item_id: productId, item_name: name, item_category: category, price }]
        }
      }
    });
  };

  const trackGiftFinderComplete = (occasion: string, style: string) => {
    trackEvent({
      eventName: 'gift_finder_complete',
      properties: { occasion, style }
    });
  };

  const trackAddToCart = (productId: string, name: string, price: number, quantity: number) => {
    trackEvent({
      eventName: 'add_to_cart',
      properties: {
        ecommerce: {
          items: [{ item_id: productId, item_name: name, price, quantity }]
        }
      }
    });
  };

  return {
    trackEvent,
    trackProductView,
    trackGiftFinderComplete,
    trackAddToCart
  };
}
