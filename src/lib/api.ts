import { legalPolicyPages } from '@/data/legalPolicies';

const getEnv = (key: string) => {
  try { return typeof process !== 'undefined' && process.env ? process.env[key] : undefined; } catch (e) { return undefined; }
};
const ERP_BASE_URL = getEnv('NEXT_PUBLIC_ERP_API_URL') || 'https://erp.artzysstudio.in/api';

// Fallback helper with Exponential Backoff Retry Logic
async function fetchFromERP<T>(endpoint: string, fallback: T, retries = 0, delay = 500): Promise<T> {
  // Static exports must not bake a point-in-time inventory copy into public
  // HTML. Runtime requests obtain the current publication state from ERP.
  if (getEnv('ARTZY_STATIC_BUILD') === '1') return fallback;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Keep the storefront responsive if ERP is unavailable

    const response = await fetch(`${ERP_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`ERP fetch failed with status ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`[ERP Fallback] Retrying ${endpoint}... (${retries} attempts left)`);
      await new Promise(res => setTimeout(res, delay));
      return fetchFromERP(endpoint, fallback, retries - 1, delay * 2);
    }
    console.error(`[ERP unavailable] Failed to fetch ${endpoint} after all retries.`);
    return fallback;
  }
}

// ------------------------------------------------------------------
// PIM INTERFACES (Product Information Management)
// ------------------------------------------------------------------

export interface ProductSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface ProductVariant {
  id?: string;
  sku?: string;
  name?: string;
  title?: string;
  option?: string;
  value?: string;
  price?: number;
  quantity?: number;
  isAvailable?: boolean;
  attributes?: Record<string, string>;
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  category: string;
  sourceCategory?: string;
  price: number;
  salePrice?: number | null;
  quantity?: number;
  images: string[];
  variants?: ProductVariant[];
  videoUrl?: string;
  
  // PIM Extended Fields
  artworkStory?: string;
  artistNotes?: string;
  artist?: string;
  collectionId?: string;
  medium?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  colorPalette?: string[];
  style?: string[];
  occasion?: string[];
  roomType?: string[];
  
  careInstructions?: string;
  leadTime?: string;
  availability?: 'in_stock' | 'made_to_order' | 'out_of_stock';
  
  // Gifting & Customization
  isNew?: boolean;
  isSoldOut?: boolean;
  giftWrappingAvailable?: boolean;
  personalizationOptions?: string[];
  giftEligible?: boolean;
  giftOccasions?: string[];
  giftRecipients?: string[];
  giftStyles?: string[];
  personalisationPrice?: number;
  personalisationLeadTime?: string;
  packagingCompatibility?: string[];
  giftPopularityScore?: number;
  productionLeadTime?: string;
  madeToOrder?: boolean;
  minimumGiftQuantity?: number;
  maximumGiftQuantity?: number;
  bulkGiftEligible?: boolean;
  
  // Merchandising
  relatedProductIds?: string[];
  recommendedPairings?: string[];
  crossSellProductIds?: string[];
  
  // SEO & Social
  seo?: ProductSEO;
  socialSharingImage?: string;
  erpUpdatedAt?: string;
}

const ARTZY_MEDIA_ORIGIN = 'https://media.artzysstudio.in';
const ARTZY_MEDIA_HOSTS = new Set(['media.artzysstudio.in', 'cdn.artzysstudio.in']);

function storefrontMediaUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const candidate = value.trim().replace(/\\/g, '/');

  try {
    const absolute = new URL(candidate);
    if (absolute.protocol !== 'https:' || !ARTZY_MEDIA_HOSTS.has(absolute.hostname)) return null;

    // Older ERP records use cdn.artzysstudio.in, which is no longer a live
    // hostname. The object keys are still available on the canonical Artzy
    // media origin, so rewrite the host without changing the stored key.
    absolute.hostname = new URL(ARTZY_MEDIA_ORIGIN).hostname;
    return absolute.toString();
  } catch {
    const relative = candidate.replace(/^\/+/, '');
    if (!relative || relative.includes('..') || relative.includes(':')) return null;
    return new URL(relative, `${ARTZY_MEDIA_ORIGIN}/`).toString();
  }
}

