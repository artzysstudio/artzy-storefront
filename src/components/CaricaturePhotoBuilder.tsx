"use client";

import { ChangeEvent, useMemo, useState } from 'react';
import {
  CARICATURE_STYLES, COMPOSITIONS, OCCASIONS, OUTPUTS, SUBJECTS,
  validatePhotoFile, type CaricatureBrief, type CaricatureStyleId,
  type CompositionId, type SubjectId,
} from '@/features/caricatures/config';

const label = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, character => character.toUpperCase());
const steps = ['Photo', 'Subjects', 'Style', 'Purpose', 'Details', 'Review'];

async function preparePhoto(file: File) {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read this photo.'));
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('This image could not be opened.'));
    element.src = source;
  });
  if (image.width < 320 || image.height < 320) throw new Error('Choose a clearer photo at least 320 × 320 pixels.');
  const scale = Math.min(1, 896 / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(256, Math.round(image.width * scale));
  canvas.height = Math.max(256, Math.round(image.height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Your browser could not prepare this photo.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', .86);
}

export default function CaricaturePhotoBuilder() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('');
  const [brief, setBrief] = useState<CaricatureBrief>({
    styleId: 'watercolour', occasion: 'birthday', composition: 'half_body', subject: 'one_person',
    people: 1, pets: 0, profession: '', hobbies: '', colours: '', clothing: '', background: '',
    props: '', notes: '', output: 'studio_guidance',
  });

  const patch = <K extends keyof CaricatureBrief>(key: K, value: CaricatureBrief[K]) =>
    setBrief(current => ({ ...current, [key]: value }));
  const style = CARICATURE_STYLES[brief.styleId];
  const canNext = [Boolean(photo), brief.people + brief.pets > 0, Boolean(brief.styleId), Boolean(brief.occasion && brief.composition), true, consent][step];

  const studioMessage = useMemo(() => [
    "Hello Artzy's Studio — I would like a premium hand-drawn caricature.",
    `Style: ${style.name}`,
    `Occasion: ${label(brief.occasion)}`,
    `Subjects: ${brief.people} people, ${brief.pets} pets`,
    `Composition: ${label(brief.composition)}`,
    `Background: ${brief.background || 'Studio recommendation'}`,
    `Props: ${brief.props || 'None'}`,
    `Final requirement: ${label(brief.output)}`,
    `Profession / hobbies: ${brief.profession || 'Not specified'} / ${brief.hobbies || 'Not specified'}`,
    `Colours / clothing: ${brief.colours || 'Studio guidance'} / ${brief.clothing || 'From reference'}`,
    `Notes: ${brief.notes || 'None'}`,
    '',
    'Please use the uploaded photograph as the primary identity reference. Preserve recognisable facial identity, hairstyle, skin tone, glasses/accessories and approximate age. Use moderate exaggeration, a slightly larger head, a friendly expressive face and artistic illustrated body proportions. Do not change ethnicity, gender or important facial identity, and do not add other people.',
  ].join('\n'), [brief, style.name]);

  function changeStep(nextStep: number) {
    const currentScroll = window.scrollY;
    setError('');
    setStep(Math.max(0, Math.min(5, nextStep)));
    requestAnimationFrame(() => window.scrollTo({ top: currentScroll, behavior: 'auto' }));
  }

  async function onPhoto(event: ChangeEvent<HTMLInputElement>) {
    setError('');
    setStatus('');
    const file = event.target.files?.[0];
    if (!file) return;
    const invalid = validatePhotoFile(file);
    if (invalid) { setError(invalid); return; }
    try {
      setPhoto(await preparePhoto(file));
      setPhotoFile(file);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not prepare this photo.');
    }
  }

  function chooseSubject(id: SubjectId) {
    const item = SUBJECTS.find(subject => subject.id === id)!;
    setBrief(current => ({ ...current, subject: id, people: item.people, pets: item.pets }));
  }

  async function sendToStudio() {
    if (!photoFile || !consent) return;
    setError('');
    setStatus('');
    if (navigator.canShare?.({ files: [photoFile] })) {
      try {
        await navigator.share({ title: 'Artzy Studio caricature request', text: studioMessage, files: [photoFile] });
        setStatus("Your photo and brief are ready with Artzy's Studio.");
        return;
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
      }
    }
    setStatus('WhatsApp is open. Please attach the selected photograph before sending your brief.');
    window.open(`https://wa.me/919158680722?text=${encodeURIComponent(studioMessage)}`, '_blank', 'noopener,noreferrer');
  }

  return <section className="caricature-builder caricature-wizard" id="caricature-builder" aria-labelledby="caricature-builder-title">
    <div className="caricature-builder__intro">
      <span className="service-eyebrow">Artzy Studio · photo-to-caricature</span>
      <h2 id="caricature-builder-title">Build the idea<br/><em>one clear step at a time.</em></h2>
      <p>Choose the style and details, then share one clear customer photograph. Deepti and Artzy&apos;s Studio will manage the creative process.</p>
      <ol className="caricature-stepper">{steps.map((name, index) => <li className={index === step ? 'is-current' : index < step ? 'is-done' : ''} key={name}><button type="button" onClick={() => changeStep(index)} aria-current={index === step ? 'step' : undefined}><span>{index + 1}</span>{name}</button></li>)}</ol>
    </div>
    <div className="caricature-builder__panel">
      <div className="caricature-builder__pane-stage">
        {step === 0 && <div className="wizard-pane"><header><b>Step 1</b><h3>Add one clear reference photograph</h3><p>Use a front-facing, well-lit image with every face fully visible. The photograph stays in this page until you choose to share it with the studio.</p></header><label className="caricature-upload"><span>{photo ? 'Choose another photo' : 'Take or upload a photo'}</span><input type="file" accept="image/jpeg,image/png,image/webp" capture="user" onChange={onPhoto}/><small>JPG, PNG or WebP · 320 px minimum · 8 MB maximum</small></label>{photo && <img className="wizard-photo" src={photo} alt="Uploaded reference preview"/>}</div>}
        {step === 1 && <div className="wizard-pane"><header><b>Step 2</b><h3>Who is in the artwork?</h3><p>Choose the closest group, then correct the numbers if needed.</p></header><div className="choice-chips">{SUBJECTS.map(item => <button type="button" className={brief.subject === item.id ? 'is-selected' : ''} onClick={() => chooseSubject(item.id)} key={item.id}>{item.label}</button>)}</div><div className="number-fields"><label>People<input type="number" min="0" max="12" value={brief.people} onChange={event => patch('people', Number(event.target.value))}/></label><label>Pets<input type="number" min="0" max="6" value={brief.pets} onChange={event => patch('pets', Number(event.target.value))}/></label></div></div>}
        {step === 2 && <div className="wizard-pane"><header><b>Step 3</b><h3>Choose a caricature style</h3><p>Select the visual direction you prefer. The studio will interpret it around the customer&apos;s identity.</p></header><div className="caricature-style-grid">{Object.values(CARICATURE_STYLES).map(item => <button type="button" aria-pressed={brief.styleId === item.id} className={brief.styleId === item.id ? 'is-selected' : ''} onClick={() => patch('styleId', item.id as CaricatureStyleId)} key={item.id}><img src={item.image} loading="lazy" alt={`${item.name} caricature style example`}/><span><b>{item.name}</b><small>{item.summary}</small><em>Best for: {item.bestFor}</em></span></button>)}</div></div>}
        {step === 3 && <div className="wizard-pane"><header><b>Step 4</b><h3>Purpose and composition</h3><p>These choices help the studio understand the occasion, framing and finish.</p></header><div className="wizard-selects"><label>Occasion<select value={brief.occasion} onChange={event => patch('occasion', event.target.value as CaricatureBrief['occasion'])}>{OCCASIONS.map(option => <option value={option} key={option}>{label(option)}</option>)}</select></label><label>Composition<select value={brief.composition} onChange={event => patch('composition', event.target.value as CompositionId)}>{COMPOSITIONS.filter(option => style.compositions.includes(option.id)).map(option => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label><label>Final requirement<select value={brief.output} onChange={event => patch('output', event.target.value as CaricatureBrief['output'])}>{OUTPUTS.map(option => <option value={option} key={option}>{label(option)}</option>)}</select></label></div></div>}
        {step === 4 && <div className="wizard-pane"><header><b>Step 5</b><h3>Add the details that make it personal</h3><p>Optional—leave anything blank when you want Deepti&apos;s guidance.</p></header><div className="wizard-details">{(['profession', 'hobbies', 'colours', 'clothing', 'background', 'props'] as const).map(key => <label key={key}>{label(key)}<input value={brief[key]} maxLength={120} onChange={event => patch(key, event.target.value)} placeholder={`Add ${label(key).toLowerCase()}…`}/></label>)}<label className="wide">Customer notes<textarea rows={3} value={brief.notes} maxLength={240} onChange={event => patch('notes', event.target.value)} placeholder="Important expressions, relationship, mood or instructions…"/></label></div></div>}
        {step === 5 && <div className="wizard-pane"><header><b>Step 6</b><h3>Review and share with the studio</h3><p>No AI preview is generated. Your photograph and choices are shared only when you press the studio button.</p></header><div className="brief-review"><span><b>Style</b>{style.name}</span><span><b>Occasion</b>{label(brief.occasion)}</span><span><b>Subjects</b>{brief.people} people · {brief.pets} pets</span><span><b>Composition</b>{label(brief.composition)}</span><span><b>Requirement</b>{label(brief.output)}</span></div><label className="caricature-builder__consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)}/><span><b>Required permission</b>I have permission to share every selected photograph with Artzy&apos;s Studio for this caricature request. For a child, I am their parent or guardian.</span></label><button className="wizard-primary" type="button" onClick={sendToStudio} disabled={!consent || !photoFile}>Send photo &amp; brief to Artzy&apos;s Studio</button>{!consent && <small className="consent-hint">Tick the permission box to continue with the studio.</small>}</div>}
      </div>
      {error && <p className="caricature-builder__error" role="alert">{error}</p>}
      {status && <p className="caricature-builder__status" role="status">{status}</p>}
      <div className="wizard-controls"><button type="button" onClick={() => changeStep(step - 1)} disabled={step === 0}>Back</button>{step < 5 && <button type="button" onClick={() => changeStep(step + 1)} disabled={!canNext}>Continue</button>}</div>
    </div>
  </section>;
}
