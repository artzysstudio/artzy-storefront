'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { defaultGiftIntent, type GiftCartBundle, type GiftIntent, type GiftRecommendation } from './types';
import { GIFT_PACKAGING, parseGiftIntent, recommendGifts } from './giftEngine';

const steps = ['Who & occasion', 'Budget', 'Look & wrapping', 'Delivery'];
const stepHelp = [
  'Choose the person and the moment. Pick the closest answers—there is no wrong choice.',
  'Tell us the quantity and a comfortable limit. Recommendations stay within it.',
  'Style is optional. Choose any moods you like and one available wrapping finish.',
  'Choose a comfortable delivery window. The studio confirms the final date before payment.',
];
const quickStarts: Array<{ label: string; note: string; intent: Partial<GiftIntent> }> = [
  { label: 'Birthday delight', note: 'Colourful · under ₹1,500', intent: { occasion: 'birthday', recipient: 'friend', budget: 1500, styles: ['colourful', 'artistic'] } },
  { label: 'Wedding keepsake', note: 'Elegant · for a couple', intent: { occasion: 'wedding', recipient: 'couple', budget: 3000, styles: ['elegant', 'decorative'] } },
  { label: 'New-home warmth', note: 'Useful art · under ₹2,000', intent: { occasion: 'housewarming', recipient: 'family', budget: 2000, styles: ['functional', 'decorative'] } },
  { label: 'A heartfelt thank-you', note: 'Small, artistic gesture', intent: { occasion: 'thank-you', recipient: 'friend', budget: 1000, styles: ['handmade', 'artistic'] } },
  { label: 'Team & client gifts', note: 'Start with quantity and budget', intent: { occasion: 'corporate', recipient: 'employee', quantity: 10, budget: 10000, styles: ['functional'], budgetMode: 'total' } },
];
const occasions = ['Birthday', 'Anniversary', 'Wedding', 'Housewarming', 'Baby shower', 'Festival', 'Thank you', 'Farewell', 'Corporate', 'Return gift'];
const recipients = ['Her', 'Him', 'Couple', 'Child', 'Parents', 'Friend', 'Colleague', 'Employee', 'Client', 'Teacher', 'Family'];
const styles = ['Handmade', 'Artistic', 'Colourful', 'Elegant', 'Minimal', 'Traditional', 'Contemporary', 'Premium', 'Eco-friendly', 'Cute', 'Decorative', 'Functional'];
const deliveryOptions: Array<[GiftIntent['deliveryWindow'], string, string]> = [
  ['no-rush', 'No rush', 'Let the studio confirm the best timeline'],
  ['two-days', 'Within 2 days', 'Only confirmed fast-dispatch pieces'],
  ['three-five-days', '3–5 days', 'Ready products with verified lead time'],
  ['one-week', 'Within 1 week', 'A wider ready-stock selection'],
  ['date', 'Choose a date', 'We validate the date before recommending'],
];
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const slug = (value: string) => value.toLowerCase().replace(/\s+/g, '-');