export function normalizeStorefrontProduct(product: Product): Product {
  const source = product as Product & { cover_image?: unknown; sale_price?: unknown };
  const candidates = [
    ...(Array.isArray(product.images) ? product.images : []),
    source.cover_image,
  ];
  const images = Array.from(new Set(candidates.map(storefrontMediaUrl).filter((image): image is string => Boolean(image))));
  const erpSalePrice = Number(source.sale_price);

  return {
    ...product,
    images,
    salePrice: typeof product.salePrice === 'number'
      ? product.salePrice
      : Number.isFinite(erpSalePrice) && erpSalePrice > 0
        ? erpSalePrice
        : null,
  };
}

/**
 * A product may appear in the public shop only when it is a real, available
 * ERP record with its own Artzy Studio product photograph. This deliberately
 * excludes design concepts, generic fallback imagery and records whose studio
 * photography has not been uploaded yet.
 */
export function isStorefrontInventoryProduct(product: Product): boolean {
  const primaryImage = Array.isArray(product?.images) ? product.images[0] : '';
  let isArtzyMedia = false;

  try {
    isArtzyMedia = new URL(primaryImage).hostname === new URL(ARTZY_MEDIA_ORIGIN).hostname;
  } catch {
    isArtzyMedia = false;
  }

  return Boolean(
    product?.id &&
    product?.name &&
    Number(product?.price) > 0 &&
    Number(product?.quantity ?? 0) > 0 &&
    product?.availability !== 'out_of_stock' &&
    product?.isSoldOut !== true &&
    isArtzyMedia
  );
}

function normalizeProductList(payload: unknown): Product[] {
  const records = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: Product[] }).data
      : payload && typeof payload === 'object' && Array.isArray((payload as { products?: unknown }).products)
        ? (payload as { products: Product[] }).products
        : [];

  return records.map(normalizeStorefrontProduct).filter(isStorefrontInventoryProduct);
}

export interface CollectionSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  heroImage: string;
  thumbnailImage: string;
  description?: string;
  seo?: CollectionSEO;
  merchandisingRules?: any; // E.g., sort logic, featured items
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
}

export interface InstagramPost {
  id: string;
  url: string;
  imageUrl: string;
}

export interface SectionContent {
  title?: string;
  subtitle?: string;
  body?: string;
  ctaText?: string;
  ctaLink?: string;
  images?: string[];
  items?: any[]; // Dynamic list of items (e.g., testimonials, products)
}

export interface PageSection {
  id: string;
  type: 'hero' | 'featured_gifts' | 'featured_artworks' | 'meet_artist' | 'studio_process' | 'custom_journey' | 'corporate_gifting' | 'testimonials' | 'instagram' | 'muse_ai' | 'standard_text';
  isEnabled: boolean;
  sortOrder: number;
  themeVariant: 'light' | 'dark' | 'sand' | 'sage';
  backgroundStyle: 'solid' | 'gradient' | 'image' | 'none';
  content: SectionContent;
}

export interface PageDefinition {
  slug: string;
  title: string;
  seoMetadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  sections: PageSection[];
}

export interface ShippingOption {
  id: string;
  service: 'economical' | 'express' | 'urgent';
  label: string;
  courier: string;
  mode: 'surface' | 'air';
  rate: number;
  etd: string;
  estimatedDays: number | null;
}

export interface ShippingQuote {
  success: true;
  subtotal: number;
  pincode: string;
  defaultService: 'economical';
  options: ShippingOption[];
  requiresStudioConfirmation?: boolean;
  message?: string;
}

export interface StorefrontOrder {
  id: string;
  status: string;
  date: string;
  total: number;
  courier?: string;
  trackingNumber?: string;
}

async function requestERP<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${ERP_BASE_URL}${endpoint}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || `Studio service request failed with status ${response.status}`);
  }
  return data as T;
}

async function requestStorefront<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8_000);
  const response = await fetch(`/api/storefront${endpoint}`, {
    ...init,
    cache: 'no-store',
    signal: init.signal ?? controller.signal,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  }).finally(() => clearTimeout(timeoutId));
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || `Storefront request failed with status ${response.status}`);
  }
  return data as T;
}

// Page copy below is a continuity fallback only. Product inventory never uses
// invented/demo records; it is always filtered from the ERP catalogue.

