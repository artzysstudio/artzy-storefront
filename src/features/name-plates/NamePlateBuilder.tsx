"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import ArtDirectionMark from '@/components/ArtDirectionMark';
import AIConceptPreview from '@/components/AIConceptPreview';
import { ART_DIRECTIONS, type ArtDirectionId } from '@/data/artDirections';
import { useCustomer } from '@/context/CustomerContext';
import { calculateNamePlateEstimate } from './pricing';

type Choice = { name: string; slug: string; price: number; note: string; suitability?: string };
type InspirationDetail = { shape: string; motif: ArtDirectionId; palette: string; source: string };
type DraftResponse = { success?: boolean; reference?: string; draftId?: string; error?: string };

const shapes: Choice[] = [
  { name: 'Classic rectangle', slug: 'classic-rectangle', price: 0, note: 'Balanced and timeless', suitability: 'Works well for most doors and longer family names.' },
  { name: 'Gentle arch', slug: 'gentle-arch', price: 250, note: 'Soft traditional crown', suitability: 'A graceful choice for botanical or lotus artwork.' },
  { name: 'Scalloped', slug: 'scalloped', price: 350, note: 'Decorative curved edge', suitability: 'Best where the plate has generous clear space around it.' },
  { name: 'Oval', slug: 'oval', price: 300, note: 'Graceful compact form', suitability: 'Suited to short names and restrained artwork.' },
];
const motifPrices: Partial<Record<ArtDirectionId, number>> = { botanical: 450, lotus: 450, warli: 650, geometric: 250, madhubani: 750, minimal: 0 };
const motifs = (['botanical', 'lotus', 'warli', 'geometric', 'madhubani', 'minimal'] as ArtDirectionId[]).map((slug) => ({ ...ART_DIRECTIONS[slug], slug, price: motifPrices[slug] ?? 0 }));
const palettes = [
  { name: 'Terracotta rose', slug: 'terracotta', note: 'Warm clay, muted rose and cream.' },
  { name: 'Olive and gold', slug: 'olive', note: 'Earthy green with a restrained golden accent.' },
  { name: 'Indigo folk', slug: 'indigo', note: 'Deep blue with a warm off-white contrast.' },
  { name: 'Warm monochrome', slug: 'monochrome', note: 'Quiet wood, sand and cocoa tones.' },
];
const sizes = [
  { name: 'Compact', slug: 'compact', inches: [12, 6], price: 1690, weight: 'Approx. 0.6–1.0 kg' },
  { name: 'Standard', slug: 'standard', inches: [16, 8], price: 2490, weight: 'Approx. 0.9–1.5 kg' },
  { name: 'Statement', slug: 'statement', inches: [20, 10], price: 3690, weight: 'Approx. 1.4–2.3 kg' },
];
const placements = [
  { name: 'Flat or apartment door', slug: 'door', note: 'Compact, readable and easy to mount.' },
  { name: 'Entrance wall', slug: 'wall', note: 'More space for artwork and a welcome line.' },
  { name: 'Covered gate or veranda', slug: 'covered', note: 'Weather exposure must be reviewed.' },
  { name: 'Desk or reception counter', slug: 'desk', note: 'A supported standing format for home or business.' },
];
const materials: Choice[] = [
  { name: 'Painted engineered-wood base', slug: 'engineered', price: 0, note: 'Smooth detail; ideal indoors or in a protected entrance.' },
  { name: 'Natural wood base', slug: 'wood', price: 850, note: 'Visible grain; clean with a soft dry cloth.' },
  { name: 'Layered wood and acrylic', slug: 'layered', price: 1200, note: 'Raised contemporary finish; avoid unsupported hanging rope.' },
];
const protections: Choice[] = [
  { name: 'Indoor finish', slug: 'indoor', price: 0, note: 'Interior doors, walls and counters.' },
  { name: 'Covered-area protective coat', slug: 'covered', price: 350, note: 'Sheltered entrances away from direct rain.' },
  { name: 'Outdoor suitability review', slug: 'outdoor', price: 0, note: 'Studio review required before material or durability is promised.' },
];
const mountings: Choice[] = [
  { name: 'Hooks / screws', slug: 'hooks', price: 0, note: 'Standard fitting; final hardware depends on the surface.' },
  { name: 'Decorative rope', slug: 'rope', price: 180, note: 'Visible hanging detail for lighter wood bases.' },
  { name: 'Stand-off mounts', slug: 'standoffs', price: 350, note: 'Raised installation for a suitable wall.' },
  { name: 'Counter stand review', slug: 'counter', price: 0, note: 'Studio-confirmed support for a desk or reception counter.' },
];
const stepNames = ['Placement', 'Wording', 'Design', 'Material & size', 'Preview & confirm'];
const inr = new Intl.NumberFormat('en-IN');
const cm = (value: number) => Math.round(value * 2.54 * 10) / 10;
const draftKey = 'artzy_name_plate_draft_v2';