export default function GiftBuilder({ products }: { products: Product[] }) {
  const [intent, setIntent] = useState(defaultGiftIntent);
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [addedId, setAddedId] = useState('');
  const { addGiftBundle } = useCart();
  const { trackEvent } = useAnalytics();
  const result = useMemo(() => recommendGifts(products, intent), [products, intent]);
  const set = <K extends keyof GiftIntent>(key: K, value: GiftIntent[K]) => setIntent((old) => ({ ...old, [key]: value }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedOccasion = params.get('occasion');
    const requestedMode = params.get('mode');
    if (requestedOccasion) {
      setIntent((current) => ({ ...current, occasion: requestedOccasion }));
      setStep(0);
    } else if (requestedMode === 'personalised') {
      setStep(2);
    } else if (requestedMode === 'hampers') {
      setStep(2);
    }
  }, []);

  useEffect(() => {
    if (window.location.hash !== '#gift-finder') return;
    const align = () => document.getElementById('gift-finder')?.scrollIntoView({ block: 'start' });
    const initialAlignment = window.setTimeout(align, 120);
    const settledAlignment = window.setTimeout(align, 900);
    return () => {
      window.clearTimeout(initialAlignment);
      window.clearTimeout(settledAlignment);
    };
  }, []);

  const showRecommendations = () => {
    setShowResults(true);
    trackEvent({ eventName: 'gift_recommendations_viewed', properties: { count: result.recommendations.length, shortcut: step < steps.length - 1 } });
    requestAnimationFrame(() => document.querySelector('.gift-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const next = () => {
    trackEvent({ eventName: 'gift_builder_step_completed', properties: { step: steps[step], occasion: intent.occasion, quantity: intent.quantity } });
    if (step === steps.length - 1) showRecommendations();
    else setStep((value) => value + 1);
  };
  const canContinue = step === 0
    ? Boolean(intent.occasion && intent.recipient)
    : step === 1
      ? intent.budget > 0 && intent.quantity > 0
      : true;

  const addPlan = (recommendation: GiftRecommendation, withAddition = false) => {
    const addition = withAddition ? recommendation.additions[0] : undefined;
    const selectedItems = addition ? [...recommendation.items, addition] : recommendation.items;
    const additionTotal = addition ? (addition.product.salePrice || addition.product.price) * intent.quantity : 0;
    const pricing = { ...recommendation.pricing, products: recommendation.pricing.products + additionTotal, total: recommendation.pricing.total + additionTotal, remaining: recommendation.pricing.remaining - additionTotal };
    const bundle: GiftCartBundle = {
      id: `gift-${Date.now()}`,
      createdAt: new Date().toISOString(),
      recommendationKind: recommendation.kind,
      occasion: intent.occasion,
      recipient: intent.recipient,
      budget: intent.budget,
      budgetMode: intent.budgetMode,
      quantity: intent.quantity,
      requiredDate: intent.requiredDate || undefined,
      items: selectedItems.map(({ product }) => ({ productId: product.id, name: product.name, quantity: intent.quantity, unitPrice: product.salePrice || product.price })),
      packaging: { id: recommendation.packaging.id, name: recommendation.packaging.name, unitPrice: recommendation.packaging.unitPrice, total: recommendation.pricing.packaging },
      personalisation: { type: intent.personalisation, request: intent.personalisationText || undefined, unitPrice: 0, total: 0 },
      pricing,
      museReason: recommendation.reason,
    };
    addGiftBundle(bundle);
    setAddedId(recommendation.id);
    trackEvent({ eventName: 'gift_bundle_added_to_cart', properties: { recommendation: recommendation.kind, total: pricing.total, quantity: intent.quantity } });
  };

  const useMuse = () => {
    const parsed = parseGiftIntent(intent.naturalLanguage, intent);
    setIntent(parsed);
    setStep(parsed.occasion && parsed.recipient ? 1 : 0);
    trackEvent({ eventName: 'gift_muse_prompt_submitted', properties: { promptLength: intent.naturalLanguage.length } });
  };

  const applyQuickStart = (preset: (typeof quickStarts)[number]) => {
    setIntent((current) => ({ ...current, ...preset.intent }));
    setStep(1);
    setShowResults(false);
    trackEvent({ eventName: 'gift_quick_start_selected', properties: { preset: preset.label } });
    requestAnimationFrame(() => document.querySelector('.gift-builder__shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return <section className="gift-builder" id="gift-finder" aria-labelledby="gift-builder-title">
    <div className="gift-quick-start" id="gift-quick-start">
      <div className="gift-quick-start__heading"><span className="gift-kicker">A simple place to begin</span><h2>What kind of help do you need?</h2><p>Choose a popular path and we&apos;ll prepare the details for you. You can change every answer before adding anything to your bag.</p></div>
      <div className="gift-quick-start__options">{quickStarts.map((preset, index) => <button type="button" key={preset.label} onClick={() => applyQuickStart(preset)}><span>{String(index + 1).padStart(2, '0')}</span><b>{preset.label}</b><small>{preset.note}</small><i>Start here →</i></button>)}</div>
      <div className="gift-how-it-works"><span><b>1</b> Choose who and why</span><span><b>2</b> Set a comfortable budget</span><span><b>3</b> See real in-stock gift plans</span></div>
    </div>
    <div className="gift-builder__intro">
      <div><span className="gift-kicker">Artzy Gift Concierge</span><h2 id="gift-builder-title">A thoughtful gift plan,<br/><em>built around your person.</em></h2><p>Tell us the moment, budget and mood. We check real ERP stock first, then rank practical ideas from Deepti&apos;s studio.</p></div>
      <div className="gift-muse-box">
        <label htmlFor="gift-muse">Describe the gift in your own words</label>
        <textarea id="gift-muse" value={intent.naturalLanguage} onChange={(event) => set('naturalLanguage', event.target.value)} placeholder="10 artistic gifts for employees, ₹15,000 total, premium wrapping" rows={3}/>
        <button type="button" onClick={useMuse} disabled={!intent.naturalLanguage.trim()}>Let Artzy Muse understand</button>
        <small>Muse interprets your brief. Stock, prices and capabilities are always validated against the ERP catalogue.</small>
      </div>
    </div>

    <div className="gift-progress" aria-label={`Step ${step + 1} of ${steps.length}`}><span style={{ width: `${((step + 1) / steps.length) * 100}%` }}/></div>
    <div className="gift-builder__shell">
      <nav className="gift-steps" aria-label="Gift builder steps">{steps.map((label, index) => <button key={label} type="button" disabled={index > step} aria-current={index === step ? 'step' : undefined} className={index === step ? 'active' : index < step ? 'complete' : ''} onClick={() => setStep(index)}><b>{String(index + 1).padStart(2, '0')}</b>{label}</button>)}</nav>
      <div className="gift-step-panel">
        <div className="gift-step-heading"><span>Step {step + 1} of {steps.length}</span><h3>{steps[step]}</h3><p>{stepHelp[step]}</p></div>
        {step === 0 && <div className="gift-who-fields"><label>What is the occasion?<select value={intent.occasion} onChange={(event) => set('occasion', event.target.value)}><option value="">Choose the closest occasion</option>{occasions.map((value) => <option value={slug(value)} key={value}>{value}</option>)}</select></label><label>Who is it for?<select value={intent.recipient} onChange={(event) => set('recipient', event.target.value)}><option value="">Choose a person or group</option>{recipients.map((value) => <option value={slug(value)} key={value}>{value}</option>)}</select></label><p>You can change both answers later. If nothing fits exactly, choose the closest option and the studio can refine it with you.</p></div>}
        {step === 1 && <div className="gift-form-grid"><label>How many gifts?<input type="number" min="1" max="500" value={intent.quantity} onChange={(e) => set('quantity', Math.max(1, Number(e.target.value)))}/></label><label>Comfortable budget<input type="number" min="100" step="100" value={intent.budget} onChange={(e) => set('budget', Math.max(0, Number(e.target.value)))}/></label><fieldset><legend>This budget is</legend><label><input type="radio" checked={intent.budgetMode === 'total'} onChange={() => set('budgetMode', 'total')}/> Total for all gifts</label><label><input type="radio" checked={intent.budgetMode === 'per-gift'} onChange={() => set('budgetMode', 'per-gift')}/> For each gift</label></fieldset></div>}
        {step === 2 && <div className="gift-combined-step"><section><h4>Choose a look <small>Optional—skip if unsure</small></h4><ChoiceGrid values={styles} selected={intent.styles} multiple onSelect={(value) => { const id = slug(value); set('styles', intent.styles.includes(id) ? intent.styles.filter((item) => item !== id) : [...intent.styles, id]); }}/></section><section><h4>How should it arrive?</h4><div className="gift-packaging-grid">{GIFT_PACKAGING.map((pack) => <label className={pack.availability !== 'available' ? 'unavailable' : ''} key={pack.id}><input type="radio" name="packaging" disabled={pack.availability !== 'available'} checked={intent.packagingId === pack.id} onChange={() => set('packagingId', pack.id)}/><span className={`gift-wrap-swatch ${pack.imageStyle}`}>✿</span><b>{pack.name}</b><small>{pack.description}</small><em>{pack.availability === 'available' ? pack.unitPrice ? `${money(pack.unitPrice)} per gift` : 'Included' : 'Ask the studio after choosing a gift'}</em></label>)}</div></section><p className="gift-capability-note"><b>Want a name, message or custom artwork?</b> First choose a suitable real product. The studio will confirm what can be personalised before you pay. <Link href="/personalised">See personalised options →</Link></p></div>}
        {step === 3 && <div className="gift-delivery-grid">{deliveryOptions.map(([id, title, copy]) => <label key={id}><input type="radio" checked={intent.deliveryWindow === id} onChange={() => set('deliveryWindow', id)}/><span><b>{title}</b><small>{copy}</small></span></label>)}{intent.deliveryWindow === 'date' && <label className="gift-date">Preferred date<input type="date" value={intent.requiredDate} min={new Date().toISOString().slice(0, 10)} onChange={(event) => set('requiredDate', event.target.value)}/><small>The studio confirms feasibility before payment.</small></label>}</div>}
        <div className="gift-step-actions">{step > 0 && <button type="button" className="secondary" onClick={() => setStep((value) => value - 1)}>Back</button>}{step >= 1 && step < steps.length - 1 && <button type="button" className="quick-result" onClick={showRecommendations}>Show suitable gifts now</button>}<button type="button" className="primary" disabled={!canContinue} onClick={next}>{step === steps.length - 1 ? 'Show my gift ideas' : step === 2 ? 'Continue—style can be skipped' : 'Continue'}</button></div>
      </div>
      <aside className="gift-live-summary"><span>Your gift brief</span><dl><div><dt>For</dt><dd>{intent.recipient || 'Choose recipient'}</dd></div><div><dt>Moment</dt><dd>{intent.occasion || 'Choose occasion'}</dd></div><div><dt>Quantity</dt><dd>{intent.quantity}</dd></div><div><dt>Budget</dt><dd>{money(intent.budget)} {intent.budgetMode === 'per-gift' ? 'each' : 'total'}</dd></div></dl><p>Recommendations only use photographed products with verified current stock.</p></aside>
    </div>

    {showResults && <div className="gift-results" aria-live="polite"><header><span className="gift-kicker">Validated against current catalogue</span><h2>Your Artzy gift plans</h2><p>{result.message}</p></header>{result.recommendations.length ? <div className="gift-result-grid">{result.recommendations.map((recommendation) => <article className="gift-result-card" key={recommendation.id}><span className="gift-result-label">{recommendation.label}</span><div className="gift-result-images">{recommendation.items.slice(0,3).map(({product}) => <Image key={product.id} src={product.images[0]} alt={product.name} width={240} height={240} unoptimized/>)}</div><h3>{recommendation.items.map(({product}) => product.name).join(' + ')}</h3><p>{recommendation.reason}</p><ul><li>{recommendation.stockMessage}</li><li>{recommendation.packaging.name}</li><li>{recommendation.dispatchMessage}</li></ul><div className="gift-price"><b>{money(recommendation.pricing.total)}</b><span>{money(recommendation.pricing.products)} products + {recommendation.pricing.packaging ? money(recommendation.pricing.packaging) : 'included'} wrap</span><small>{money(recommendation.pricing.remaining)} left in budget</small></div>{recommendation.additions[0] && <button className="use-budget" onClick={() => addPlan(recommendation, true)}>Use more of my budget: add {recommendation.additions[0].product.name}</button>}<button className="add-plan" onClick={() => addPlan(recommendation)}>{addedId === recommendation.id ? 'Added to bag ✓' : `Add full plan to bag`}</button></article>)}</div> : <div className="gift-empty"><h3>No false promises.</h3><p>{result.message}</p><div>{result.relaxations.map((item) => <button key={item} onClick={() => { if(item === 'delivery') set('deliveryWindow','no-rush'); if(item === 'personalisation') set('personalisation','none'); if(item === 'quantity') set('quantity',1); if(item === 'style') set('styles',[]); if(item === 'budget') set('budget',Math.ceil(intent.budget * 1.2)); setShowResults(true); }}>Relax {item}</button>)}</div><Link href="/for-business">Ask the studio for a custom plan →</Link></div>}</div>}
  </section>;
}

function ChoiceGrid({ values, selected, onSelect, multiple = false }: { values: string[]; selected: string[]; onSelect: (value: string) => void; multiple?: boolean }) {
  return <div className="gift-choice-grid">{values.map((value) => { const active = selected.includes(slug(value)); return <button type="button" aria-pressed={active} className={active ? 'selected' : ''} onClick={() => onSelect(value)} key={value}><span>{value.slice(0,1)}</span><b>{value}</b>{multiple && <small>{active ? 'Selected' : 'Choose'}</small>}</button>; })}</div>;
}
