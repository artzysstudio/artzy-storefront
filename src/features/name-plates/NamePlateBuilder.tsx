"use client";

import { useMemo, useState } from 'react';

const shapes = [
  { name: 'Classic rectangle', slug: 'classic-rectangle', price: 0, note: 'Balanced and timeless' },
  { name: 'Gentle arch', slug: 'gentle-arch', price: 250, note: 'Soft traditional crown' },
  { name: 'Scalloped', slug: 'scalloped', price: 350, note: 'Decorative curved edge' },
  { name: 'Oval', slug: 'oval', price: 300, note: 'Graceful compact form' },
];
const motifs = [
  { name: 'Botanical', slug: 'botanical', price: 450, note: 'Hand-painted leaves and flowers' },
  { name: 'Lotus', slug: 'lotus', price: 450, note: 'Centred lotus with fine foliage' },
  { name: 'Warli', slug: 'warli', price: 650, note: 'Narrative figures and folk border' },
  { name: 'Geometric', slug: 'geometric', price: 250, note: 'Contemporary lines and rhythm' },
  { name: 'Madhubani', slug: 'madhubani', price: 750, note: 'Detailed folk florals and pattern' },
  { name: 'Minimal', slug: 'minimal', price: 0, note: 'Clean border and signature accent' },
];
const palettes = [
  { name: 'Terracotta rose', slug: 'terracotta' },
  { name: 'Olive & gold', slug: 'olive' },
  { name: 'Indigo folk', slug: 'indigo' },
  { name: 'Warm monochrome', slug: 'monochrome' },
];
const sizes = [
  { name: 'Compact · 12 × 6 in', slug: 'compact', price: 1690 },
  { name: 'Standard · 16 × 8 in', slug: 'standard', price: 2490 },
  { name: 'Statement · 20 × 10 in', slug: 'statement', price: 3690 },
];
const mountings = [
  { name: 'Wall hooks / screws', price: 0 },
  { name: 'Decorative hanging rope', price: 180 },
  { name: 'Stand-off mounts', price: 350 },
];

const inr = new Intl.NumberFormat('en-IN');

