import { isStorefrontInventoryProduct, type Product } from '@/lib/api';
import type {
  GiftCandidateProduct,
  GiftIntent,
  GiftPackagingOption,
  GiftRecommendation,
  GiftRecommendationKind,
  GiftRecommendationResult,
} from './types';

export const GIFT_PACKAGING: GiftPackagingOption[] = [
  { id: 'standard-wrap', name: 'Standard Gift Wrap', description: 'Neat studio wrapping with a message card.', unitPrice: 0, preparationDays: 0, availability: 'available', imageStyle: 'standard' },
  { id: 'premium-wrap', name: 'Premium Gift Wrap', description: 'Premium layered wrapping and handwritten Artzy card.', unitPrice: 500, preparationDays: 1, availability: 'available', imageStyle: 'premium' },
  { id: 'eco-packaging', name: 'Eco-Friendly Packaging', description: 'Low-plastic kraft presentation; studio confirmation required.', unitPrice: 0, preparationDays: 1, availability: 'confirmation-required', imageStyle: 'eco' },
  { id: 'wedding-packaging', name: 'Wedding Packaging', description: 'Celebration styling matched to the wedding palette.', unitPrice: 0, preparationDays: 2, availability: 'confirmation-required', imageStyle: 'wedding' },
  { id: 'festive-packaging', name: 'Festive Packaging', description: 'Festive presentation planned for the selected occasion.', unitPrice: 0, preparationDays: 2, availability: 'confirmation-required', imageStyle: 'festive' },
  { id: 'corporate-packaging', name: 'Corporate Packaging', description: 'Brand-aware presentation for business gifting.', unitPrice: 0, preparationDays: 2, availability: 'confirmation-required', imageStyle: 'corporate' },
];

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const includesAny = (haystack: string, needles: string[]) => needles.some((needle) => haystack.includes(needle));
const unique = <T,>(values: T[]) => Array.from(new Set(values));

const OCCASION_RULES: Array<[string, string[]]> = [
  ['birthday', ['birthday', 'birth day']], ['anniversary', ['anniversary']], ['wedding', ['wedding', 'marriage', 'couple']],
  ['housewarming', ['housewarming', 'new home']], ['baby-shower', ['baby shower']], ['corporate', ['corporate', 'business']],
  ['employee', ['employee', 'staff', 'team']], ['client', ['client']], ['festival', ['diwali', 'festival', 'festive']],
  ['thank-you', ['thank you', 'gratitude']], ['farewell', ['farewell', 'retirement']], ['teacher', ['teacher']],
  ['friendship', ['friend', 'friendship']], ['return-gift', ['return gift']],
];

const RECIPIENT_RULES: Array<[string, string[]]> = [
  ['her', ['wife', 'sister', 'mother', 'mom', 'daughter', 'woman', 'her']], ['him', ['husband', 'brother', 'father', 'dad', 'son', 'man', 'him']],
  ['couple', ['couple', 'newlywed']], ['child', ['child', 'kid', 'boy', 'girl']], ['parents', ['parents']], ['friend', ['friend']],
  ['colleague', ['colleague', 'coworker']], ['employee', ['employee', 'staff', 'team']], ['client', ['client']], ['teacher', ['teacher']], ['family', ['family']],
];

const STYLE_WORDS = ['handmade', 'artistic', 'colourful', 'colorful', 'elegant', 'minimal', 'traditional', 'contemporary', 'premium', 'eco-friendly', 'cute', 'decorative', 'functional'];

