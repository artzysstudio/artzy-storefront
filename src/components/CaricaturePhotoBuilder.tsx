'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { createConsent, createCreativeJob, deleteCreativeAsset, uploadReference, waitForCreativeJob } from '@/lib/artzyai';
import { aiReliable, CARICATURE_STYLES, COMPOSITIONS, OCCASIONS, OUTPUTS, SUBJECTS, validatePhotoFile, type CaricatureBrief, type CaricatureStyleId, type CompositionId, type SubjectId } from '@/features/caricatures/config';

const label = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, character => character.toUpperCase());
const steps = ['Photo', 'Subjects', 'Style', 'Purpose', 'Details', 'Review'];

async function preparePhoto(file: File): Promise<{ preview: string; file: File }> {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Could not read this photo.')); reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image(); element.onload = () => resolve(element); element.onerror = () => reject(new Error('This image could not be opened.')); element.src = source;
  });
  if (image.width < 320 || image.height < 320) throw new Error('Choose a clearer photo at least 320 × 320 pixels.');
  const scale = Math.min(1, 512 / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas'); canvas.width = Math.max(256, Math.round(image.width * scale)); canvas.height = Math.max(256, Math.round(image.height * scale));
  const context = canvas.getContext('2d'); if (!context) throw new Error('Your browser could not prepare this photo.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Could not prepare this photo.')), 'image/jpeg', .86));
  return { preview: URL.createObjectURL(blob), file: new File([blob], 'artzy-caricature-reference.jpg', { type: 'image/jpeg' }) };
}

