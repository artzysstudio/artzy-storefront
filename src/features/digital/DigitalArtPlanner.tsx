"use client";

import Link from 'next/link';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import ArtDirectionMark from '@/components/ArtDirectionMark';
import AIConceptPreview from '@/components/AIConceptPreview';
import { useCustomer } from '@/context/CustomerContext';
import { ART_DIRECTIONS, DIGITAL_ART_DIRECTION_IDS, type ArtDirectionId } from '@/data/artDirections';

type UploadState = { file: File; url: string; name: string } | null;
type Finish = { id: string; name: string; note: string; price: [number, number] | null; framing: string; material: string; usage: string };

const steps = ['Purpose', 'Art direction', 'Size & finish', 'References & room', 'Preview & studio brief'];
const purposes = [
  { id: 'home', label: 'Art for my home', note: 'Composed around a wall, room and existing colour mood.' },
  { id: 'gift', label: 'Personal gift', note: 'Story-led artwork for a person, home or occasion.' },
  { id: 'business', label: 'Art for business', note: 'For offices, hospitality, retail and commercial spaces.' },
  { id: 'file', label: 'Digital file', note: 'A high-resolution artwork for an agreed personal or commercial use.' },
  { id: 'guide', label: 'Please guide me', note: 'Share what you know and ask the studio to recommend a direction.' },
];
const finishes: Finish[] = [
  { id: 'digital', name: 'Digital file', note: 'High-resolution export after usage is agreed.', price: [1800, 4200], framing: 'No physical frame', material: 'JPEG/PNG or agreed print-ready file', usage: 'Personal use unless commercial rights are quoted' },
  { id: 'paper', name: 'Fine-art paper', note: 'Archival-style paper suited to framing.', price: [2490, 6990], framing: 'Frame not included unless quoted', material: 'Paper specification confirmed by the studio', usage: 'Physical print; digital reproduction rights excluded' },
  { id: 'canvas', name: 'Canvas', note: 'A tactile wall-art finish.', price: [3490, 9990], framing: 'Stretcher/frame detail confirmed before production', material: 'Canvas specification confirmed by the studio', usage: 'Physical artwork for the agreed location' },
  { id: 'framed', name: 'Framed print', note: 'A finished presentation for home or gifting.', price: [4490, 12990], framing: 'Indicative range includes a standard frame', material: 'Paper, glazing and frame confirmed in quotation', usage: 'Physical print; digital reproduction rights excluded' },
  { id: 'series', name: 'Coordinated series', note: 'Two or more related pieces for one space.', price: [8990, 24990], framing: 'Depends on quantity and selected finish', material: 'Quoted as a coordinated project', usage: 'Usage and installation scope confirmed in writing' },
  { id: 'recommend', name: 'Recommend a finish', note: 'The studio recommends after reviewing the room and purpose.', price: null, framing: 'Studio recommendation required', material: 'Studio recommendation required', usage: 'Confirmed with the quotation' },
];
const standards = [
  { id: 'a4', label: 'A4', width: 21, height: 29.7 },
  { id: 'a3', label: 'A3', width: 29.7, height: 42 },
  { id: '16x20', label: '16 × 20 in', width: 40.6, height: 50.8 },
  { id: '24x36', label: '24 × 36 in', width: 61, height: 91.4 },
  { id: 'custom', label: 'Custom dimensions', width: 45, height: 60 },
];
const colours = ['Warm neutrals', 'Terracotta & rose', 'Olive & natural wood', 'Indigo & cream', 'Bright mixed colour', 'I will describe them'];
const draftKey = 'artzy_digital_art_draft_v2';
const inr = new Intl.NumberFormat('en-IN');

