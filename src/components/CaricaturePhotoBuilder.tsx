'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import CaricatureArtzyAiPanel, { type CaricatureSample } from '@/components/CaricatureArtzyAiPanel';
import { createConsent, createCreativeJob, deleteCreativeAsset, getCreativeUsage, uploadReference, waitForCreativeJob } from '@/lib/artzyai';
import { useCustomer } from '@/context/CustomerContext';
import { aiReliable, buildCustomerCaricaturePrompt, CARICATURE_STYLES, OCCASIONS, SUBJECTS, validatePhotoFile, type CaricatureBrief, type CaricatureExaggeration, type CaricatureStyleId, type SubjectId } from '@/features/caricatures/config';
import { calculateCaricatureEstimate } from '@/features/caricatures/pricing';
import { useAnalytics } from '@/hooks/useAnalytics';

const label = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, character => character.toUpperCase());
const steps = ['Photo', 'Subjects', 'Type & style', 'Occasion & story', 'Finish & price', 'Review & consent'];
const types = [
  { id: 'head', name: 'Head and shoulders', note: 'Focused portrait with expressive face and simple setting.', addition: 0 },
  { id: 'full', name: 'Full body', note: 'Includes clothing, pose and more visual detail.', addition: 500 },
  { id: 'big-head', name: 'Big-head caricature', note: 'Playful enlarged head with a compact body.', addition: 200 },
  { id: 'scene', name: 'Scene/story caricature', note: 'Adds a meaningful place, activity or narrative.', addition: 800 },
  { id: 'couple', name: 'Couple caricature', note: 'A connected composition for two people.', addition: 400 },
  { id: 'family', name: 'Family caricature', note: 'Balanced multi-person composition.', addition: 650 },
  { id: 'professional', name: 'Professional/workplace', note: 'Profession, uniform, tools or workplace context.', addition: 600 },
  { id: 'pet', name: 'Pet caricature', note: 'A pet-led portrait or person-with-pet composition.', addition: 250 },
];
const finishes = [
  { id: 'digital_file', name: 'Digital artwork', base: 1490, size: 'High-resolution digital file', frame: 'Not applicable', revisions: 'One minor studio-confirmed revision', time: '5–8 working days' },
  { id: 'printed_artwork', name: 'Fine-art print', base: 2390, size: 'A4 starting size', frame: 'Not included', revisions: 'One minor studio-confirmed revision', time: '7–10 working days' },
  { id: 'framed_artwork', name: 'Framed print', base: 3490, size: 'A4 starting size', frame: 'Standard frame included in estimate', revisions: 'One minor studio-confirmed revision', time: '8–12 working days' },
  { id: 'canvas', name: 'Canvas', base: 3990, size: '12 × 16 in starting size', frame: 'Stretcher/frame confirmed by studio', revisions: 'One minor studio-confirmed revision', time: '9–14 working days' },
  { id: 'gift_ready', name: 'Gift presentation', base: 4490, size: 'A4 framed starting presentation', frame: 'Presentation and frame included in estimate', revisions: 'One minor studio-confirmed revision', time: '10–15 working days' },
];
const visualStyles = [
  { id: 'semi_realistic', name: 'Elegant' }, { id: 'classic_exaggerated', name: 'Playful' }, { id: 'watercolour', name: 'Watercolour' },
  { id: 'pencil_sketch', name: 'Minimal' }, { id: 'cute_cartoon', name: 'Cartoon' }, { id: 'digital_painting', name: 'Detailed digital painting' },
] as const;
const draftKey = 'artzy_caricature_draft_v2';
const inr = new Intl.NumberFormat('en-IN');

type PhotoState = { preview: string; file: File; width: number; height: number; source: 'customer' | 'fictional-sample' };

async function preparePhoto(file: File, source: PhotoState['source']): Promise<PhotoState> {
  const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Could not read this photo.')); reader.readAsDataURL(file); });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => { const element = new Image(); element.onload = () => resolve(element); element.onerror = () => reject(new Error('This image could not be opened.')); element.src = dataUrl; });
  if (image.width < 320 || image.height < 320) throw new Error('Choose a clearer photo at least 320 × 320 pixels.');
  const scale = Math.min(1, 512 / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
  const context = canvas.getContext('2d'); if (!context) throw new Error('Your browser could not prepare this photo.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Could not prepare this photo.')), 'image/jpeg', .88));
  return { preview: URL.createObjectURL(blob), file: new File([blob], 'artzy-caricature-reference.jpg', { type: 'image/jpeg' }), width: image.width, height: image.height, source };
}