export function parseGiftIntent(text: string, current: GiftIntent): GiftIntent {
  const source = normalise(text);
  const giftType = includesAny(source, ['hamper', 'gift box', 'gift set', 'curated box', 'combination gift']) ? 'hamper' : current.giftType;
  const occasion = OCCASION_RULES.find(([, words]) => includesAny(source, words))?.[0] || current.occasion;
  const recipient = RECIPIENT_RULES.find(([, words]) => includesAny(source, words))?.[0] || current.recipient;
  const quantityMatch = source.match(/(?:need|for|quantity|qty)\s*(\d{1,4})\b|\b(\d{1,4})\s*(?:gifts|employees|clients|people|pieces)/);
  const quantity = Math.max(1, Number(quantityMatch?.[1] || quantityMatch?.[2] || current.quantity || 1));
  const moneyMatches = Array.from(text.matchAll(/(?:₹|rs\.?|inr)?\s*([\d,]{2,})/gi)).map((match) => Number(match[1].replace(/,/g, ''))).filter(Boolean);
  const budget = moneyMatches.find((value) => value !== quantity) || current.budget;
  const mentionsPerGift = /per\s*(gift|piece|employee|client)/i.test(text);
  const mentionsTotal = /\btotal\b|within\s+(?:₹|rs|inr)?/i.test(text) && !mentionsPerGift;
  const budgetMode = mentionsPerGift ? 'per-gift' : mentionsTotal || quantity === 1 ? 'total' : current.budgetMode;
  const styles = unique([
    ...current.styles,
    ...STYLE_WORDS.filter((style) => source.includes(normalise(style))).map((style) => style === 'colorful' ? 'colourful' : style),
  ]);
  const personalisation = includesAny(source, ['personalised', 'personalized', 'custom name', 'with name']) ? 'name' : current.personalisation;

  return { ...current, giftType, occasion, recipient, quantity, budget, budgetMode, styles, personalisation, naturalLanguage: text };
}

function derivedTags(product: Product): Pick<GiftCandidateProduct, 'occasionTags' | 'recipientTags' | 'styleTags'> {
  const source = normalise(`${product.name} ${product.category} ${product.sourceCategory || ''} ${(product.style || []).join(' ')}`);
  const occasionTags = ['birthday', 'anniversary', 'wedding', 'housewarming', 'thank-you', 'farewell', 'friendship'];
  if (includesAny(source, ['candle', 'diwali', 'agarbatti', 'dhup', 'saraswati', 'festive'])) occasionTags.push('festival', 'corporate', 'employee', 'client');
  if (includesAny(source, ['coaster', 'spoon', 'stand', 'holder', 'table'])) occasionTags.push('corporate', 'employee', 'client', 'return-gift');
  if (includesAny(source, ['wall', 'frame', 'mirror', 'artwork', 'painting'])) occasionTags.push('wedding', 'housewarming', 'anniversary');

  const recipientTags = ['her', 'him', 'couple', 'parents', 'friend', 'colleague', 'family'];
  if (includesAny(source, ['colour', 'cute', 'fish', 'animal'])) recipientTags.push('child');
  if (includesAny(source, ['corporate', 'coaster', 'pen stand', 'table'])) recipientTags.push('employee', 'client', 'teacher');

  const styleTags = ['handmade', 'artistic'];
  if (includesAny(source, ['handpainted', 'hand painted', 'colour', 'color'])) styleTags.push('colourful');
  if (includesAny(source, ['madhubani', 'warli', 'rajasthani', 'saraswati', 'traditional'])) styleTags.push('traditional');
  if (includesAny(source, ['mirror', 'frame', 'decorative', 'wall'])) styleTags.push('decorative', 'elegant');
  if (includesAny(source, ['stand', 'holder', 'coaster', 'spoon', 'table', 'utility'])) styleTags.push('functional');
  return { occasionTags: unique(occasionTags), recipientTags: unique(recipientTags), styleTags: unique(styleTags) };
}

export function toGiftCandidate(product: Product): GiftCandidateProduct | null {
  if (!isStorefrontInventoryProduct(product)) return null;
  const explicitLead = Number.parseInt(product.leadTime || '', 10);
  return {
    product,
    ...derivedTags(product),
    personalisationOptions: product.personalizationOptions || [],
    productionDays: Number.isFinite(explicitLead) ? explicitLead : null,
    productionStatus: product.availability === 'made_to_order' ? 'made-to-order' : product.leadTime ? 'ready-stock' : 'confirmation-required',
  };
}

const perGiftBudget = (intent: GiftIntent) => intent.budgetMode === 'per-gift' ? intent.budget : Math.floor(intent.budget / Math.max(1, intent.quantity));
const totalBudget = (intent: GiftIntent) => intent.budgetMode === 'per-gift' ? intent.budget * intent.quantity : intent.budget;
const priceOf = (candidate: GiftCandidateProduct) => candidate.product.salePrice && candidate.product.salePrice > 0 ? candidate.product.salePrice : candidate.product.price;

function relevance(candidate: GiftCandidateProduct, intent: GiftIntent): number {
  let score = 10;
  if (intent.occasion && candidate.occasionTags.includes(intent.occasion)) score += 24;
  if (intent.recipient && candidate.recipientTags.includes(intent.recipient)) score += 16;
  score += intent.styles.filter((style) => candidate.styleTags.includes(style)).length * 10;
  score += Math.min(8, Number(candidate.product.quantity || 0));
  return score;
}