export default function NamePlateBuilder() {
  const { isAuthenticated, user } = useCustomer();
  const [step, setStep] = useState(0);
  const [familyName, setFamilyName] = useState('');
  const [secondLine, setSecondLine] = useState('');
  const [script, setScript] = useState('English');
  const [lettering, setLettering] = useState('Classic serif');
  const [shape, setShape] = useState(shapes[0]);
  const [motif, setMotif] = useState(motifs[0]);
  const [palette, setPalette] = useState(palettes[0]);
  const [size, setSize] = useState(sizes[1]);
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [mounting, setMounting] = useState(mountings[0]);
  const [placement, setPlacement] = useState(placements[0]);
  const [material, setMaterial] = useState(materials[0]);
  const [protection, setProtection] = useState(protections[0]);
  const [covered, setCovered] = useState(true);
  const [rain, setRain] = useState(false);
  const [sun, setSun] = useState(false);
  const [exposureHours, setExposureHours] = useState('0–2 hours');
  const [spellingConfirmed, setSpellingConfirmed] = useState(false);
  const [studioRecommendation, setStudioRecommendation] = useState(false);
  const [source, setSource] = useState('Builder choices');
  const [preferredDate, setPreferredDate] = useState('');
  const [pincode, setPincode] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoConsent, setPhotoConsent] = useState(false);
  const [photoScale, setPhotoScale] = useState(45);
  const [photoPosition, setPhotoPosition] = useState({ x: 50, y: 38 });
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [reference, setReference] = useState('');
  const [artzyAssetId, setArtzyAssetId] = useState<string | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);

  const isExposed = placement.slug === 'covered';
  const displayName = familyName.trim() || 'Example: The Shah Family';
  const nameWarning = familyName.length > 30 ? 'This wording may feel crowded. Consider a second line or a larger size.' : '';
  const dimensions = unit === 'in' ? `${size.inches[0]} × ${size.inches[1]} in` : `${cm(size.inches[0])} × ${cm(size.inches[1])} cm`;
  const estimate = calculateNamePlateEstimate({ size: size.price, shape: shape.price, painting: motif.price, material: material.price, protection: protection.price, mounting: mounting.price });
  const leadTime = motif.slug === 'madhubani' || motif.slug === 'warli' ? '12–18 working days after proof approval' : size.slug === 'statement' ? '10–16 working days after proof approval' : '8–14 working days after proof approval';
  const fittingIncluded = mounting.slug === 'counter' ? 'Support is quoted after studio review' : mounting.slug === 'hooks' ? 'Basic fitting included when technically suitable' : 'Selected fitting included after compatibility confirmation';
  const canContinue = step !== 1 || familyName.trim().length > 0;
  const canSubmit = familyName.trim().length > 0 && spellingConfirmed && /^\d{6}$/.test(pincode);

  const payload = useMemo(() => ({
    type: 'custom_name_plate', status: 'awaiting_studio_review', customer: user ? { id: user.id ?? null, email: user.email } : { guest: true },
    configuration: { placement: placement.name, exposure: isExposed ? { covered, directRain: rain, directSunlight: sun, dailyExposure: exposureHours } : null, exactWording: { main: familyName.trim(), secondLine: secondLine.trim() || null, script, lettering }, shape: shape.name, paintingDirection: motif.name, palette: palette.name, material: material.name, dimensions, protection: protection.name, mounting: mounting.name, inspirationSource: source, studioRecommendationRequested: studioRecommendation },
    spellingConfirmed, artzyAiAssetId: artzyAssetId, doorwayPhoto: photoUrl ? { suppliedForLocalPreview: true, sharingConsent: photoConsent, position: photoPosition, approximateScale: photoScale } : null,
    estimate: { currency: 'INR', base: size.price, shape: shape.price, painting: motif.price, material: material.price, protection: protection.price, mounting: mounting.price, total: estimate, authority: 'ERP confirmation required' },
    preferredDeliveryDate: preferredDate || null, pincode,
  }), [user, placement, isExposed, covered, rain, sun, exposureHours, familyName, secondLine, script, lettering, shape, motif, palette, material, dimensions, protection, mounting, source, studioRecommendation, spellingConfirmed, artzyAssetId, photoUrl, photoConsent, photoPosition, photoScale, size, estimate, preferredDate, pincode]);

  const brief = useMemo(() => [
    "Hello Artzy's Studio, I would like a custom name-plate review.", `Wording: ${familyName.trim() || 'To be confirmed'}${secondLine.trim() ? ` / ${secondLine.trim()}` : ''}`,
    `${placement.name}; ${shape.name}; ${motif.name}; ${palette.name}`, `${material.name}; ${dimensions}; ${protection.name}; ${mounting.name}`,
    `Website estimate: ₹${inr.format(estimate)}. ERP reference: ${reference || 'not created yet'}.`, 'Please confirm feasibility, final price, taxes, production time and delivery.',
  ].join('\n'), [familyName, secondLine, placement, shape, motif, palette, material, dimensions, protection, mounting, estimate, reference]);

  useEffect(() => {
    const onInspiration = (event: Event) => {
      const detail = (event as CustomEvent<InspirationDetail>).detail;
      const nextShape = shapes.find((item) => item.slug === detail.shape);
      const nextMotif = motifs.find((item) => item.slug === detail.motif);
      const nextPalette = palettes.find((item) => item.slug === detail.palette);
      if (nextShape) setShape(nextShape); if (nextMotif) setMotif(nextMotif); if (nextPalette) setPalette(nextPalette);
      setSource(detail.source); setStep(2);
      window.setTimeout(() => document.getElementById('name-plate-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
    };
    const onAsset = (event: Event) => { const detail = (event as CustomEvent<{ tool: string; assetId: string | null }>).detail; if (detail.tool === 'name_plate') setArtzyAssetId(detail.assetId); };
    window.addEventListener('artzy:nameplate-inspiration', onInspiration);
    window.addEventListener('artzy:concept-asset', onAsset);
    return () => { window.removeEventListener('artzy:nameplate-inspiration', onInspiration); window.removeEventListener('artzy:concept-asset', onAsset); };
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(draftKey) || 'null') as { expiresAt?: number; data?: { configuration?: { exactWording?: { main?: string; secondLine?: string | null } } } } | null;
      if (!saved?.expiresAt || saved.expiresAt < Date.now() || !saved.data?.configuration) return;
      const words = saved.data.configuration.exactWording;
      if (words?.main) setFamilyName(words.main);
      if (words?.secondLine) setSecondLine(words.secondLine);
      setSaveStatus('Your saved draft is available. Review every choice before submitting.');
    } catch { /* Ignore malformed local drafts. */ }
  }, []);

  useEffect(() => {
    if (window.location.hash !== '#name-plate-builder') return;
    let restoreFrame = 0;
    const align = () => {
      const target = document.getElementById('name-plate-builder');
      if (!target) return;
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      target.scrollIntoView({ block: 'start' });
      restoreFrame = window.requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });
    };
    const initialAlignment = window.setTimeout(align, 120);
    const settledAlignment = window.setTimeout(align, 900);
    return () => {
      window.clearTimeout(initialAlignment);
      window.clearTimeout(settledAlignment);
      window.cancelAnimationFrame(restoreFrame);
    };
  }, []);

  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl); }, [photoUrl]);

  function selectPlacement(item: typeof placements[number]) { setPlacement(item); if (item.slug === 'desk') setMounting(mountings[3]); else if (mounting.slug === 'counter') setMounting(mountings[0]); }
  function selectMaterial(item: Choice) { setMaterial(item); if (item.slug === 'layered' && mounting.slug === 'rope') setMounting(mountings[0]); }
  function saveDraft(duplicate = false) {
    const entry = { expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, savedAt: Date.now(), data: payload };
    localStorage.setItem(duplicate ? `${draftKey}_${crypto.randomUUID()}` : draftKey, JSON.stringify(entry));
    setSaveStatus(duplicate ? 'A duplicate draft was saved on this device.' : `${isAuthenticated ? 'Account-linked' : 'Private device'} draft saved for 7 days.`);
  }
  function handlePhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 12 * 1024 * 1024) { setSubmitMessage('Choose a JPG, PNG or WebP image under 12 MB.'); return; }
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file)); setPhotoConsent(false);
  }
  function moveOverlay(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPhotoPosition({ x: Math.max(8, Math.min(92, ((event.clientX - rect.left) / rect.width) * 100)), y: Math.max(8, Math.min(86, ((event.clientY - rect.top) / rect.height) * 100)) });
  }
  async function submitDraft() {
    if (!canSubmit) { setSubmitStatus('error'); setSubmitMessage('Confirm the exact spelling and enter a valid 6-digit delivery PIN code.'); return; }
    setSubmitStatus('submitting'); setSubmitMessage('Creating your studio-review request…');
    try {
      const token = localStorage.getItem('artzy_customer_access_token');
      const response = await fetch('/api/storefront/custom-orders', { method: 'POST', headers: { 'content-type': 'application/json', ...(token ? { 'x-customer-token': token } : {}) }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({ error: 'The ERP returned an incomplete response.' })) as DraftResponse;
      if (!response.ok || !result.success) throw new Error(result.error || 'The studio draft could not be created.');
      const nextReference = result.reference || result.draftId || '';
      if (!nextReference) throw new Error('The ERP did not return a tracking reference.');
      setReference(nextReference); setSubmitStatus('success'); setSubmitMessage(`Request ${nextReference} is awaiting studio review.`); localStorage.removeItem(draftKey);
    } catch (reason) {
      setSubmitStatus('error'); setSubmitMessage(`${(reason as Error).message} Your choices remain saved on this device; WhatsApp is available as a fallback.`); saveDraft();
    }
  }

  const preview = <>
    <div className="plate-builder__wall" id="name-plate-live-preview"><div className={`live-name-plate live-name-plate--${shape.slug} live-name-plate--${palette.slug} live-name-plate--motif-${motif.slug} live-name-plate--material-${material.slug}`} aria-live="polite"><ArtDirectionMark direction={motif.slug} className="live-name-plate__art" frame/><span className={`live-name-plate__copy live-name-plate__copy--${lettering.toLowerCase().replaceAll(' ', '-')}`}><strong>{displayName}</strong><small>{secondLine.trim() || 'Optional second line'}</small></span></div></div>
    <div className="plate-preview-note"><span>Live design direction</span><small>Not the final production proof</small></div>
    <dl className="plate-preview-facts"><div><dt>Size</dt><dd>{dimensions}</dd></div><div><dt>Material</dt><dd>{material.name}</dd></div><div><dt>Approx. weight</dt><dd>{size.weight}</dd></div></dl>
    <button type="button" className="plate-expand-preview" onClick={() => setPreviewExpanded(!previewExpanded)}>{previewExpanded ? 'Close expanded preview' : 'Expand preview'}</button>
  </>;

  return <section className="plate-builder" id="name-plate-builder" aria-labelledby="plate-builder-title">
    <header className="plate-builder__heading"><span>Guided name-plate configurator</span><h2 id="plate-builder-title">Five clear decisions.<br/><em>One confident studio brief.</em></h2><p>Your estimate and visual direction update immediately. The studio still confirms spelling, feasibility, material, final price and production time.</p></header>
    <ol className="plate-builder__steps" aria-label="Name-plate configuration progress">{stepNames.map((name, index) => <li className={step === index ? 'is-current' : index < step ? 'is-complete' : ''} aria-current={step === index ? 'step' : undefined} key={name}><button type="button" onClick={() => setStep(index)}><b>{index + 1}</b><span>{name}</span></button></li>)}</ol>
    <div className="plate-builder__workspace">
      <aside className={`plate-builder__preview-panel ${previewExpanded ? 'is-expanded' : ''}`} aria-label="Live name-plate preview">{preview}</aside>
      <form className="plate-builder__controls" onSubmit={(event) => event.preventDefault()}>
        <div className="plate-builder__step" key={step}>
          {step === 0 && <fieldset><legend>Where will your name plate be placed?</legend><p className="plate-step-intro">This helps the studio recommend a suitable base, finish and fitting.</p><div className="plate-placement-options">{placements.map((item) => <button type="button" className={placement.slug === item.slug ? 'selected' : ''} onClick={() => selectPlacement(item)} key={item.slug}><span><b>{item.name}</b><small>{item.note}</small></span></button>)}</div>{isExposed && <div className="plate-exposure"><h3>Tell us about exposure</h3><label><input type="checkbox" checked={covered} onChange={(e) => setCovered(e.target.checked)}/> The location is covered</label><label><input type="checkbox" checked={rain} onChange={(e) => setRain(e.target.checked)}/> It receives direct rain</label><label><input type="checkbox" checked={sun} onChange={(e) => setSun(e.target.checked)}/> It receives direct sunlight</label><label>Approximate daily weather exposure<select value={exposureHours} onChange={(e) => setExposureHours(e.target.value)}><option>0–2 hours</option><option>2–5 hours</option><option>More than 5 hours</option></select></label></div>}<p className="plate-warning">Outdoor suitability must be confirmed by the studio before ordering.</p></fieldset>}
          {step === 1 && <fieldset><legend>What should your name plate say?</legend><p className="plate-step-intro">Names are always rendered as exact text—not generated by AI.</p><div className="plate-input-grid"><label>Main name<input value={familyName} onChange={(e) => { setFamilyName(e.target.value.slice(0, 42)); setSpellingConfirmed(false); }} maxLength={42} placeholder="Example: The Shah Family" aria-describedby="main-name-count main-name-warning"/><small id="main-name-count">{familyName.length}/42 characters · 24 or fewer recommended</small>{nameWarning && <em id="main-name-warning" role="alert">{nameWarning}</em>}</label><label>Second line <small>Optional</small><input value={secondLine} onChange={(e) => { setSecondLine(e.target.value.slice(0, 48)); setSpellingConfirmed(false); }} maxLength={48} placeholder="Welcome home, flat number or short line"/><small>{secondLine.length}/48 characters</small></label><label>Language / script<select value={script} onChange={(e) => setScript(e.target.value)}><option>English</option><option>Marathi</option><option>Hindi</option><option>Gujarati</option><option>Other Unicode Indian script</option></select></label><label>Preferred lettering direction<select value={lettering} onChange={(e) => setLettering(e.target.value)}><option>Classic serif</option><option>Clean sans serif</option><option>Graceful display</option></select></label></div><p className="plate-field-help">Automatic wrapping is shown in the preview. The studio sends an exact spelling proof before painting.</p></fieldset>}
          {step === 2 && <fieldset><legend>Choose the design direction</legend>{source !== 'Builder choices' && <p className="plate-source">Started from: <strong>{source}</strong></p>}<h3>Shape</h3><div className="plate-shape-options">{shapes.map((item) => <button type="button" title={item.suitability} className={shape.slug === item.slug ? 'selected' : ''} onClick={() => setShape(item)} key={item.slug}><i className={`plate-shape-icon plate-shape-icon--${item.slug}`} aria-hidden="true"/><span><b>{item.name}</b><small>{item.note} · {item.price ? `+₹${inr.format(item.price)}` : 'included'}</small></span></button>)}</div><h3>Painting direction</h3><div className="plate-motif-options">{motifs.map((item) => <button type="button" title={item.studioNote} className={motif.slug === item.slug ? 'selected' : ''} onClick={() => setMotif(item)} key={item.slug}><ArtDirectionMark direction={item.slug}/><span><b>{item.name}</b><small>{item.shortNote} · {item.price ? `+₹${inr.format(item.price)}` : 'included'}</small></span></button>)}</div><p className="plate-field-help"><b>{motif.name}:</b> {motif.visualLanguage} {motif.studioNote}</p><h3>Palette</h3><div className="plate-palette-options">{palettes.map((item) => <button type="button" title={item.note} className={palette.slug === item.slug ? 'selected' : ''} onClick={() => setPalette(item)} key={item.slug}><i className={`plate-swatch plate-swatch--${item.slug}`} aria-hidden="true"/><span><b>{item.name}</b><small>{item.note}</small></span></button>)}</div><label className="plate-recommend"><input type="checkbox" checked={studioRecommendation} onChange={(e) => setStudioRecommendation(e.target.checked)}/><span><b>Let Deepti’s studio recommend</b><small>This adds a recommendation request. It does not claim Deepti has personally selected a design.</small></span></label></fieldset>}
          {step === 3 && <fieldset><legend>Choose material and size</legend><h3>Material</h3><div className="plate-material-options">{materials.map((item) => <button type="button" className={material.slug === item.slug ? 'selected' : ''} onClick={() => selectMaterial(item)} key={item.slug}><span><b>{item.name}</b><small>{item.note}{item.price ? ` · +₹${inr.format(item.price)}` : ' · included'}</small></span></button>)}</div><div className="plate-size-head"><h3>Size</h3><div role="group" aria-label="Measurement unit"><button type="button" className={unit === 'in' ? 'selected' : ''} onClick={() => setUnit('in')}>Inches</button><button type="button" className={unit === 'cm' ? 'selected' : ''} onClick={() => setUnit('cm')}>Centimetres</button></div></div><div className="plate-size-options">{sizes.map((item) => <button type="button" className={size.slug === item.slug ? 'selected' : ''} onClick={() => setSize(item)} key={item.slug}><b>{item.name}</b><span>{unit === 'in' ? `${item.inches[0]} × ${item.inches[1]} in` : `${cm(item.inches[0])} × ${cm(item.inches[1])} cm`}</span><small>₹{inr.format(item.price)} · {item.weight}</small></button>)}</div><div className="plate-select-grid"><label>Surface protection<select value={protection.slug} onChange={(e) => setProtection(protections.find((item) => item.slug === e.target.value) ?? protections[0])}>{protections.map((item) => <option value={item.slug} key={item.slug}>{item.name}{item.price ? ` · +₹${inr.format(item.price)}` : ''}</option>)}</select></label><label>Mounting preference<select value={mounting.slug} onChange={(e) => setMounting(mountings.find((item) => item.slug === e.target.value) ?? mountings[0])}>{mountings.map((item) => <option value={item.slug} key={item.slug} disabled={(placement.slug === 'desk') !== (item.slug === 'counter') || (material.slug === 'layered' && item.slug === 'rope')}>{item.name}{item.price ? ` · +₹${inr.format(item.price)}` : ''}</option>)}</select></label></div><div className="plate-care"><p><b>Suitability:</b> {protection.note}</p><p><b>Cleaning:</b> Soft dry cloth only; no soaking, abrasives or household chemicals.</p><p><b>Mounting:</b> {mounting.note} {fittingIncluded}.</p></div></fieldset>}
          {step === 4 && <fieldset><legend>Preview and request studio confirmation</legend><div className="plate-order-summary"><dl><div><dt>Exact wording</dt><dd>{familyName || 'Not entered'}{secondLine ? ` · ${secondLine}` : ''}</dd></div><div><dt>Placement</dt><dd>{placement.name}</dd></div><div><dt>Shape & artwork</dt><dd>{shape.name} · {motif.name} · {palette.name}</dd></div><div><dt>Material & dimensions</dt><dd>{material.name} · {dimensions}</dd></div><div><dt>Protection & mounting</dt><dd>{protection.name} · {mounting.name}</dd></div><div><dt>Estimated production</dt><dd>{leadTime}</dd></div><div><dt>Delivery</dt><dd>Calculated separately by the ERP after PIN-code review</dd></div></dl><div className="plate-estimate-total"><span>Website estimate</span><strong>₹{inr.format(estimate)}</strong><small>Studio confirmation required · ERP controls final price, tax and delivery</small></div></div><label className="plate-confirm"><input type="checkbox" checked={spellingConfirmed} onChange={(e) => setSpellingConfirmed(e.target.checked)}/><span>I have checked the exact spelling and wording.</span></label><div className="plate-final-fields"><label>Delivery PIN code<input inputMode="numeric" autoComplete="postal-code" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit PIN"/></label><label>Preferred delivery date <small>Optional</small><input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)}/></label></div><div className="doorway-preview"><div><h3>Optional doorway-photo preview</h3><p>Upload a straight photograph, then drag the plate and adjust its approximate size. The image stays in this browser and is not placed in a public link.</p><button type="button" onClick={() => photoInput.current?.click()}>{photoUrl ? 'Replace doorway photo' : 'Take or upload doorway photo'}</button><input ref={photoInput} type="file" hidden accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(e) => handlePhoto(e.target.files?.[0])}/></div>{photoUrl && <><div className="doorway-preview__stage" onPointerMove={moveOverlay}><img src={photoUrl} alt="Customer doorway preview"/><div className="doorway-preview__plate" style={{ left: `${photoPosition.x}%`, top: `${photoPosition.y}%`, width: `${photoScale}%` }}><span>{displayName}</span></div></div><label>Approximate plate size<input type="range" min="18" max="76" value={photoScale} onChange={(e) => setPhotoScale(Number(e.target.value))}/></label><label className="plate-confirm"><input type="checkbox" checked={photoConsent} onChange={(e) => setPhotoConsent(e.target.checked)}/><span>I consent to telling the studio that a doorway photo was used for this private placement check.</span></label><button type="button" className="text-button" onClick={() => { URL.revokeObjectURL(photoUrl); setPhotoUrl(''); setPhotoConsent(false); }}>Remove photo</button></>}<small>Approximate placement preview—not an installation measurement or true AR scale.</small></div><div className="plate-save-actions"><button type="button" onClick={() => saveDraft(false)}>Save and resume</button><button type="button" onClick={() => saveDraft(true)}>Duplicate design</button><Link href="/account">View studio responses in your account</Link></div>{saveStatus && <p className="plate-status" role="status">{saveStatus}</p>}<div className="plate-submit-actions"><button type="button" onClick={submitDraft} disabled={submitStatus === 'submitting'}>Request studio confirmation</button><a href={`https://wa.me/919158680722?text=${encodeURIComponent(brief)}`} target="_blank" rel="noreferrer">Discuss on WhatsApp</a></div>{submitMessage && <p className={`plate-status plate-status--${submitStatus}`} role={submitStatus === 'error' ? 'alert' : 'status'}>{submitMessage}{submitStatus === 'success' && <><br/><Link href="/account">Track this request →</Link></>}</p>}<p className="plate-builder__assurance">The studio proof approval remains mandatory. Nothing is charged by this configurator.</p></fieldset>}
        </div>
        <div className="plate-builder__nav"><button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Previous</button>{step < 4 && <button type="button" onClick={() => setStep(Math.min(4, step + 1))} disabled={!canContinue}>Continue</button>}</div>
      </form>
    </div>
    <div className="plate-mobile-bar"><span><small>Estimate</small><b>₹{inr.format(estimate)}</b></span>{step < 4 ? <button type="button" onClick={() => setStep(Math.min(4, step + 1))} disabled={!canContinue}>Continue</button> : <button type="button" onClick={submitDraft} disabled={!canSubmit || submitStatus === 'submitting'}>Request review</button>}</div>
    <AIConceptPreview title={`Artzy name-plate concept for ${familyName.trim() || 'your home'}`} primaryText={familyName.trim()} secondaryText={secondLine.trim()} studioMessage={brief} enabled={step === 4 && familyName.trim().length > 0} disabledHint="Complete the wording and reach Preview & confirm before generating a concept." brief={{ kind: 'name-plate', style: motif.name, palette: palette.name, shape: shape.name, material: material.name, purpose: placement.name }}/>
  </section>;
}