export default function DigitalArtPlanner() {
  const { user } = useCustomer();
  const [step, setStep] = useState(0);
  const [purposeId, setPurposeId] = useState('');
  const [styleId, setStyleId] = useState<ArtDirectionId | ''>('');
  const [finishId, setFinishId] = useState('');
  const [standardId, setStandardId] = useState('a3');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [width, setWidth] = useState(29.7);
  const [height, setHeight] = useState(42);
  const [orientation, setOrientation] = useState('Portrait');
  const [usage, setUsage] = useState('Personal display');
  const [roomColours, setRoomColours] = useState(colours[0]);
  const [wallWidth, setWallWidth] = useState('');
  const [wallHeight, setWallHeight] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [roomPhoto, setRoomPhoto] = useState<UploadState>(null);
  const [referenceImage, setReferenceImage] = useState<UploadState>(null);
  const [referenceConsent, setReferenceConsent] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [assetId, setAssetId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [reference, setReference] = useState('');
  const purpose = purposes.find(item => item.id === purposeId);
  const style = styleId ? ART_DIRECTIONS[styleId] : null;
  const finish = finishes.find(item => item.id === finishId);
  const aspect = width > 0 && height > 0 ? width / height : 1;
  const aspectLabel = aspect > 1.15 ? 'Landscape' : aspect < .87 ? 'Portrait' : 'Near square';
  const dimensions = unit === 'cm' ? `${width} × ${height} cm` : `${width} × ${height} in`;
  const canContinue = [Boolean(purpose), Boolean(style), Boolean(finish && width > 0 && height > 0), true, true][step];
  const references = [roomPhoto?.file, referenceImage?.file].filter(Boolean) as File[];
  const aiReady = Boolean(purpose && style && finish) && (references.length === 0 || referenceConsent);
  const estimate = finish?.price ? `₹${inr.format(finish.price[0])}–₹${inr.format(finish.price[1])}` : 'Studio quotation required';

  const payload = useMemo(() => ({
    type: 'custom_digital_art', status: 'awaiting_studio_review', customer: user ? { id: user.id ?? null, email: user.email } : { guest: true },
    configuration: { purpose: purpose?.label ?? null, artDirection: style?.name ?? null, dimensions, orientation, aspectRatio: aspect.toFixed(3), finish: finish?.name ?? null, usage, roomColours, roomContext: { wallWidth: wallWidth || null, wallHeight: wallHeight || null, unit }, notes: notes.trim() || null },
    references: { roomPhotoSelected: Boolean(roomPhoto), inspirationSelected: Boolean(referenceImage), artzyAiProcessingConsent: referenceConsent },
    artzyAiAssetId: assetId, estimate: { label: estimate, authority: 'Studio confirmation required' }, requiredDate: requiredDate || null,
  }), [user, purpose, style, dimensions, orientation, aspect, finish, usage, roomColours, wallWidth, wallHeight, unit, notes, roomPhoto, referenceImage, referenceConsent, assetId, estimate, requiredDate]);

  const message = useMemo(() => [
    "Hello Artzy's Studio, I would like a digital-art review.",
    `Purpose: ${purpose?.label ?? 'Please guide me'}`,
    `Direction: ${style?.name ?? 'Please recommend'}`,
    `Size / finish: ${dimensions}; ${finish?.name ?? 'Please recommend'}`,
    `Orientation / usage: ${orientation}; ${usage}`,
    `Room colours: ${roomColours}`,
    `Indicative range: ${estimate}. Studio reference: ${reference || 'not created yet'}.`,
    `Required date: ${requiredDate || 'Flexible'}. Notes: ${notes.trim() || 'None'}.`,
    'Please confirm feasibility, usage rights, final price, proof process, dispatch and delivery.',
  ].join('\n'), [purpose, style, dimensions, finish, orientation, usage, roomColours, estimate, reference, requiredDate, notes]);

  useEffect(() => {
    const onAsset = (event: Event) => {
      const detail = (event as CustomEvent<{ tool: string; assetId: string | null }>).detail;
      if (detail.tool === 'digital_art') setAssetId(detail.assetId);
    };
    window.addEventListener('artzy:concept-asset', onAsset);
    return () => window.removeEventListener('artzy:concept-asset', onAsset);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(draftKey) ?? 'null') as { expiresAt?: number; state?: Record<string, string | number> } | null;
      if (!saved?.state || !saved.expiresAt || saved.expiresAt < Date.now()) { if (saved) localStorage.removeItem(draftKey); return; }
      const value = saved.state;
      setPurposeId(String(value.purposeId ?? '')); setStyleId((value.styleId ?? '') as ArtDirectionId | ''); setFinishId(String(value.finishId ?? ''));
      setWidth(Number(value.width ?? 29.7)); setHeight(Number(value.height ?? 42)); setUnit(value.unit === 'in' ? 'in' : 'cm'); setOrientation(String(value.orientation ?? 'Portrait'));
      setUsage(String(value.usage ?? 'Personal display')); setRoomColours(String(value.roomColours ?? colours[0])); setWallWidth(String(value.wallWidth ?? '')); setWallHeight(String(value.wallHeight ?? ''));
      setRequiredDate(String(value.requiredDate ?? '')); setNotes(String(value.notes ?? '')); setStatus('Saved brief restored. Add reference images again for privacy.');
    } catch { localStorage.removeItem(draftKey); }
  }, []);

  useEffect(() => {
    if (window.location.hash !== '#digital-planner') return;
    const align = window.setTimeout(() => {
      const root = document.documentElement; const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto'; document.getElementById('digital-planner')?.scrollIntoView({ block: 'start' });
      window.requestAnimationFrame(() => { root.style.scrollBehavior = previous; });
    }, 700);
    return () => window.clearTimeout(align);
  }, []);

  function chooseStandard(id: string) {
    const selected = standards.find(item => item.id === id)!;
    setStandardId(id); setWidth(unit === 'cm' ? selected.width : Number((selected.width / 2.54).toFixed(1))); setHeight(unit === 'cm' ? selected.height : Number((selected.height / 2.54).toFixed(1)));
  }
  function changeUnit(next: 'cm' | 'in') {
    if (next === unit) return;
    const factor = next === 'cm' ? 2.54 : 1 / 2.54;
    setWidth(Number((width * factor).toFixed(1))); setHeight(Number((height * factor).toFixed(1))); setUnit(next);
  }
  function selectUpload(event: ChangeEvent<HTMLInputElement>, kind: 'room' | 'reference') {
    const file = event.target.files?.[0]; if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 8 * 1024 * 1024) { setStatus('Choose a JPG, PNG or WebP image up to 8 MB.'); return; }
    const next = { file, url: URL.createObjectURL(file), name: file.name };
    const current = kind === 'room' ? roomPhoto : referenceImage; if (current?.url) URL.revokeObjectURL(current.url);
    if (kind === 'room') setRoomPhoto(next); else setReferenceImage(next); setReferenceConsent(false); setStatus('');
  }
  function removeUpload(kind: 'room' | 'reference') {
    const current = kind === 'room' ? roomPhoto : referenceImage; if (current?.url) URL.revokeObjectURL(current.url);
    if (kind === 'room') setRoomPhoto(null); else setReferenceImage(null); setReferenceConsent(false);
  }
  function saveDraft(note = true) {
    localStorage.setItem(draftKey, JSON.stringify({ expiresAt: Date.now() + 7 * 86400000, state: { purposeId, styleId, finishId, width, height, unit, orientation, usage, roomColours, wallWidth, wallHeight, requiredDate, notes } }));
    if (note) setStatus('Private draft saved on this device for 7 days.');
  }
  function openArtzyWorld() {
    saveDraft(false);
    localStorage.setItem('artzy_world_digital_handoff', JSON.stringify({ dimensions, aspectRatio: aspect.toFixed(3), finish: finish?.name ?? null, roomPhotoSelected: Boolean(roomPhoto), colours: roomColours, returnTo: '/digital-prints/#digital-planner' }));
    window.location.href = '/artzy-world/preview/?source=digital-art&return=%2Fdigital-prints%2F%23digital-planner';
  }
  async function submitDraft() {
    if (!purpose || !style || !finish) { setStatus('Complete the five planner steps before requesting studio review.'); return; }
    setStatus('Creating your studio-review request…');
    try {
      const response = await fetch('/api/storefront/custom-orders', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json() as { success?: boolean; reference?: string; draftId?: string; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || 'The draft could not be created.');
      const next = result.reference || result.draftId || ''; setReference(next); setStatus(`Request ${next} is awaiting studio review.`);
    } catch (error) { saveDraft(false); setStatus(`${(error as Error).message} Your private device draft is saved; WhatsApp remains available.`); }
  }

  return <section className="digital-planner digital-wizard" id="digital-planner" aria-labelledby="digital-planner-title">
    <header className="digital-planner__heading"><div><span>Guided digital art planner</span><h2 id="digital-planner-title">Five clear choices.<br/><em>One useful studio brief.</em></h2></div><p>Plan art for a wall, gift, digital use or commercial space. Nothing here invents catalogue stock or changes a confirmed price.</p></header>
    <ol className="digital-wizard__steps" aria-label="Digital-art planner progress">{steps.map((name, index) => <li className={index === step ? 'is-current' : index < step ? 'is-done' : ''} key={name}><button type="button" onClick={() => setStep(index)} aria-current={index === step ? 'step' : undefined}><b>{index + 1}</b><span>{name}</span></button></li>)}</ol>
    <div className="digital-wizard__workspace">
      <form className="digital-wizard__controls" onSubmit={event => event.preventDefault()}>
        {step === 0 && <fieldset><legend>What is this artwork for?</legend><p>Choose the closest purpose. “Please guide me” is a complete and valid starting point.</p><div className="digital-purpose-options">{purposes.map(item => <button type="button" aria-pressed={purposeId === item.id} onClick={() => setPurposeId(item.id)} key={item.id}><span><strong>{item.label}</strong><small>{item.note}</small></span></button>)}</div><aside className="digital-caricature-switch"><b>Looking for a portrait from a photograph?</b><span>Caricatures use a separate photo, likeness and consent workflow.</span><Link href="/caricatures/?from=digital-art#caricature-builder">Open the Caricature Studio →</Link></aside></fieldset>}
        {step === 1 && <fieldset><legend>Choose an art direction</legend><p>These describe visual language. “Inspired” directions do not claim traditional provenance.</p><div className="digital-style-options">{DIGITAL_ART_DIRECTION_IDS.map(id => { const item = ART_DIRECTIONS[id]; return <button type="button" aria-pressed={styleId === id} onClick={() => setStyleId(id)} key={id}><ArtDirectionMark direction={id}/><span><strong>{item.name}</strong><small>{item.shortNote}</small></span></button>; })}</div>{style && <p className="digital-style-context" role="status"><b>{style.name}:</b> {style.visualLanguage}. {style.studioNote}</p>}</fieldset>}
        {step === 2 && <fieldset><legend>Select size and finish</legend><p>Ranges are indicative storefront guidance. The studio remains authoritative.</p><h3>Standard or custom size</h3><div className="digital-standard-sizes">{standards.map(item => <button type="button" aria-pressed={standardId === item.id} onClick={() => chooseStandard(item.id)} key={item.id}>{item.label}</button>)}</div><div className="digital-dimensions"><label>Width<input type="number" min="1" max="500" step="0.1" value={width} onChange={e => { setStandardId('custom'); setWidth(Number(e.target.value)); }}/></label><label>Height<input type="number" min="1" max="500" step="0.1" value={height} onChange={e => { setStandardId('custom'); setHeight(Number(e.target.value)); }}/></label><div role="group" aria-label="Measurement unit"><button type="button" aria-pressed={unit === 'cm'} onClick={() => changeUnit('cm')}>cm</button><button type="button" aria-pressed={unit === 'in'} onClick={() => changeUnit('in')}>in</button></div><label>Orientation<select value={orientation} onChange={e => setOrientation(e.target.value)}><option>Portrait</option><option>Landscape</option><option>Square</option><option>Studio recommendation</option></select></label></div><h3>Finish</h3><div className="digital-output-options">{finishes.map(item => <button type="button" aria-pressed={finishId === item.id} onClick={() => setFinishId(item.id)} key={item.id}><span><strong>{item.name}</strong><small>{item.note}</small><em>{item.price ? `Estimated ₹${inr.format(item.price[0])}–₹${inr.format(item.price[1])}` : 'Studio quotation required'}</em></span></button>)}</div><label className="digital-usage">Intended usage<select value={usage} onChange={e => setUsage(e.target.value)}><option>Personal display</option><option>Personal gift</option><option>Business interior display</option><option>Commercial reproduction</option><option>Studio guidance required</option></select></label>{finish && <div className="digital-finish-facts"><p><b>Framing:</b> {finish.framing}</p><p><b>Material/output:</b> {finish.material}</p><p><b>Usage:</b> {finish.usage}</p><p><b>Timing:</b> Production/dispatch is confirmed separately from courier delivery.</p></div>}</fieldset>}
        {step === 3 && <fieldset><legend>Add references and room details</legend><p>Files remain local until you explicitly consent and request an ArtzyAI concept.</p><div className="digital-upload-grid"><UploadCard id="digital-room-photo" title="Room or wall photo" value={roomPhoto} onChange={e => selectUpload(e, 'room')} onRemove={() => removeUpload('room')}/><UploadCard id="digital-reference-image" title="Inspiration or reference image" value={referenceImage} onChange={e => selectUpload(e, 'reference')} onRemove={() => removeUpload('reference')}/></div><div className="digital-reference-fields"><label>Wall width ({unit})<input type="number" min="1" max="1000" step="0.1" value={wallWidth} onChange={e => setWallWidth(e.target.value)}/></label><label>Wall height ({unit})<input type="number" min="1" max="1000" step="0.1" value={wallHeight} onChange={e => setWallHeight(e.target.value)}/></label><label>Existing room colours<select value={roomColours} onChange={e => setRoomColours(e.target.value)}>{colours.map(item => <option key={item}>{item}</option>)}</select></label><label>Required date<input type="date" value={requiredDate} onChange={e => setRequiredDate(e.target.value)}/></label><label className="wide">Customer notes<textarea rows={4} maxLength={500} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Room, story, mood, objects, brand requirements or anything the studio should understand…"/></label></div>{references.length > 0 && <label className="digital-reference-consent"><input type="checkbox" checked={referenceConsent} onChange={e => setReferenceConsent(e.target.checked)}/><span>I consent to ArtzyAI processing the selected reference image(s) only when I choose to generate this concept.</span></label>}</fieldset>}
        {step === 4 && <fieldset><legend>Review and send one clear brief</legend><p>Check the creative direction before generating an optional concept or requesting studio confirmation.</p><div className="digital-final-summary"><p><b>Purpose</b>{purpose?.label ?? 'Not selected'}</p><p><b>Direction</b>{style?.name ?? 'Not selected'}</p><p><b>Size</b>{dimensions} · {aspectLabel}</p><p><b>Finish</b>{finish?.name ?? 'Not selected'}</p><p><b>Usage</b>{usage}</p><p><b>Estimate</b>{estimate}</p><p><b>Required date</b>{requiredDate || 'Flexible'}</p><p><b>References</b>{references.length ? `${references.length} selected locally` : 'None selected'}</p></div><div className="digital-final-actions"><button type="button" onClick={submitDraft}>Request studio confirmation</button>{purposeId === 'home' && <button type="button" onClick={openArtzyWorld}>Preview in my room</button>}<button type="button" onClick={() => saveDraft(true)}>Save and resume</button><a href={`https://wa.me/919158680722?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">Discuss on WhatsApp</a><Link href="/shop/?category=digital-prints">Browse available prints</Link></div>{status && <p className="digital-wizard__status" role="status">{status}{reference && <> <Link href="/account">Track in your account →</Link></>}</p>}<small>The studio confirms real products, final price, tax, material availability, proof approval, production and delivery.</small></fieldset>}
        <div className="digital-wizard__nav"><button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Previous</button>{step < 4 && <button type="button" onClick={() => setStep(Math.min(4, step + 1))} disabled={!canContinue}>Continue</button>}</div>
      </form>
      <aside className={`digital-wizard__summary ${summaryOpen ? 'is-open' : ''}`} aria-live="polite"><button type="button" className="digital-summary-toggle" onClick={() => setSummaryOpen(!summaryOpen)} aria-expanded={summaryOpen}>Your brief <span>{summaryOpen ? 'Close' : 'Expand'}</span></button><div><h3>{purpose?.label ?? 'Your ArtzyAI concept'}</h3><p>{purpose?.note ?? 'Choose a purpose, art direction and finish to begin.'}</p><section><b>Your choices</b><dl><div><dt>Direction</dt><dd>{style?.name ?? 'Not selected'}</dd></div><div><dt>Finish</dt><dd>{finish?.name ?? 'Not selected'}</dd></div><div><dt>Size</dt><dd>{dimensions}</dd></div><div><dt>Timing</dt><dd>{requiredDate || 'Flexible'}</dd></div></dl></section><section><b>What to prepare</b><p>{references.length ? `${references.length} local reference image(s) selected.` : 'Optional room photo, references, dimensions and required date.'}</p></section><section><b>Estimate</b><strong>{estimate}</strong><small>Studio confirmation required</small></section><section><b>Next action</b><p>{step < 4 ? `Continue to ${steps[step + 1]}.` : 'Generate an optional concept or request studio review.'}</p></section></div></aside>
    </div>
    <div className="digital-mobile-bar"><span><small>Step {step + 1} of 5</small><b>{estimate}</b></span>{step < 4 ? <button type="button" onClick={() => setStep(step + 1)} disabled={!canContinue}>Continue</button> : <button type="button" onClick={submitDraft}>Request review</button>}</div>
    <AIConceptPreview brief={{ kind: 'digital-art', style: style?.name ?? 'Studio recommendation', palette: roomColours, purpose: `${purpose?.label ?? 'Custom digital artwork'}. ${dimensions}. ${finish?.name ?? 'Studio finish recommendation'}.` }} title={purpose ? `ArtzyAI concept for ${purpose.label.toLowerCase()}` : 'Your ArtzyAI concept'} studioMessage={message} enabled={step === 4 && aiReady} disabledHint="Choose a purpose, art direction and finish to begin." referenceFiles={references} referenceConsent={referenceConsent}/>
  </section>;
}

function UploadCard({ id, title, value, onChange, onRemove }: { id: string; title: string; value: UploadState; onChange: (event: ChangeEvent<HTMLInputElement>) => void; onRemove: () => void }) {
  return <article className="digital-upload-card"><b>{title}</b>{value ? <><img src={value.url} alt={`Selected ${title.toLowerCase()} preview`}/><span>{value.name}</span><div><label htmlFor={id}>Replace image</label><button type="button" onClick={onRemove}>Remove</button></div></> : <><p>Optional · selected only when you choose</p><label htmlFor={id}>Choose image</label></>}<input id={id} className="visually-hidden-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange}/><small>JPG, PNG or WebP · Maximum 8 MB</small></article>;
}