function deliveryEligible(candidate: GiftCandidateProduct, intent: GiftIntent, packaging: GiftPackagingOption): boolean {
  if (intent.deliveryWindow === 'no-rush') return true;
  if (intent.deliveryWindow === 'two-days') return candidate.productionDays !== null && candidate.productionDays + packaging.preparationDays <= 1;
  if (intent.deliveryWindow === 'three-five-days') return candidate.productionDays !== null && candidate.productionDays + packaging.preparationDays <= 3;
  if (intent.deliveryWindow === 'one-week') return candidate.productionDays === null || candidate.productionDays + packaging.preparationDays <= 5;
  if (!intent.requiredDate) return true;
  const days = Math.ceil((new Date(intent.requiredDate).getTime() - Date.now()) / 86400000);
  return days >= 7 || (candidate.productionDays !== null && candidate.productionDays + packaging.preparationDays + 2 <= days);
}

function buildRecommendation(
  kind: GiftRecommendationKind,
  items: GiftCandidateProduct[],
  intent: GiftIntent,
  packaging: GiftPackagingOption,
  score: number,
): GiftRecommendation {
  const quantity = Math.max(1, intent.quantity);
  const productUnit = items.reduce((sum, item) => sum + priceOf(item), 0);
  const products = productUnit * quantity;
  const packagingTotal = packaging.unitPrice * quantity;
  const personalisation = 0;
  const total = products + packagingTotal + personalisation;
  const budget = totalBudget(intent);
  const labels: Record<GiftRecommendationKind, string> = { 'best-match': 'Best Match', 'best-value': 'Best Value', 'something-special': 'Something Special' };
  const matchedStyles = unique(items.flatMap((item) => item.styleTags).filter((tag) => intent.styles.includes(tag)));
  const reason = kind === 'best-value'
    ? `Uses the budget carefully with ${items.length === 1 ? 'one useful studio piece' : `${items.length} complementary studio pieces`}.`
    : kind === 'something-special'
      ? `A more artistic ${items.length > 1 ? 'combination' : 'choice'} from the current studio catalogue.`
      : `Strong fit for ${[intent.occasion, intent.recipient, ...matchedStyles].filter(Boolean).join(', ') || 'your gifting brief'}.`;
  return {
    id: `${kind}-${items.map((item) => item.product.id).join('-')}`,
    kind,
    label: labels[kind],
    items,
    quantity,
    reason,
    packaging,
    personalisation: intent.personalisation,
    dispatchMessage: items.every((item) => item.productionDays !== null) ? 'Estimated dispatch shown from catalogue lead time; delivery is confirmed at checkout.' : 'Studio dispatch confirmation required before an exact date is promised.',
    stockMessage: quantity > 1 ? `${quantity} matching units verified in current stock.` : 'Available in current studio stock.',
    score,
    pricing: { products, personalisation, packaging: packagingTotal, delivery: 0, tax: 0, total, budget, remaining: budget - total },
    additions: [],
  };
}

