const getEnv = (key: string) => {
  try { return typeof process !== 'undefined' && process.env ? process.env[key] : undefined; } catch (e) { return undefined; }
};
const ERP_BASE_URL = getEnv('NEXT_PUBLIC_ERP_API_URL') || 'https://erp.artzysstudio.in/api';
import erpProductSnapshot from '@/data/erp-products.json';

// Fallback helper with Exponential Backoff Retry Logic
async function fetchFromERP<T>(endpoint: string, fallback: T, retries = 0, delay = 500): Promise<T> {
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
  
  // Merchandising
  relatedProductIds?: string[];
  recommendedPairings?: string[];
  crossSellProductIds?: string[];
  
  // SEO & Social
  seo?: ProductSEO;
  socialSharingImage?: string;
  erpUpdatedAt?: string;
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
    throw new Error(data?.error || `ERP request failed with status ${response.status}`);
  }
  return data as T;
}

// ------------------------------------------------------------------
// MOCK DATA FOR FALLBACK
// ------------------------------------------------------------------

const mockProducts: Product[] = [
  { 
    id: '1', name: 'Golden Hour Horizon', category: 'Original Painting', price: 24999, 
    images: ['/assets/painting_1.png'], 
    artworkStory: 'Inspired by the setting sun over the Arabian Sea.',
    artist: 'Deepti J. Shah',
    collectionId: 'c-original-paintings',
    medium: 'Oil on Canvas', material: 'Canvas, Oil Paint', dimensions: '36x48 inches', weight: '4kg',
    colorPalette: ['Saffron', 'Warm Ivory', 'Soft Gold'], style: ['Contemporary', 'Abstract'],
    occasion: ['Anniversary', 'Wedding'], roomType: ['Living Room', 'Bedroom'],
    leadTime: '7-10 Days', availability: 'in_stock',
    giftWrappingAvailable: true,
    seo: { title: 'Golden Hour Horizon Painting', description: 'Original abstract painting by Deepti J. Shah.', keywords: ['abstract art', 'oil painting', 'sunset'] }
  },
  { 
    id: '2', name: 'Ocean Breath', category: 'Resin Art', price: 38999, 
    images: ['/assets/resin_art_1.png'],
    artist: 'Deepti J. Shah', collectionId: 'c-resin-collection',
    medium: 'Epoxy Resin', material: 'Epoxy Resin on Teak Wood', dimensions: '24x24 inches', weight: '8kg',
    colorPalette: ['Blue', 'Teal', 'Soft Gold'], style: ['Fluid Art', 'Modern'],
    occasion: ['Housewarming', 'Corporate'], roomType: ['Living Room', 'Office'],
    careInstructions: 'Wipe with soft damp cloth. Keep away from direct sunlight.',
    leadTime: '14-21 Days', availability: 'made_to_order',
    seo: { title: 'Ocean Breath Resin Art', description: 'Fluid resin wall art.', keywords: ['resin art', 'ocean art'] }
  },
  { 
    id: '3', name: 'Sands of Time', category: 'Wooden Art', price: 18999, 
    images: ['/assets/hero_bg_authentic.png'],
    artist: 'Deepti J. Shah', collectionId: 'c-wooden-art',
    medium: 'Mixed Media', material: 'Teak Wood & Plaster', dimensions: '18x24 inches', weight: '5kg',
    colorPalette: ['Sand', 'Cream', 'Natural Wood'], style: ['Minimalist', 'Textured'],
    occasion: ['Housewarming'], roomType: ['Bedroom', 'Study'],
    leadTime: 'In Stock', availability: 'in_stock'
  },
  { 
    id: '4', name: 'Midnight Bloom Tray', category: 'Hand-painted Tray', price: 5499, 
    images: ['/assets/corporate_gift_1.png'],
    collectionId: 'c-corporate-gifts',
    material: 'Mango Wood, Resin', dimensions: '14x14 inches', weight: '1.5kg',
    colorPalette: ['Dark Blue', 'Soft Gold'], style: ['Elegant'],
    occasion: ['Corporate', 'Diwali', 'Wedding'], roomType: ['Dining', 'Kitchen'],
    personalizationOptions: ['Engrave Name', 'Custom Logo'],
    giftWrappingAvailable: true, leadTime: '3-5 Days', availability: 'in_stock',
    seo: { title: 'Midnight Bloom Hand-painted Tray', description: 'Elegant resin serving tray for corporate gifting.', keywords: ['resin tray', 'corporate gift'] }
  },
];

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
      content: { title: "Custom Artwork Journey", body: "Commission a piece tailored specifically for your space.", ctaText: "Start a Commission", ctaLink: "/personalized" }
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