export default function NamePlateBuilder() {
  const [familyName, setFamilyName] = useState('The Shah Family');
  const [secondLine, setSecondLine] = useState('Welcome home');
  const [shape, setShape] = useState(shapes[0]);
  const [motif, setMotif] = useState(motifs[0]);
  const [palette, setPalette] = useState(palettes[0]);
  const [size, setSize] = useState(sizes[1]);
  const [mounting, setMounting] = useState(mountings[0]);

  const estimate = size.price + shape.price + motif.price + mounting.price;
  const brief = useMemo(() => [
    "Hello Artzy's Studio, I would like to enquire about a custom name plate.",
    `Main name: ${familyName || 'To be discussed'}`,
    `Second line: ${secondLine || 'None'}`,
    `Shape: ${shape.name}`,
    `Painting style: ${motif.name}`,
    `Palette: ${palette.name}`,
    `Approximate size: ${size.name}`,
    `Mounting: ${mounting.name}`,
    `Website estimate: ₹${inr.format(estimate)}`,
    'Please confirm design feasibility, material, final price and delivery time.',
  ].join('\n'), [familyName, secondLine, shape, motif, palette, size, mounting, estimate]);

  const reset = () => {
    setFamilyName('The Shah Family'); setSecondLine('Welcome home'); setShape(shapes[0]);
    setMotif(motifs[0]); setPalette(palettes[0]); setSize(sizes[1]); setMounting(mountings[0]);
  };

  return <section className="plate-builder" id="name-plate-builder" aria-labelledby="plate-builder-title">
    <header className="plate-builder__heading"><div><span>Build your direction</span><h2 id="plate-builder-title">See the idea take shape.</h2></div><p>Choose a starting direction and enter the wording. The preview and estimate update instantly; Deepti&apos;s studio confirms the final drawing, material, price and timeline before production.</p></header>
    <div className="plate-builder__workspace">
      <div className="plate-builder__preview-panel">
        <div className="plate-builder__wall">
          <div className={`live-name-plate live-name-plate--${shape.slug} live-name-plate--${palette.slug} live-name-plate--motif-${motif.slug}`} aria-live="polite">
            <span className="live-name-plate__pattern" aria-hidden="true"><i/><i/><i/><i/><i/></span>
            <strong>{familyName || 'Your name here'}</strong>
            <small>{secondLine || 'Your second line'}</small>
            <em>{motif.name} style</em>
          </div>
        </div>
        <div className="plate-preview-note"><span>Live design preview</span><small>Illustrative only · not an AR or production proof</small></div>
        <div className="plate-estimate-card" aria-live="polite">
          <div><span>Estimated price</span><strong>₹{inr.format(estimate)}</strong><small>Indicative total for the selected direction</small></div>
          <dl><div><dt>{size.name}</dt><dd>₹{inr.format(size.price)}</dd></div>{shape.price > 0 && <div><dt>{shape.name}</dt><dd>+₹{inr.format(shape.price)}</dd></div>}<div><dt>{motif.name} painting</dt><dd>{motif.price ? `+₹${inr.format(motif.price)}` : 'Included'}</dd></div>{mounting.price > 0 && <div><dt>{mounting.name}</dt><dd>+₹{inr.format(mounting.price)}</dd></div>}</dl>
          <p>Final price may change with material, lettering language, artwork detail, taxes and delivery. The studio confirms it before work begins.</p>
        </div>
      </div>

      <form className="plate-builder__controls" onSubmit={(event) => event.preventDefault()}>
        <fieldset><legend>1 · Your wording</legend><div className="plate-input-grid"><label>Main name<input value={familyName} onChange={(e) => setFamilyName(e.target.value.slice(0, 36))} maxLength={36} placeholder="Family or home name"/></label><label>Second line <small>Optional</small><input value={secondLine} onChange={(e) => setSecondLine(e.target.value.slice(0, 42))} maxLength={42} placeholder="Flat number, welcome line or names"/></label></div><p className="plate-field-help">You may type English, Marathi, Hindi or another preferred script. The studio will check spelling with you before painting.</p></fieldset>
        <fieldset><legend>2 · Shape</legend><div className="plate-shape-options">{shapes.map((item) => <button type="button" className={shape.slug === item.slug ? 'selected' : ''} onClick={() => setShape(item)} key={item.slug}><i className={`plate-shape-icon plate-shape-icon--${item.slug}`} aria-hidden="true"/><span><b>{item.name}</b><small>{item.note}{item.price ? ` · +₹${inr.format(item.price)}` : ' · included'}</small></span></button>)}</div></fieldset>
        <fieldset><legend>3 · Painting style</legend><div className="plate-motif-options">{motifs.map((item) => <button type="button" className={motif.slug === item.slug ? 'selected' : ''} onClick={() => setMotif(item)} key={item.slug}><i className={`plate-motif-icon plate-motif-icon--${item.slug}`} aria-hidden="true"><span/><span/><span/></i><span><b>{item.name}</b><small>{item.note}{item.price ? ` · +₹${inr.format(item.price)}` : ' · included'}</small></span></button>)}</div></fieldset>
        <fieldset><legend>4 · Colour mood</legend><div className="plate-palette-options">{palettes.map((item) => <button type="button" className={palette.slug === item.slug ? 'selected' : ''} onClick={() => setPalette(item)} key={item.slug}><i className={`plate-swatch plate-swatch--${item.slug}`} aria-hidden="true"/><span>{item.name}</span></button>)}</div></fieldset>
        <div className="plate-select-grid"><label>Approximate size<select value={size.slug} onChange={(e) => setSize(sizes.find((item) => item.slug === e.target.value) ?? sizes[1])}>{sizes.map((item) => <option value={item.slug} key={item.slug}>{item.name} · from ₹{inr.format(item.price)}</option>)}</select></label><label>Mounting preference<select value={mounting.name} onChange={(e) => setMounting(mountings.find((item) => item.name === e.target.value) ?? mountings[0])}>{mountings.map((item) => <option value={item.name} key={item.name}>{item.name}{item.price ? ` · +₹${inr.format(item.price)}` : ' · included'}</option>)}</select></label></div>
        <div className="plate-builder__actions"><a href={`https://wa.me/919158680722?text=${encodeURIComponent(brief)}`} target="_blank" rel="noreferrer">Send design + estimate on WhatsApp</a><button type="button" onClick={reset}>Start again</button></div>
        <p className="plate-builder__assurance"><b>Before anything is made:</b> the studio confirms spelling, artwork, material, mounting, final price and realistic delivery time. No payment is taken from this builder.</p>
      </form>
    </div>
  </section>;
}