const mockHomePage: PageDefinition = {
  slug: 'home',
  title: "Artzy's Studio",
  seoMetadata: {
    title: "Artzy's Studio | Contemporary Art & Bespoke Gifting",
    description: "Handcrafted original art, fluid resin creations, and personalized bespoke gifting by Deepti J. Shah.",
    keywords: ["Resin Art", "Original Paintings", "Corporate Gifting", "Contemporary Art India"]
  },
  sections: [
    {
      id: 'sec_hero', type: 'hero', isEnabled: true, sortOrder: 1, themeVariant: 'light', backgroundStyle: 'none',
      content: {
        title: "The Art of Gifting",
        subtitle: "Handcrafted original art, personalized keepsakes, and bespoke hampers by Deepti J. Shah.",
        ctaText: "Explore Collections",
        ctaLink: "/shop",
        images: ['/assets/hero_bg_authentic.png']
      }
    },
    {
      id: 'sec_artworks', type: 'featured_artworks', isEnabled: true, sortOrder: 2, themeVariant: 'light', backgroundStyle: 'none',
      content: { title: "Featured Artworks", subtitle: "Studio Portfolio", ctaText: "View Full Portfolio", ctaLink: "/shop" }
    },
    {
      id: 'sec_artist', type: 'meet_artist', isEnabled: true, sortOrder: 3, themeVariant: 'sand', backgroundStyle: 'solid',
      content: {
        title: "Deepti J. Shah", subtitle: "Meet the Artist",
        body: "Every piece created at Artzy's Studio is an extension of my journey. I believe that art should not just sit on a wall, but should resonate with the warmth of the space it lives in.",
        ctaText: "Read My Story", ctaLink: "/about"
      }
    },
    {
      id: 'sec_process', type: 'studio_process', isEnabled: true, sortOrder: 4, themeVariant: 'dark', backgroundStyle: 'solid',
      content: { title: "The Studio Process", body: "A glimpse into the slow, meditative process of pouring resin, mixing textures, and layering colors." }
    },
    {
      id: 'sec_custom', type: 'custom_journey', isEnabled: true, sortOrder: 5, themeVariant: 'light', backgroundStyle: 'none',
      content: { title: "Custom Artwork Journey", body: "Commission a piece tailored specifically for your space.", ctaText: "Start a Commission", ctaLink: "/personalised/" }
    },
    {
      id: 'sec_corporate', type: 'corporate_gifting', isEnabled: true, sortOrder: 6, themeVariant: 'sage', backgroundStyle: 'solid',
      content: {
        title: "Corporate Gifting", subtitle: "Bulk & Bespoke",
        body: "Elevate your corporate gifting with handcrafted, personalized pieces. From branded wooden art to elegant resin trays, we create memorable gifts that reflect your company's values.",
        ctaText: "Inquire for Corporate", ctaLink: "/corporate"
      }
    },
    {
      id: 'sec_testimonials', type: 'testimonials', isEnabled: true, sortOrder: 7, themeVariant: 'light', backgroundStyle: 'none',
      content: { title: "Kind Words" }
    },
    {
      id: 'sec_instagram', type: 'instagram', isEnabled: true, sortOrder: 8, themeVariant: 'light', backgroundStyle: 'none',
      content: { title: "Join the Community", subtitle: "@artzysstudio" }
    },
    {
      id: 'sec_muse', type: 'muse_ai', isEnabled: true, sortOrder: 9, themeVariant: 'light', backgroundStyle: 'none',
      content: { title: "Artzy Muse AI", subtitle: "Coming Soon", body: "Experience our upcoming interactive AI assistant, designed to help you find the perfect bespoke gift." }
    }
  ]
};

const mockProjectsPage: PageDefinition = {
  slug: 'projects',
  title: "Project Gallery",
  seoMetadata: { title: "Project Gallery | Artzy's Studio", description: "Large-scale installations and commissions.", keywords: ["commissions", "installations"] },
  sections: [
    {
      id: 'sec_proj_hero', type: 'hero', isEnabled: true, sortOrder: 1, themeVariant: 'light', backgroundStyle: 'none',
      content: { title: "Commissioned Spaces", subtitle: "Transforming environments through bespoke art.", images: ['/assets/project_gallery_1.png'] }
    },
    {
      id: 'sec_proj_info', type: 'standard_text', isEnabled: true, sortOrder: 2, themeVariant: 'light', backgroundStyle: 'none',
      content: { body: "From residential feature walls to large-scale hotel installations, we collaborate with architects and interior designers to bring artistic visions to life." }
    }
  ]
};