export default function CaricaturePhotoBuilder() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [concept, setConcept] = useState('');
  const [assetId, setAssetId] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [permissions, setPermissions] = useState({ process: false, ai: false, storage: false, people: false, childPresent: false, guardian: false, handoff: false });
  const [brief, setBrief] = useState<CaricatureBrief>({ styleId: 'watercolour', occasion: 'birthday', composition: 'half_body', subject: 'one_person', people: 1, pets: 0, profession: '', hobbies: '', colours: '', clothing: '', background: '', props: '', notes: '', output: 'studio_guidance' });
  const patch = <K extends keyof CaricatureBrief>(key: K, value: CaricatureBrief[K]) => setBrief(current => ({ ...current, [key]: value }));
  const manual = !aiReliable(brief);
  const style = CARICATURE_STYLES[brief.styleId];
  const permissionsReady = permissions.process && permissions.ai && permissions.storage && (brief.people <= 1 || permissions.people) && (!permissions.childPresent || permissions.guardian);
  const canNext = [Boolean(photo), brief.people + brief.pets > 0, Boolean(brief.styleId), Boolean(brief.occasion && brief.composition), true, permissionsReady][step];
  const whatsapp = useMemo(() => `https://wa.me/919158680722?text=${encodeURIComponent([`Hello Artzy's Studio — Caricature brief ${reference || '(new)'}`, `Style: ${style.name}`, `Occasion: ${label(brief.occasion)}`, `Subjects: ${brief.people} people, ${brief.pets} pets`, `Composition: ${label(brief.composition)}`, `Background / props: ${brief.background || 'Studio guidance'} / ${brief.props || 'None'}`, `Requirement: ${label(brief.output)}`, `Notes: ${brief.notes || 'None'}`, 'AI concept—not the final studio caricature. Please confirm likeness review, feasibility, price and timeline.'].join('\n'))}`, [brief, reference, style.name]);

  async function onPhoto(event: ChangeEvent<HTMLInputElement>) {
    setError('');
    const file = event.target.files?.[0]; if (!file) return;
    const invalid = validatePhotoFile(file); if (invalid) { setError(invalid); return; }
    try {
      if (photo.startsWith('blob:')) URL.revokeObjectURL(photo);
      if (concept) await removeConcept();
      const prepared = await preparePhoto(file); setPhoto(prepared.preview); setPhotoFile(prepared.file);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not prepare this photo.'); }
  }

  function removePhoto() {
    if (photo.startsWith('blob:')) URL.revokeObjectURL(photo);
    setPhoto(''); setPhotoFile(null); setStep(0);
  }

  function chooseSubject(id: SubjectId) {
    const item = SUBJECTS.find(subject => subject.id === id)!;
    setBrief(current => ({ ...current, subject: id, people: item.people, pets: item.pets }));
  }

  async function generate() {
    if (busy || manual) return;
    if (!photoFile) { setError('Add a reference photograph before generating.'); setStep(0); return; }
    if (!permissionsReady) { setError('Complete the required permissions before generating your AI concept.'); return; }
    setBusy(true); setError(''); setProgress('Sending your photograph securely to ArtzyAI');
    try {
      const consent = await createConsent({ tool: 'caricature', imageProcessing: permissions.process, aiGeneration: permissions.ai, temporaryStorage: permissions.storage, studioHandoff: permissions.handoff, containsOtherPeople: brief.people > 1, otherPeoplePermission: permissions.people, containsChildren: permissions.childPresent, guardianConfirmation: permissions.guardian, trainingOptIn: false });
      const uploaded = await uploadReference(photoFile, consent.consentId);
      const queued = await createCreativeJob({
        sourceApp: 'artzy-storefront', tool: 'caricature', mode: 'preview', purpose: `${brief.occasion}; ${brief.composition}; ${brief.people} people and ${brief.pets} pets; ${brief.profession}; ${brief.hobbies}; ${brief.background}; ${brief.props}; ${brief.notes}`,
        style: style.name.toLowerCase(), palette: (brief.colours || 'warm terracotta, cream, muted rose').split(',').map(value => value.trim()).filter(Boolean), outputFormat: 'jpeg', aspectRatio: '1:1', referenceAssetIds: [uploaded.assetId], customerTextOverlay: '', storefrontContext: { page: '/caricatures/', composition: brief.composition, occasion: brief.occasion }, erpContext: {}, consentId: consent.consentId,
      });
      setReference(queued.jobId);
      const completed = await waitForCreativeJob(queued.jobId, setProgress);
      if (completed.status !== 'completed' || !completed.previewUrl || !completed.assetId) throw new Error(completed.customerMessage || 'The concept could not be generated.');
      setConcept(completed.previewUrl); setAssetId(completed.assetId);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'The concept could not be generated.'); }
    finally { setBusy(false); setProgress(''); }
  }

  async function removeConcept() {
    if (assetId) await deleteCreativeAsset(assetId).catch(() => undefined);
    setConcept(''); setAssetId('');
  }

  return <section className="caricature-builder caricature-wizard" id="caricature-builder" aria-labelledby="caricature-builder-title">
    <div className="caricature-builder__intro"><span className="service-eyebrow">Powered by ArtzyAI · photo-to-caricature</span><h2 id="caricature-builder-title">Build the idea<br/><em>one clear step at a time.</em></h2><p>ArtzyAI helps you imagine the creative direction. Deepti and Artzy’s Studio confirm what can actually be made.</p><small>AI concept—not the final studio caricature. Facial likeness is not guaranteed; the studio reviews every final order.</small><ol className="caricature-stepper">{steps.map((name, index) => <li className={index === step ? 'is-current' : index < step ? 'is-done' : ''} key={name}><button type="button" onClick={() => setStep(index)} aria-current={index === step ? 'step' : undefined}><span>{index + 1}</span>{name}</button></li>)}</ol></div>
    <div className="caricature-builder__panel">
      {step === 0 && <div className="wizard-pane"><header><b>Step 1</b><h3>Add one clear reference photograph</h3><p>Your photograph will be sent securely to ArtzyAI to create the requested concept.</p></header><label className="caricature-upload"><span>{photo ? 'Replace image' : 'Take or upload a photo'}</span><input type="file" accept="image/jpeg,image/png,image/webp" capture="user" onChange={onPhoto}/><small>JPG, PNG or WebP · 320 px minimum · 8 MB maximum</small></label>{photo && <><img className="wizard-photo" src={photo} alt="Uploaded reference preview"/><button type="button" className="text-button" onClick={removePhoto}>Remove image</button></>}</div>}
      {step === 1 && <div className="wizard-pane"><header><b>Step 2</b><h3>Who is in the artwork?</h3><p>Choose the closest group, then correct the numbers.</p></header><div className="choice-chips">{SUBJECTS.map(item => <button type="button" className={brief.subject === item.id ? 'is-selected' : ''} onClick={() => chooseSubject(item.id)} key={item.id}>{item.label}</button>)}</div><div className="number-fields"><label>People<input type="number" min="0" max="12" value={brief.people} onChange={event => patch('people', Number(event.target.value))}/></label><label>Pets<input type="number" min="0" max="6" value={brief.pets} onChange={event => patch('pets', Number(event.target.value))}/></label></div>{manual && <p className="manual-note">AI preview supports up to 4 people and 2 pets. Larger groups go directly to the studio for a reliable manual review.</p>}</div>}
      {step === 2 && <div className="wizard-pane"><header><b>Step 3</b><h3>Choose a caricature style</h3><p>Every example is fictional and AI-generated—not a real customer.</p></header><div className="caricature-style-grid">{Object.values(CARICATURE_STYLES).map(item => <button type="button" aria-pressed={brief.styleId === item.id} className={brief.styleId === item.id ? 'is-selected' : ''} onClick={() => patch('styleId', item.id as CaricatureStyleId)} key={item.id}><img src={item.image} loading="lazy" alt={`${item.name} fictional AI-generated style demonstration`}/><span><b>{item.name}</b><small>{item.summary}</small><em>Best for: {item.bestFor}</em></span></button>)}</div></div>}
      {step === 3 && <div className="wizard-pane"><header><b>Step 4</b><h3>Purpose and composition</h3><p>These choices guide the mood and framing; the studio confirms the final result.</p></header><div className="wizard-selects"><label>Occasion<select value={brief.occasion} onChange={event => patch('occasion', event.target.value as CaricatureBrief['occasion'])}>{OCCASIONS.map(item => <option value={item} key={item}>{label(item)}</option>)}</select></label><label>Composition<select value={brief.composition} onChange={event => patch('composition', event.target.value as CompositionId)}>{COMPOSITIONS.filter(item => style.compositions.includes(item.id)).map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label><label>Final requirement<select value={brief.output} onChange={event => patch('output', event.target.value as CaricatureBrief['output'])}>{OUTPUTS.map(item => <option value={item} key={item}>{label(item)}</option>)}</select></label></div></div>}
      {step === 4 && <div className="wizard-pane"><header><b>Step 5</b><h3>Add the details that make it personal</h3><p>Optional—leave anything blank when you want Deepti’s guidance.</p></header><div className="wizard-details">{(['profession', 'hobbies', 'colours', 'clothing', 'background', 'props'] as const).map(key => <label key={key}>{label(key)}<input value={brief[key]} maxLength={120} onChange={event => patch(key, event.target.value)} placeholder={`Add ${label(key).toLowerCase()}…`}/></label>)}<label className="wide">Customer notes<textarea rows={3} value={brief.notes} maxLength={240} onChange={event => patch('notes', event.target.value)} placeholder="Important expressions, relationship, mood or instructions…"/></label></div></div>}
      {step === 5 && <div className="wizard-pane"><header><b>Step 6</b><h3>Review privacy and give permission</h3><p>Your photograph is temporarily stored for this concept and is not used for model training.</p></header><div className="brief-review"><span><b>Style</b>{style.name}</span><span><b>Occasion</b>{label(brief.occasion)}</span><span><b>Subjects</b>{brief.people} people · {brief.pets} pets</span><span><b>Composition</b>{label(brief.composition)}</span></div><div className="caricature-consent-list">{[
        ['process', 'I consent to secure image processing by ArtzyAI.'], ['ai', 'I consent to AI generation for this requested concept.'], ['storage', 'I consent to temporary storage for up to 72 hours.'], ...(brief.people > 1 ? [['people', 'I have permission from every other person shown.']] : []), ['childPresent', 'This photograph contains a child.'], ...(permissions.childPresent ? [['guardian', 'I am the child’s parent or lawful guardian and give permission.']] : []), ['handoff', 'Optional: I allow the concept and brief to be shared with Artzy’s Studio when I request a studio review.'],
      ].map(([key, text]) => <label key={key}><input type="checkbox" checked={permissions[key as keyof typeof permissions]} onChange={event => setPermissions(current => ({ ...current, [key]: event.target.checked }))}/><span>{text}</span></label>)}</div><p className="privacy-note">Training use is off and is not bundled with generation consent. You can remove the image, delete the concept, or withdraw before studio handoff.</p>{manual ? <a className="wizard-primary" href={whatsapp} target="_blank" rel="noreferrer">Send larger-group brief to studio</a> : <button className="wizard-primary" type="button" onClick={generate} disabled={busy || !permissionsReady}>{busy ? 'Creating your AI concept…' : 'Generate AI concept'}</button>}</div>}
      {busy && <p className="wizard-progress" role="status">{progress}</p>}{error && <p className="caricature-builder__error" role="alert">{error}</p>}
      <div className="wizard-controls"><button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</button>{step < 5 && <button type="button" onClick={() => setStep(Math.min(5, step + 1))} disabled={!canNext}>Continue</button>}</div>
      {concept && <div className="caricature-result" aria-live="polite"><h3>Your ArtzyAI concept is ready</h3><p className="concept-review-note"><b>Compare the face, expression and selected style.</b> This is a direction preview—not guaranteed likeness or the final studio caricature.</p><div className="caricature-builder__comparison"><figure><img src={photo} alt="Uploaded reference photo"/><figcaption>Uploaded reference photo</figcaption></figure><span aria-hidden="true">→</span><figure><img src={concept} alt="ArtzyAI-generated caricature concept preview"/><figcaption>AI concept · not a production proof</figcaption></figure></div><p><b>{style.name} · {label(brief.occasion)} · {label(brief.composition)}</b><br/>Artzy’s Studio reviews feasibility, likeness, price and delivery time before final production. {reference && `Reference: ${reference}`}</p><div className="caricature-builder__actions"><button type="button" onClick={generate} disabled={busy}>Try another direction</button><a href={concept} download={`${reference || 'artzy-caricature'}-concept.jpg`}>Save concept</a><a href={whatsapp} target="_blank" rel="noreferrer">Send to Artzy’s Studio</a><button type="button" onClick={removeConcept}>Delete concept</button></div></div>}
    </div>
  </section>;
}