export default function CaricaturePhotoBuilder() {
  const { user } = useCustomer();
  const { trackEvent } = useAnalytics();
  const formTracked = useRef(false);
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<PhotoState | null>(null);
  const [samples, setSamples] = useState<CaricatureSample[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [referenceAssetId, setReferenceAssetId] = useState('');
  const [consentId, setConsentId] = useState('');
  const [remaining, setRemaining] = useState(2);
  const [exaggeration, setExaggeration] = useState<CaricatureExaggeration>('classic');
  const [customerPrompt, setCustomerPrompt] = useState('');
  const [promptEdited, setPromptEdited] = useState(false);
  const [erpReference, setErpReference] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [status, setStatus] = useState('');
  const [caricatureType, setCaricatureType] = useState(types[0]);
  const [shortMessage, setShortMessage] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [commercialUsage, setCommercialUsage] = useState(false);
  const [permissions, setPermissions] = useState({ process: false, ai: false, people: false, childPresent: false, guardian: false, retain: false, handoff: false, promotion: false, training: false });
  const [brief, setBrief] = useState<CaricatureBrief>({ styleId: 'semi_realistic', occasion: 'birthday', composition: 'half_body', subject: 'one_person', people: 1, pets: 0, profession: '', hobbies: '', colours: '', clothing: '', background: '', props: '', notes: '', output: 'digital_file' });
  const patch = <K extends keyof CaricatureBrief>(key: K, value: CaricatureBrief[K]) => setBrief(current => ({ ...current, [key]: value }));
  const style = CARICATURE_STYLES[brief.styleId];
  const finish = finishes.find(item => item.id === brief.output) ?? finishes[0];
  const manual = !aiReliable(brief);
  const permissionsReady = permissions.process && permissions.ai && (brief.people + brief.pets <= 1 || permissions.people) && (!permissions.childPresent || permissions.guardian);
  const estimate = calculateCaricatureEstimate({ finishBase: finish.base, typeAddition: caricatureType.addition, people: brief.people, pets: brief.pets, commercialUsage });
  const canContinue = [Boolean(photo), brief.people + brief.pets > 0, Boolean(caricatureType && style), Boolean(brief.occasion), Boolean(finish), true][step];

  const payload = useMemo(() => ({
    type: 'custom_caricature', status: 'awaiting_studio_review', customer: user ? { id: user.id ?? null, email: user.email } : { guest: true },
    configuration: { subjects: { kind: brief.subject, people: brief.people, pets: brief.pets }, caricatureType: caricatureType.name, style: style.name, occasion: label(brief.occasion), personalDetails: { profession: brief.profession, hobbies: brief.hobbies, colours: brief.colours, clothing: brief.clothing, background: brief.background, objects: brief.props, notes: brief.notes, exactMessage: shortMessage }, finish: finish.name, commercialUsage },
    consent: { processing: permissions.process, aiGeneration: permissions.ai, photographPermission: permissions.people, temporaryActiveRequest: true, extendedRetention: permissions.retain, studioHandoff: permissions.handoff, promotion: permissions.promotion, modelTraining: permissions.training },
    artzyAiAssetId: selectedAssetId || null,
    artzyAi: { referenceAssetId: referenceAssetId || null, generatedSampleAssetIds: samples.map(sample => sample.assetId), selectedSampleAssetId: selectedAssetId || null, finalEditedPrompt: customerPrompt, exaggeration },
    estimate: { currency: 'INR', amount: estimate, label: 'estimated', authority: 'Studio confirmation required' }, requiredDate: requiredDate || null,
  }), [user, brief, caricatureType, style.name, finish.name, commercialUsage, permissions, shortMessage, selectedAssetId, referenceAssetId, samples, customerPrompt, exaggeration, estimate, requiredDate]);

  const whatsappFor = (reference: string) => `https://wa.me/919158680722?text=${encodeURIComponent(`Hello Artzy's Studio. Please guide my caricature enquiry ${reference}. The private photo, samples and completed brief are attached securely to this studio reference.`)}`;

  useEffect(() => {
    if (window.location.hash !== '#caricature-builder') return;
    const timer = window.setTimeout(() => { const root = document.documentElement; const previous = root.style.scrollBehavior; root.style.scrollBehavior = 'auto'; document.getElementById('caricature-builder')?.scrollIntoView({ block: 'start' }); requestAnimationFrame(() => { root.style.scrollBehavior = previous; }); }, 700);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    getCreativeUsage().then(usage => setRemaining(usage.caricatureFreeSamplesRemaining)).catch(() => undefined);
  }, []);
  useEffect(() => {
    if (!promptEdited) setCustomerPrompt(buildCustomerCaricaturePrompt(brief, caricatureType.name, exaggeration));
  }, [brief, caricatureType.name, exaggeration, promptEdited]);
  useEffect(() => {
    if (step === 5 && !formTracked.current) {
      formTracked.current = true;
      trackEvent({ eventName: 'caricature_form_completed', properties: { tool: 'caricature', page: '/caricatures/' } });
    }
  }, [step, trackEvent]);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(draftKey) ?? 'null') as { expiresAt?: number; state?: { brief?: CaricatureBrief; typeId?: string; shortMessage?: string; requiredDate?: string; commercialUsage?: boolean } } | null;
      if (!saved?.state || !saved.expiresAt || saved.expiresAt < Date.now()) { if (saved) localStorage.removeItem(draftKey); return; }
      if (saved.state.brief) setBrief(saved.state.brief);
      const restoredType = types.find(item => item.id === saved.state?.typeId); if (restoredType) setCaricatureType(restoredType);
      setShortMessage(saved.state.shortMessage ?? ''); setRequiredDate(saved.state.requiredDate ?? ''); setCommercialUsage(Boolean(saved.state.commercialUsage));
      setStatus('Saved brief restored. Add the photograph again for privacy.');
    } catch { localStorage.removeItem(draftKey); }
  }, []);

  async function acceptPhoto(file: File, source: PhotoState['source']) {
    const invalid = validatePhotoFile(file); if (invalid) { setStatus(invalid); return; }
    try { if (photo?.preview) URL.revokeObjectURL(photo.preview); await clearGeneratedAssets(); setPhoto(await preparePhoto(file, source)); setReferenceAssetId(''); setConsentId(''); setStatus('Photo selected locally. It has not been sent to ArtzyAI.'); setPermissions(current => ({ ...current, process: false, ai: false, handoff: false })); }
    catch (error) { setStatus((error as Error).message); }
  }
  async function onPhoto(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (file) await acceptPhoto(file, 'customer'); }
  async function trySample() { const response = await fetch('/images/caricature-style-semi-realistic.webp'); const blob = await response.blob(); await acceptPhoto(new File([blob], 'fictional-sample.webp', { type: 'image/webp' }), 'fictional-sample'); }
  async function removePhoto() { if (photo?.preview) URL.revokeObjectURL(photo.preview); await clearGeneratedAssets(); setPhoto(null); setReferenceAssetId(''); setConsentId(''); setStep(0); setStatus('Photograph and generated samples removed.'); }
  function chooseSubject(id: SubjectId) { const item = SUBJECTS.find(subject => subject.id === id)!; setBrief(current => ({ ...current, subject: id, people: item.people, pets: item.pets })); }
  function saveDraft() { localStorage.setItem(draftKey, JSON.stringify({ expiresAt: Date.now() + 7 * 86400000, state: { brief, typeId: caricatureType.id, shortMessage, requiredDate, commercialUsage } })); setStatus('Private brief saved on this device for 7 days. The photograph is not saved.'); }

  async function generate() {
    if (!photo || busy || manual || remaining <= 0) return;
    if (!permissionsReady) { setStatus('Complete the required photograph and ArtzyAI consent first.'); return; }
    if (customerPrompt.trim().length < 30) { setStatus('Add a little more direction before generating.'); return; }
    setBusy(true); setStatus(''); setProgress('Preparing your secure request');
    try {
      let activeConsentId = consentId;
      let activeReferenceId = referenceAssetId;
      if (!activeConsentId) {
        const consent = await createConsent({ tool: 'caricature', imageProcessing: true, aiGeneration: true, temporaryStorage: true, extendedRetention: permissions.retain, studioHandoff: permissions.handoff, promotionalUse: permissions.promotion, trainingOptIn: permissions.training, containsOtherPeople: brief.people > 1, otherPeoplePermission: permissions.people, containsChildren: permissions.childPresent, guardianConfirmation: permissions.guardian });
        activeConsentId = consent.consentId; setConsentId(activeConsentId);
      }
      if (!activeReferenceId) {
        const uploaded = await uploadReference(photo.file, activeConsentId);
        activeReferenceId = uploaded.assetId; setReferenceAssetId(activeReferenceId);
      }
      const queued = await createCreativeJob({ sourceApp: 'artzy-storefront', tool: 'caricature', mode: 'preview', purpose: customerPrompt, style: style.name.toLowerCase(), palette: (brief.colours || 'warm terracotta, cream, muted rose').split(',').map(value => value.trim()).filter(Boolean), outputFormat: 'jpeg', aspectRatio: '1:1', referenceAssetIds: [activeReferenceId], customerTextOverlay: '', storefrontContext: { page: '/caricatures/', type: caricatureType.id, occasion: brief.occasion, exaggeration }, erpContext: {}, consentId: activeConsentId });
      setRemaining(queued.freeSamplesRemaining ?? Math.max(0, remaining - 1));
      const completed = await waitForCreativeJob(queued.jobId, setProgress);
      if (completed.status !== 'completed' || !completed.previewUrl || !completed.assetId) throw new Error(completed.customerMessage || 'The concept could not be generated.');
      const nextSample = { previewUrl: completed.previewUrl, assetId: completed.assetId, jobId: completed.jobId };
      setSamples(current => [...current.filter(sample => sample.assetId !== nextSample.assetId), nextSample]);
      setSelectedAssetId(nextSample.assetId);
      setRemaining(completed.freeSamplesRemaining ?? Math.max(0, remaining - 1));
      trackEvent({ eventName: samples.length === 0 ? 'caricature_first_sample_generated' : 'caricature_second_sample_generated', properties: { tool: 'caricature', page: '/caricatures/' } });
      setStatus('Your watermarked ArtzyAI sample is ready. Compare the likeness and choose a direction.');
    } catch (error) {
      const typed = error as Error & { category?: string };
      if (typed.category === 'credits_unavailable') setRemaining(0);
      else getCreativeUsage().then(usage => setRemaining(usage.caricatureFreeSamplesRemaining)).catch(() => undefined);
      setStatus(typed.message);
    } finally { setBusy(false); setProgress(''); }
  }
  async function clearGeneratedAssets() { const ids = [...samples.map(sample => sample.assetId), referenceAssetId].filter(Boolean); await Promise.all(ids.map(id => deleteCreativeAsset(id).catch(() => undefined))); setSamples([]); setSelectedAssetId(''); }
  async function deleteSample(sample: CaricatureSample) { await deleteCreativeAsset(sample.assetId).catch(() => undefined); setSamples(current => current.filter(item => item.assetId !== sample.assetId)); setSelectedAssetId(current => current === sample.assetId ? '' : current); setStatus('Sample deleted. A deleted sample still counts toward the secure two-sample allowance.'); }
  function selectSample(sample: CaricatureSample) { setSelectedAssetId(sample.assetId); trackEvent({ eventName: 'caricature_concept_selected', properties: { tool: 'caricature', page: '/caricatures/' } }); setStatus('Concept selected for the studio brief.'); }
  async function submitDraft(openHandoff = false) {
    if (!permissions.handoff) { setStatus('Confirm studio-handoff permission before creating an enquiry.'); return; }
    setStatus('Creating your studio-review request…');
    try { const token = localStorage.getItem('artzy_customer_access_token'); const response = await fetch('/api/storefront/custom-orders', { method: 'POST', headers: { 'content-type': 'application/json', ...(token ? { 'x-customer-token': token } : {}) }, body: JSON.stringify(payload) }); const result = await response.json() as { success?: boolean; reference?: string; draftId?: string; error?: string }; if (!response.ok || !result.success) throw new Error(result.error || 'The draft could not be created.'); const next = result.reference || result.draftId || ''; setErpReference(next); trackEvent({ eventName: 'caricature_order_started', properties: { tool: 'caricature', page: '/caricatures/' } }); setStatus(`Request ${next} is awaiting studio review. Expected response: 1–2 studio working days.`); if (openHandoff) { trackEvent({ eventName: 'caricature_studio_guidance_requested', properties: { tool: 'caricature', page: '/caricatures/' } }); window.open(whatsappFor(next), '_blank', 'noopener,noreferrer'); } }
    catch (error) { saveDraft(); setStatus(`${(error as Error).message} Your text brief is saved privately on this device.`); }
  }

  return <section className="caricature-builder caricature-wizard" id="caricature-builder" aria-labelledby="caricature-builder-title">
    <div className="caricature-builder__intro"><span className="service-eyebrow">Optional ArtzyAI concept · studio-confirmed artwork</span><h2 id="caricature-builder-title">Build the portrait<br/><em>one clear step at a time.</em></h2><p>ArtzyAI can create an optional visual concept from your photograph and selected direction. Deepti and Artzy’s Studio review the brief, confirm feasibility and manage the final studio artwork.</p><small>ArtzyAI concept—not the final studio caricature. Facial likeness is reviewed, never guaranteed.</small><ol className="caricature-stepper">{steps.map((name, index) => <li className={index === step ? 'is-current' : index < step ? 'is-done' : ''} key={name}><button type="button" onClick={() => setStep(index)} aria-current={index === step ? 'step' : undefined}><span>{index + 1}</span>{name}</button></li>)}</ol></div>
    <div className="caricature-builder__panel"><div className="caricature-builder__pane-stage">
      {step === 0 && <div className="wizard-pane caricature-photo-step"><header><b>Step 1 · Photo</b><h3>Start with a clear, permitted photograph</h3><p>Choosing a photograph does not immediately send it to ArtzyAI. Review or remove it before consent and generation.</p></header>{photo ? <div className="caricature-photo-selected"><img src={photo.preview} alt={photo.source === 'fictional-sample' ? 'Fictional sample portrait selected for demonstration' : 'Selected local reference photograph'}/><div><b>{photo.source === 'fictional-sample' ? 'Fictional demonstration sample' : 'Your selected photograph'}</b><span>{photo.width} × {photo.height} px · JPEG prepared locally</span><small>Faces are not identified. Confirm the intended subject count in Step 2.</small><div><label htmlFor="caricature-upload-replace">Replace photo</label><input id="caricature-upload-replace" className="visually-hidden-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={onPhoto}/><button type="button" onClick={removePhoto}>Remove photo</button></div></div></div> : <div className="caricature-upload-state"><div className="caricature-photo-guide" aria-hidden="true"><span/><i/><b/></div><h4>A face at eye level works best</h4><p>Use natural light, keep the full face visible and avoid heavy filters or distant group shots.</p><div><label htmlFor="caricature-camera">Take a photo</label><input id="caricature-camera" className="visually-hidden-input" type="file" accept="image/jpeg,image/png,image/webp" capture="user" onChange={onPhoto}/><label htmlFor="caricature-upload">Upload a photo</label><input id="caricature-upload" className="visually-hidden-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={onPhoto}/><button type="button" onClick={trySample}>Try with a fictional sample</button></div><small>JPG, PNG or WebP · Minimum 320 px · Maximum 8 MB</small><em>Private by design: selection stays in this browser until you explicitly consent and generate.</em></div>}</div>}
      {step === 1 && <div className="wizard-pane"><header><b>Step 2 · Subjects</b><h3>Who should appear?</h3><p>The starting price includes one person or one pet. Extra person ₹650; extra pet ₹450. AI preview supports up to four people and two pets; larger groups receive studio review.</p></header><div className="choice-chips">{SUBJECTS.filter(item => ['one_person','couple','family','group','person_with_pet','pet_only'].includes(item.id)).map(item => <button type="button" aria-pressed={brief.subject === item.id} className={brief.subject === item.id ? 'is-selected' : ''} onClick={() => chooseSubject(item.id)} key={item.id}>{item.id === 'one_person' ? 'Individual' : item.id === 'pet_only' ? 'Pet portrait' : item.label}</button>)}</div><div className="number-fields"><label>People<input type="number" min="0" max="8" value={brief.people} onChange={event => patch('people', Number(event.target.value))}/></label><label>Pets<input type="number" min="0" max="4" value={brief.pets} onChange={event => patch('pets', Number(event.target.value))}/></label></div><p className="manual-note">Separate photographs may be combined after studio review. You must have permission to use every photograph.</p>{manual && <p className="manual-note">This group is beyond the reliable AI-preview range and will go directly to the studio.</p>}</div>}
      {step === 2 && <div className="wizard-pane"><header><b>Step 3 · Type and style</b><h3>Choose the composition, then its visual mood</h3><p>Caricature type controls what is shown. Visual style controls how it feels.</p></header><h4>Caricature type</h4><div className="caricature-type-grid">{types.map(item => <button type="button" aria-pressed={caricatureType.id === item.id} onClick={() => setCaricatureType(item)} key={item.id}><b>{item.name}</b><span>{item.note}</span><small>{item.addition ? `Estimated +₹${inr.format(item.addition)}` : 'Included'}</small></button>)}</div><h4>Visual style</h4><div className="caricature-style-grid">{visualStyles.map(option => { const item = CARICATURE_STYLES[option.id]; return <button type="button" aria-pressed={brief.styleId === option.id} className={brief.styleId === option.id ? 'is-selected' : ''} onClick={() => patch('styleId', option.id as CaricatureStyleId)} key={option.id}><img src={item.image} loading="lazy" alt={`${option.name} fictional style demonstration`}/><span><b>{option.name}</b><small>{item.summary}</small><em>Fictional AI sample</em></span></button>; })}</div></div>}
      {step === 3 && <div className="wizard-pane"><header><b>Step 4 · Occasion and story</b><h3>Add the details that make it personal</h3><p>Exact wording is kept as a separate deterministic text instruction—not trusted to generated pixels.</p></header><div className="wizard-details"><label>Occasion<select value={brief.occasion} onChange={event => patch('occasion', event.target.value as CaricatureBrief['occasion'])}>{OCCASIONS.map(item => <option value={item} key={item}>{label(item)}</option>)}</select></label>{(['profession','hobbies','clothing','colours','background','props'] as const).map(key => <label key={key}>{key === 'props' ? 'Pet or meaningful objects' : label(key)}<input value={brief[key]} maxLength={120} onChange={event => patch(key, event.target.value)} /></label>)}<label className="wide">Short exact message<input value={shortMessage} maxLength={80} onChange={event => setShortMessage(event.target.value)} placeholder="Rendered separately after generation"/></label><label className="wide">Other story details<textarea rows={3} value={brief.notes} maxLength={300} onChange={event => patch('notes', event.target.value)} /></label></div></div>}
      {step === 4 && <div className="wizard-pane"><header><b>Step 5 · Finish and price</b><h3>Choose how the caricature should arrive</h3><p>Every amount below is an estimate until the studio confirms the quotation.</p></header><div className="caricature-finish-grid">{finishes.map(item => <button type="button" aria-pressed={finish.id === item.id} onClick={() => patch('output', item.id as CaricatureBrief['output'])} key={item.id}><b>{item.name}</b><strong>Starts ₹{inr.format(item.base)}</strong><span>{item.size}</span><small>{item.frame} · {item.revisions} · {item.time}</small></button>)}</div><label className="caricature-commercial"><input type="checkbox" checked={commercialUsage} onChange={e => setCommercialUsage(e.target.checked)}/><span>Commercial usage requested <small>Estimated +₹1,500; rights confirmed in writing.</small></span></label><label className="caricature-required-date">Required date<input type="date" value={requiredDate} onChange={e => setRequiredDate(e.target.value)}/></label><div className="caricature-price-summary" aria-live="polite"><span>Estimated brief total</span><strong>₹{inr.format(estimate)}</strong><small>Delivery is calculated separately · Studio quotation and availability required</small></div></div>}
      {step === 5 && <div className="wizard-pane"><header><b>Step 6 · Review and consent</b><h3>Check the brief and choose each permission</h3><p>Generation, retention, studio handoff, promotion and model training are separate choices.</p></header><div className="brief-review"><span><b>Photograph</b>{photo?.source === 'fictional-sample' ? 'Fictional sample' : 'Customer-selected photo'}</span><span><b>Subjects</b>{brief.people} people · {brief.pets} pets</span><span><b>Type & style</b>{caricatureType.name} · {style.name}</span><span><b>Occasion</b>{label(brief.occasion)}</span><span><b>Finish</b>{finish.name}</span><span><b>Estimate</b>₹{inr.format(estimate)} · Studio confirmation required</span></div><div className="caricature-consent-list"><Consent checked={permissions.process} onChange={value => setPermissions(p => ({ ...p, process: value }))}>I confirm I have permission to use this photograph and consent to secure processing for this requested concept.</Consent><Consent checked={permissions.ai} onChange={value => setPermissions(p => ({ ...p, ai: value }))}>I consent to ArtzyAI processing it to create this requested concept.</Consent>{brief.people + brief.pets > 1 && <Consent checked={permissions.people} onChange={value => setPermissions(p => ({ ...p, people: value }))}>I have permission for every person or pet photograph included.</Consent>}<Consent checked={permissions.childPresent} onChange={value => setPermissions(p => ({ ...p, childPresent: value }))}>This photograph contains a child.</Consent>{permissions.childPresent && <Consent checked={permissions.guardian} onChange={value => setPermissions(p => ({ ...p, guardian: value }))}>I am the parent/lawful guardian and give permission.</Consent>}<Consent checked={permissions.retain} onChange={value => setPermissions(p => ({ ...p, retain: value }))} optional>Save the photograph beyond the active request.</Consent><Consent checked={permissions.handoff} onChange={value => setPermissions(p => ({ ...p, handoff: value }))} optional>Send the selected photograph, concept and brief to Artzy’s Studio for review.</Consent><Consent checked={permissions.promotion} onChange={value => setPermissions(p => ({ ...p, promotion: value }))} optional>Allow promotional use by Artzy’s Studio.</Consent><Consent checked={permissions.training} onChange={value => setPermissions(p => ({ ...p, training: value }))} optional>Allow model-training use.</Consent></div><p className="privacy-note">Optional retention, promotional and training permissions are off by default. You can remove the photograph, delete a concept or withdraw before handoff.</p>{manual && <p className="manual-note">AI generation is disabled for this group size. Create a studio request for a careful studio review.</p>}<div className="caricature-review-actions"><button type="button" onClick={() => submitDraft(false)}>Request studio confirmation</button><button type="button" onClick={saveDraft}>Save and resume</button></div></div>}
      </div>{status && <p className="caricature-builder__status" role="status">{status}{erpReference && <> <Link href="/account">Track request →</Link></>}</p>}<div className="wizard-controls"><button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Previous</button>{step < 5 && <button type="button" onClick={() => setStep(Math.min(5, step + 1))} disabled={!canContinue}>Continue</button>}</div>
      {step === 5 && photo && <CaricatureArtzyAiPanel photoPreview={photo.preview} prompt={customerPrompt} onPromptChange={value => { setCustomerPrompt(value); setPromptEdited(true); }} exaggeration={exaggeration} onExaggerationChange={value => { setExaggeration(value); setPromptEdited(false); }} samples={samples} selectedAssetId={selectedAssetId} remaining={remaining} busy={busy} progress={progress} generationReady={permissionsReady} manual={manual} onGenerate={generate} onSelect={selectSample} onDelete={deleteSample} onStudioGuide={() => submitDraft(true)} onContinue={() => submitDraft(false)}/>}
    </div>
  </section>;
}

function Consent({ checked, onChange, optional = false, children }: { checked: boolean; onChange: (value: boolean) => void; optional?: boolean; children: React.ReactNode }) {
  return <label><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)}/><span>{children}{optional && <small> Optional</small>}</span></label>;
}