const mockInspirationPage: PageDefinition = {
  slug: 'inspiration',
  title: "Inspiration Hub",
  seoMetadata: { title: "Inspiration Hub | Artzy's Studio", description: "Find inspiration for your space.", keywords: ["inspiration", "decor"] },
  sections: [
    {
      id: 'sec_insp_hero', type: 'hero', isEnabled: true, sortOrder: 1, themeVariant: 'sand', backgroundStyle: 'solid',
      content: { title: "Find Your Aesthetic", subtitle: "Curated collections to inspire your next gift or home update." }
    }
  ]
};

const mockAboutPage: PageDefinition = {
  slug: 'about',
  title: "The Artisan",
  seoMetadata: { title: "About | Artzy's Studio", description: "Meet Deepti J. Shah", keywords: ["Deepti J. Shah", "Artzy's Studio"] },
  sections: [
    {
      id: 'about_hero', type: 'standard_text', isEnabled: true, sortOrder: 1, themeVariant: 'light', backgroundStyle: 'none',
      content: { title: "The Journey of Clay and Canvas", body: "I started this studio as a passion project..." }
    }
  ]
};

const policyPage = (slug: string, title: string, body: string): PageDefinition => ({
  slug,
  title,
  seoMetadata: { title: `${title} | Artzy's Studio`, description: body, keywords: [] },
  sections: [{ id: `${slug}-content`, type: 'standard_text', isEnabled: true, sortOrder: 1, themeVariant: 'light', backgroundStyle: 'none', content: { title, body } }],
});

const legacyPolicyPages: Record<string, PageDefinition> = {
  'shipping-policy': policyPage('shipping-policy', 'Shipping information', 'Shipping cost, serviceability and any delivery estimate are shown only when the studio and shipping service can confirm them. For help before ordering, contact the studio with the product and delivery PIN code.'),
  'returns-policy': policyPage('returns-policy', 'Returns and damage', 'Please inspect your order on arrival. If an item is damaged, keep the product and packaging and contact the studio promptly with clear photographs. Eligibility for a return or replacement depends on the item and the confirmed order details.'),
  'customised-product-policy': policyPage('customised-product-policy', 'Customised products', 'A customised product begins only after the studio confirms the brief, price and timeline. Custom work may not be returnable unless it arrives damaged or differs materially from the approved brief. Ask the studio before payment if anything is unclear.'),
  'cancellation-policy': policyPage('cancellation-policy', 'Cancellation', 'Contact the studio as soon as possible if you need to cancel. Whether cancellation is possible depends on payment status and whether making or dispatch has begun.'),
  'privacy-policy': policyPage('privacy-policy', 'Privacy', 'Artzy’s Studio uses information you provide to answer enquiries, prepare custom briefs, fulfil orders and provide support. Uploaded reference images should be used only for the requested creative service and handled according to the confirmed brief.'),
  'terms-and-conditions': policyPage('terms-and-conditions', 'Terms and conditions', 'Product availability, price, customisation and delivery are confirmed through the storefront and Artzy’s Studio. AI-generated previews are concepts only and are not stock, production proofs or confirmed orders.'),
  'ai-concept-disclosure': policyPage('ai-concept-disclosure', 'AI concept disclosure', 'Artzy Muse previews are imaginative concepts to help discuss a direction. They are clearly separate from catalogue stock, Deepti’s original artworks and final production proofs. The studio confirms feasibility, materials, price and delivery before work begins.'),
};

// The full launch-ready policies are maintained separately from fallback page
// copy so legal/customer information remains readable and auditable.
const policyPages: Record<string, PageDefinition> = legalPolicyPages;

// ------------------------------------------------------------------
// EXPORTED API CLIENT
// ------------------------------------------------------------------