export function recommendGifts(products: Product[], intent: GiftIntent, packagingOptions = GIFT_PACKAGING): GiftRecommendationResult {
  const packaging = packagingOptions.find((item) => item.id === intent.packagingId && item.availability === 'available') || packagingOptions[0];
  const candidates = products.map(toGiftCandidate).filter((item): item is GiftCandidateProduct => Boolean(item));
  const excluded = { stock: products.length - candidates.length, budget: 0, personalisation: 0, delivery: 0, quantity: 0 };
  const budgetEach = perGiftBudget(intent);
  const needsPersonalisation = intent.personalisation !== 'none';

  const feasible = candidates.filter((candidate) => {
    if (Number(candidate.product.quantity || 0) < intent.quantity) { excluded.quantity += 1; return false; }
    if (needsPersonalisation && !candidate.personalisationOptions.includes(intent.personalisation)) { excluded.personalisation += 1; return false; }
    if (!deliveryEligible(candidate, intent, packaging)) { excluded.delivery += 1; return false; }
    if (priceOf(candidate) + packaging.unitPrice > budgetEach) { excluded.budget += 1; return false; }
    return true;
  }).sort((a, b) => relevance(b, intent) - relevance(a, intent) || priceOf(a) - priceOf(b));

  const pool = feasible.slice(0, 28);
  const combos: Array<{ items: GiftCandidateProduct[]; score: number; unitTotal: number }> = [];
  for (const item of pool) combos.push({ items: [item], score: relevance(item, intent), unitTotal: priceOf(item) });
  if (intent.quantity === 1) {
    for (let a = 0; a < Math.min(pool.length, 18); a += 1) for (let b = a + 1; b < Math.min(pool.length, 18); b += 1) {
      const items = [pool[a], pool[b]];
      const unitTotal = items.reduce((sum, item) => sum + priceOf(item), 0);
      if (unitTotal + packaging.unitPrice <= budgetEach) combos.push({ items, unitTotal, score: relevance(pool[a], intent) + relevance(pool[b], intent) + 5 });
    }
    for (let a = 0; a < Math.min(pool.length, 10); a += 1) for (let b = a + 1; b < Math.min(pool.length, 10); b += 1) for (let c = b + 1; c < Math.min(pool.length, 10); c += 1) {
      const items = [pool[a], pool[b], pool[c]];
      const unitTotal = items.reduce((sum, item) => sum + priceOf(item), 0);
      if (unitTotal + packaging.unitPrice <= budgetEach) combos.push({ items, unitTotal, score: items.reduce((sum, item) => sum + relevance(item, intent), 0) + 8 });
    }
  }

  const eligibleCombos = intent.giftType === 'hamper' ? combos.filter((combo) => combo.items.length >= 2) : combos;
  const byMatch = [...eligibleCombos].sort((a, b) => b.score - a.score || b.unitTotal - a.unitTotal);
  const byValue = [...eligibleCombos].sort((a, b) => b.unitTotal - a.unitTotal || b.score - a.score);
  const bySpecial = [...eligibleCombos].sort((a, b) => b.items.length - a.items.length || b.score - a.score || b.unitTotal - a.unitTotal);
  const chosen: Array<[GiftRecommendationKind, typeof combos[number] | undefined]> = [
    ['best-match', byMatch[0]], ['best-value', byValue.find((combo) => combo.items.map((item) => item.product.id).join() !== byMatch[0]?.items.map((item) => item.product.id).join()) || byValue[0]],
    ['something-special', bySpecial.find((combo) => ![byMatch[0], byValue[0]].includes(combo)) || bySpecial[0]],
  ];
  const seen = new Set<string>();
  const recommendations = chosen.flatMap(([kind, combo]) => {
    if (!combo) return [];
    const key = combo.items.map((item) => item.product.id).sort().join('|');
    if (seen.has(key)) return [];
    seen.add(key);
    return [buildRecommendation(kind, combo.items, intent, packaging, combo.score)];
  });
  for (const recommendation of recommendations) {
    recommendation.additions = feasible.filter((candidate) => !recommendation.items.some((item) => item.product.id === candidate.product.id) && priceOf(candidate) * intent.quantity <= recommendation.pricing.remaining).slice(0, 3);
  }

  const relaxations: GiftRecommendationResult['relaxations'] = [];
  if (!recommendations.length) {
    if (excluded.delivery) relaxations.push('delivery');
    if (excluded.personalisation) relaxations.push('personalisation');
    if (excluded.quantity) relaxations.push('quantity');
    if (excluded.budget) relaxations.push('budget');
    if (intent.styles.length) relaxations.push('style');
  }
  const message = recommendations.length
    ? `${recommendations.length} validated gift plan${recommendations.length === 1 ? '' : 's'} found within ${intent.budgetMode === 'per-gift' ? 'the per-gift' : 'your total'} budget.`
    : needsPersonalisation && excluded.personalisation
      ? 'No current ERP product confirms the requested personalisation. Remove personalisation to see ready-stock gifts, or send the studio a custom brief.'
      : intent.quantity > 1 && excluded.quantity
        ? 'Current verified stock cannot fulfil that quantity as one repeated gift. Reduce the quantity or ask the studio to confirm made-to-order capacity.'
        : intent.giftType === 'hamper'
          ? 'No ERP-verified combination currently fits this hamper brief and budget. Increase the budget or ask Artzy Muse and the studio to imagine a made-for-you hamper.'
          : 'No verified gift exactly matches every requirement. Relax one option below to see the closest safe alternative.';
  return { intent, recommendations, eligibleProductCount: feasible.length, excluded, message, relaxations };
}
