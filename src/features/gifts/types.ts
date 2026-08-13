import type { Product } from '@/lib/api';

export type GiftBudgetMode = 'total' | 'per-gift';
export type GiftDeliveryWindow = 'no-rush' | 'two-days' | 'three-five-days' | 'one-week' | 'date';
export type GiftRecommendationKind = 'best-match' | 'best-value' | 'something-special';

export interface GiftIntent {
  giftType: 'single' | 'hamper';
  occasion: string;
  recipient: string;
  budget: number;
  budgetMode: GiftBudgetMode;
  quantity: number;
  styles: string[];
  personalisation: string;
  personalisationText: string;
  packagingId: string;
  deliveryWindow: GiftDeliveryWindow;
  requiredDate: string;
  allowSmallOverage: boolean;
  naturalLanguage: string;
}

export interface GiftPackagingOption {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  preparationDays: number;
  availability: 'available' | 'confirmation-required';
  imageStyle: 'standard' | 'premium' | 'eco' | 'wedding' | 'festive' | 'corporate';
}

export interface GiftCandidateProduct {
  product: Product;
  occasionTags: string[];
  recipientTags: string[];
  styleTags: string[];
  personalisationOptions: string[];
  productionDays: number | null;
  productionStatus: 'ready-stock' | 'made-to-order' | 'confirmation-required';
}

export interface GiftPriceBreakdown {
  products: number;
  personalisation: number;
  packaging: number;
  delivery: number;
  tax: number;
  total: number;
  budget: number;
  remaining: number;
}

export interface GiftRecommendation {
  id: string;
  kind: GiftRecommendationKind;
  label: string;
  items: GiftCandidateProduct[];
  quantity: number;
  reason: string;
  packaging: GiftPackagingOption;
  personalisation: string;
  dispatchMessage: string;
  stockMessage: string;
  score: number;
  pricing: GiftPriceBreakdown;
  additions: GiftCandidateProduct[];
}

export interface GiftRecommendationResult {
  intent: GiftIntent;
  recommendations: GiftRecommendation[];
  eligibleProductCount: number;
  excluded: {
    stock: number;
    budget: number;
    personalisation: number;
    delivery: number;
    quantity: number;
  };
  message: string;
  relaxations: Array<'delivery' | 'personalisation' | 'budget' | 'quantity' | 'style'>;
}

export interface GiftCartBundle {
  id: string;
  createdAt: string;
  recommendationKind: GiftRecommendationKind;
  occasion: string;
  recipient: string;
  budget: number;
  budgetMode: GiftBudgetMode;
  quantity: number;
  requiredDate?: string;
  items: Array<{ productId: string; name: string; quantity: number; unitPrice: number }>;
  packaging: { id: string; name: string; unitPrice: number; total: number };
  personalisation: { type: string; request?: string; unitPrice: number; total: number };
  pricing: GiftPriceBreakdown;
  museReason: string;
}

export const defaultGiftIntent: GiftIntent = {
  giftType: 'single',
  occasion: '',
  recipient: '',
  budget: 2000,
  budgetMode: 'total',
  quantity: 1,
  styles: [],
  personalisation: 'none',
  personalisationText: '',
  packagingId: 'standard-wrap',
  deliveryWindow: 'no-rush',
  requiredDate: '',
  allowSmallOverage: false,
  naturalLanguage: '',
};