export const api = {
  products: {
    // Fail closed: only the current ERP published feed may supply products.
    // A bundled snapshot could expose an item after an administrator drafts it.
    list: async (): Promise<Product[]> => {
      // This project is statically exported. Never bake a point-in-time ERP
      // catalogue into HTML; the browser replaces it from the authenticated
      // Pages proxy so an ERP Draft change takes effect without a redeploy.
      if (typeof window === 'undefined') return [];
      const payload = await fetchFromERP<unknown>('/products/featured', []);
      return normalizeProductList(payload);
    },
    // Checkout is statically exported, so it refreshes product names, images,
    // prices and availability through the same-origin Pages proxy at runtime.
    listLive: async (): Promise<Product[]> => normalizeProductList(
      await requestStorefront<unknown>('/products')
    ),
    get: async (id: string): Promise<Product | undefined> => fetchFromERP(`/products/${id}`, undefined)
  },
  pages: {
    get: async (slug: string): Promise<PageDefinition | undefined> => {
      // Simulate dynamic routing headless CMS fetch
      const mockPages: Record<string, PageDefinition> = {
        'home': mockHomePage,
        'about': mockAboutPage,
        'projects': mockProjectsPage,
        'inspiration': mockInspirationPage,
        ...policyPages,
      };
      const fallback = mockPages[slug];
      return fetchFromERP(`/pages/${slug}`, fallback);
    }
  },
  // We keep these for backwards compatibility or specific component fetches if needed, 
  // but ideally page definitions pass this data down eventually.
  collections: {
    listGifts: async (): Promise<Collection[]> => fetchFromERP('/collections/gifts', []),
  },
  testimonials: {
    list: async (): Promise<Testimonial[]> => fetchFromERP('/testimonials', []),
  },
  instagram: {
    listFeed: async (): Promise<InstagramPost[]> => fetchFromERP('/instagram/feed', []),
  },
  cart: {
    add: async (productId: string, quantity: number) => ({ success: true }),
    get: async () => ({ items: [], total: 0 })
  },
  commerce: {
    calculateShipping: async (items: Array<{ productId: string; quantity: number }>, pincode: string): Promise<ShippingQuote> => {
      const quote = await requestStorefront<ShippingQuote | {
        rate?: number;
        provider?: string;
        courier?: string;
        estimatedDays?: number;
        etd?: string;
      }>('/shipping/quote', {
        method: 'POST',
        body: JSON.stringify({ items, pincode })
      });

      if (Array.isArray((quote as ShippingQuote).options)) return quote as ShippingQuote;

      const simpleQuote = quote as {
        rate?: number;
        provider?: string;
        courier?: string;
        estimatedDays?: number;
        etd?: string;
      };
      const rate = Number(simpleQuote.rate);
      if (!Number.isFinite(rate) || rate < 0) {
        throw new Error('The courier service did not return a valid shipping rate. Please ask the studio to confirm delivery.');
      }

      return {
        success: true,
        subtotal: 0,
        pincode,
        defaultService: 'economical',
        options: [{
          id: 'erp-standard',
          service: 'economical',
          label: 'Standard delivery',
          courier: simpleQuote.provider || simpleQuote.courier || 'Studio courier partner',
          mode: 'surface',
          rate,
          etd: simpleQuote.etd || (simpleQuote.estimatedDays ? `${simpleQuote.estimatedDays} days` : 'Confirmed after booking'),
          estimatedDays: simpleQuote.estimatedDays ?? null,
        }],
      };
    },
    initiatePayment: async (payload: any): Promise<any> => {
      return requestStorefront('/payment/initiate', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    verifyPayment: async (payload: {
      erpOrderId: string;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }): Promise<{ success: boolean; erpOrderId: string; orderNumber?: string }> => {
      return requestStorefront('/payment/verify', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    getOrder: async (id: string): Promise<StorefrontOrder | null> => fetchFromERP<StorefrontOrder | null>(`/commerce/order/${encodeURIComponent(id)}`, null)
  },
  customerAuth: {
    requestMagicLink: async (email: string): Promise<{ success: boolean; message?: string }> => {
      return requestStorefront('/auth/magic-link', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    },
    googleStartUrl: '/api/storefront/auth/google',
    signup: async (name: string, email: string, password: string): Promise<any> => {
      return requestERP('/storefront/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
    },
    login: async (email: string, password: string): Promise<any> => {
      return requestERP('/storefront/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },
    me: async (accessToken: string): Promise<any> => {
      return requestStorefront('/auth/me', {
        headers: { 'X-Customer-Token': accessToken }
      });
    }
  }
};