// ------------------------------------------------------------------
// EXPORTED API CLIENT
// ------------------------------------------------------------------

export const api = {
  products: {
    // The committed ERP snapshot keeps the static storefront complete. A live
    // feed replaces it automatically whenever the dedicated proxy is enabled.
    list: async (): Promise<Product[]> => fetchFromERP('/products/featured', erpProductSnapshot as Product[]),
    get: async (id: string): Promise<Product | undefined> => fetchFromERP(`/products/${id}`, undefined)
  },
  pages: {
    get: async (slug: string): Promise<PageDefinition | undefined> => {
      // Simulate dynamic routing headless CMS fetch
      const mockPages: Record<string, PageDefinition> = {
        'home': mockHomePage,
        'about': mockAboutPage,
        'projects': mockProjectsPage,
        'inspiration': mockInspirationPage
      };
      const fallback = mockPages[slug];
      return fetchFromERP(`/pages/${slug}`, fallback);
    }
  },
  // We keep these for backwards compatibility or specific component fetches if needed, 
  // but ideally page definitions pass this data down eventually.
  collections: {
    listGifts: async (): Promise<Collection[]> => fetchFromERP('/collections/gifts', [
      { id: 'g1', name: 'Personalized Gifts', slug: 'personalized-gifts', heroImage: '', thumbnailImage: '', description: 'Handcrafted gifts tailored specifically to your loved ones.' },
      { id: 'g2', name: 'Corporate Hampers', slug: 'corporate-hampers', heroImage: '', thumbnailImage: '', description: 'Elegant, bulk-order gifting for the corporate world.' }
    ]),
  },
  testimonials: {
    list: async (): Promise<Testimonial[]> => fetchFromERP('/testimonials', [
      { id: 't1', text: "Deepti's resin art is mesmerizing.", author: "Priya S." }
    ]),
  },
  instagram: {
    listFeed: async (): Promise<InstagramPost[]> => fetchFromERP('/instagram/feed', [
      { id: 'ig1', url: 'ig.com', imageUrl: '' }, { id: 'ig2', url: 'ig.com', imageUrl: '' },
      { id: 'ig3', url: 'ig.com', imageUrl: '' }, { id: 'ig4', url: 'ig.com', imageUrl: '' }
    ]),
  },
  cart: {
    add: async (productId: string, quantity: number) => ({ success: true }),
    get: async () => ({ items: [], total: 0 })
  },
  commerce: {
    calculateShipping: async (items: Array<{ productId: string; quantity: number }>, pincode: string): Promise<ShippingQuote> => {
      return requestERP('/storefront/shipping/quote', {
        method: 'POST',
        body: JSON.stringify({ items, pincode })
      });
    },
    initiatePayment: async (payload: any): Promise<any> => {
      return requestERP('/storefront/payment/initiate', {
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
      return requestERP('/storefront/payment/verify', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    getOrder: async (id: string) => {
      return fetchFromERP(`/orders/${id}`, {
        id,
        status: 'Processing',
        trackingNumber: `AWB${Math.floor(Math.random() * 10000000)}`,
        courier: 'Delhivery',
        date: new Date().toISOString(),
        total: 24999
      }, 1, 200);
    }
  },
  customerAuth: {
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
      return requestERP('/storefront/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    }
  }
};
