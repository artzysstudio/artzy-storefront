"use client";

import { useMemo, useState } from 'react';
import ArtDirectionMark from '@/components/ArtDirectionMark';
import AIConceptPreview from '@/components/AIConceptPreview';
import { ART_DIRECTIONS, type ArtDirectionId } from '@/data/artDirections';

const shapes = [
  { name: 'Classic rectangle', slug: 'classic-rectangle', price: 0, note: 'Balanced and timeless' },
  { name: 'Gentle arch', slug: 'gentle-arch', price: 250, note: 'Soft traditional crown' },
  { name: 'Scalloped', slug: 'scalloped', price: 350, note: 'Decorative curved edge' },
  { name: 'Oval', slug: 'oval', price: 300, note: 'Graceful compact form' },
];
const motifPrices: Partial<Record<ArtDirectionId, number>> = {
  botanical: 450, lotus: 450, warli: 650, geometric: 250, madhubani: 750, minimal: 0,
};
const motifs = (['botanical', 'lotus', 'warli', 'geometric', 'madhubani', 'minimal'] as ArtDirectionId[]).map((slug) => ({
  ...ART_DIRECTIONS[slug], slug, price: motifPrices[slug] ?? 0, note: ART_DIRECTIONS[slug].shortNote,
}));
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
const placements = [
  { name: 'Flat or apartment door', slug: 'door', note: 'Compact, readable and easy to mount' },
  { name: 'Entrance wall', slug: 'wall', note: 'More space for artwork and a welcome line' },
  { name: 'Covered gate or veranda', slug: 'covered', note: 'Needs a protected finish and site check' },
  { name: 'Desk or reception counter', slug: 'desk', note: 'A standing format for home or business' },
];
const materials = [
  { name: 'Painted engineered-wood base', slug: 'engineered', price: 0, note: 'Smooth surface for detailed painting' },
  { name: 'Natural wood base', slug: 'wood', price: 850, note: 'Visible grain and a warmer handcrafted feel' },
  { name: 'Layered wood & acrylic', slug: 'layered', price: 1200, note: 'Raised lettering with a contemporary finish' },
];
const protections = [
  { name: 'Indoor finish', slug: 'indoor', price: 0, note: 'For an interior door, wall or desk' },
  { name: 'Covered-area protective coat', slug: 'covered', price: 350, note: 'For a sheltered entrance away from direct rain' },
  { name: 'Outdoor suitability review', slug: 'outdoor', price: 0, note: 'Studio must inspect location before quoting' },
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
  const [placement, setPlacement] = useState(placements[0]);
  const [material, setMaterial] = useState(materials[0]);
  const [protection, setProtection] = useState(protections[0]);

  const estimate = size.price + shape.price + motif.price + mounting.price + material.price + protection.price;
  const leadTime = motif.slug === 'madhubani' || motif.slug === 'warli'
    ? 'Approximately 12–18 working days after design approval'
    : size.slug === 'statement'
      ? 'Approximately 10–16 working days after design approval'
      : 'Approximately 8–14 working days after design approval';
  const brief = useMemo(() => [
    "Hello Artzy's Studio, I would like to enquire about a custom name plate.",
    `Main name: ${familyName || 'To be discussed'}`,
    `Second line: ${secondLine || 'None'}`,
    `Shape: ${shape.name}`,
    `Painting style: ${motif.name}`,
    `Palette: ${palette.name}`,
    `Approximate size: ${size.name}`,
    `Placement: ${placement.name}`,
    `Preferred material: ${material.name}`,
    `Protection: ${protection.name}`,
    `Mounting: ${mounting.name}`,
    `Website estimate: ₹${inr.format(estimate)}`,
    `Indicative making time: ${leadTime}`,
    'I understand that an outdoor location requires a studio suitability review.',
    'Please confirm design feasibility, material, final price and delivery time.',
  ].join('\n'), [familyName, secondLine, shape, motif, palette, size, placement, material, protection, mounting, estimate, leadTime]);

  const reset = () => {
    setFamilyName('The Shah Family'); setSecondLine('Welcome home'); setShape(shapes[0]);
    setMotif(motifs[0]); setPalette(palettes[0]); setSize(sizes[1]); setMounting(mountings[0]);
    setPlacement(placements[0]); setMaterial(materials[0]); setProtection(protections[0]);
  };

  return <section className="plate-builder" id="name-plate-builder" aria-labelledby="plate-builder-title">
    <header className="plate-builder__heading"><div><span>Guided name-plate builder</span><h2 id="plate-builder-title">Make confident choices,<br/><em>one step at a time.</em></h2></div><div><p>Start with where it will go, then choose the wording and artwork. Every option updates the preview, estimate and studio brief.</p><ol className="plate-builder__steps" aria-label="Builder stages"><li><b>1</b>Place</li><li><b>2</b>Personalise</li><li><b>3</b>Finish</li><li><b>4</b>Confirm</li></ol></div></header>
    <div className="plate-builder__workspace">
      <div className="plate-builder__preview-panel">
        <div className="plate-builder__wall">
          <div className={`live-name-plate live-name-plate--${shape.slug} live-name-plate--${palette.slug} live-name-plate--motif-${motif.slug}`} aria-live="polite">
            <ArtDirectionMark direction={motif.slug} className="live-name-plate__art" frame/>
            <span className="live-name-plate__copy"><strong>{familyName || 'Your name here'}</strong><small>{secondLine || 'Your second line'}</small><em>{motif.name} style</em></span>
          </div>
        </div>
        <div className="plate-preview-note"><span>Live design preview</span><small>Illustrative only · not an AR or production proof</small></div>
        <div className="plate-estimate-card" aria-live="polite">
          <div><span>Estimated price</span><strong>₹{inr.format(estimate)}</strong><small>Indicative total for the selected direction</small></div>
          <dl><div><dt>{size.name}</dt><dd>₹{inr.format(size.price)}</dd></div>{shape.price > 0 && <div><dt>{shape.name}</dt><dd>+₹{inr.format(shape.price)}</dd></div>}<div><dt>{motif.name} painting</dt><dd>{motif.price ? `+₹${inr.format(motif.price)}` : 'Included'}</dd></div>{material.price > 0 && <div><dt>{material.name}</dt><dd>+₹{inr.format(material.price)}</dd></div>}{protection.price > 0 && <div><dt>{protection.name}</dt><dd>+₹{inr.format(protection.price)}</dd></div>}{mounting.price > 0 && <div><dt>{mounting.name}</dt><dd>+₹{inr.format(mounting.price)}</dd></div>}</dl>
          <div className="plate-lead-time"><span>Indicative making time</span><strong>{leadTime}</strong></div>
          <p>Final price and time may change after the studio checks dimensions, material availability, artwork detail, taxes and delivery. Nothing is charged here.</p>
        </div>
      </div>

      <form className="plate-builder__controls" onSubmit={(event) => event.preventDefault()}>
        <fieldset><legend>1 · Where will it go?</legend><div className="plate-placement-options">{placements.map((item) => <button type="button" className={placement.slug === item.slug ? 'selected' : ''} onClick={() => setPlacement(item)} key={item.slug}><span><b>{item.name}</b><small>{item.note}</small></span></button>)}</div><p className="plate-field-help">For an exposed outdoor location, the studio must review a photograph before confirming material and durability.</p></fieldset>
        <fieldset><legend>2 · Your wording</legend><div className="plate-input-grid"><label>Main name<input value={familyName} onChange={(e) => setFamilyName(e.target.value.slice(0, 36))} maxLength={36} placeholder="Family or home name"/></label><label>Second line <small>Optional</small><input value={secondLine} onChange={(e) => setSecondLine(e.target.value.slice(0, 42))} maxLength={42} placeholder="Flat number, welcome line or names"/></label></div><p className="plate-field-help">English, Marathi, Hindi and other scripts are welcome. The studio sends a spelling proof for approval before making.</p></fieldset>
        <fieldset><legend>3 · Shape</legend><div className="plate-shape-options">{shapes.map((item) => <button type="button" className={shape.slug === item.slug ? 'selected' : ''} onClick={() => setShape(item)} key={item.slug}><i className={`plate-shape-icon plate-shape-icon--${item.slug}`} aria-hidden="true"/><span><b>{item.name}</b><small>{item.note}{item.price ? ` · +₹${inr.format(item.price)}` : ' · included'}</small></span></button>)}</div></fieldset>
        <fieldset><legend>4 · Painting direction</legend><div className="plate-motif-options">{motifs.map((item) => <button type="button" className={motif.slug === item.slug ? 'selected' : ''} onClick={() => setMotif(item)} key={item.slug}><ArtDirectionMark direction={item.slug}/><span><b>{item.name}</b><small>{item.note}{item.price ? ` · +₹${inr.format(item.price)}` : ' · included'}</small></span></button>)}</div><p className="plate-field-help"><b>{motif.name}:</b> {motif.visualLanguage}. {motif.studioNote}</p></fieldset>
        <fieldset><legend>5 · Colour mood</legend><div className="plate-palette-options">{palettes.map((item) => <button type="button" className={palette.slug === item.slug ? 'selected' : ''} onClick={() => setPalette(item)} key={item.slug}><i className={`plate-swatch plate-swatch--${item.slug}`} aria-hidden="true"/><span>{item.name}</span></button>)}</div></fieldset>
        <fieldset><legend>6 · Material, protection and fitting</legend><div className="plate-material-options">{materials.map((item) => <button type="button" className={material.slug === item.slug ? 'selected' : ''} onClick={() => setMaterial(item)} key={item.slug}><span><b>{item.name}</b><small>{item.note}{item.price ? ` · +₹${inr.format(item.price)}` : ' · included'}</small></span></button>)}</div><div className="plate-select-grid plate-select-grid--spaced"><label>Approximate size<select value={size.slug} onChange={(e) => setSize(sizes.find((item) => item.slug === e.target.value) ?? sizes[1])}>{sizes.map((item) => <option value={item.slug} key={item.slug}>{item.name} · from ₹{inr.format(item.price)}</option>)}</select></label><label>Surface protection<select value={protection.slug} onChange={(e) => setProtection(protections.find((item) => item.slug === e.target.value) ?? protections[0])}>{protections.map((item) => <option value={item.slug} key={item.slug}>{item.name}{item.price ? ` · +₹${inr.format(item.price)}` : ''}</option>)}</select></label><label>Mounting preference<select value={mounting.name} onChange={(e) => setMounting(mountings.find((item) => item.name === e.target.value) ?? mountings[0])}>{mountings.map((item) => <option value={item.name} key={item.name}>{item.name}{item.price ? ` · +₹${inr.format(item.price)}` : ' · included'}</option>)}</select></label></div></fieldset>
        <div className="plate-choice-summary" aria-live="polite"><span>Ready for studio review</span><ul><li>{placement.name}</li><li>{size.name}</li><li>{material.name}</li><li>{motif.name}</li></ul><p>Estimated ₹{inr.format(estimate)} · {leadTime}</p></div>
        <div className="plate-builder__actions"><a className="plate-builder__ai-action" href="#ai-preview">Generate an Artzy Muse concept</a><a href={`https://wa.me/919158680722?text=${encodeURIComponent(brief)}`} target="_blank" rel="noreferrer">Review my brief with the studio</a><button type="button" onClick={reset}>Start again</button></div>
        <p className="plate-builder__assurance"><b>Before anything is made:</b> the studio confirms spelling, artwork, material, mounting, final price and realistic delivery time. No payment is taken from this builder.</p>
      </form>
    </div>
    <AIConceptPreview
      title={`Artzy name plate concept for ${familyName || 'our home'}`}
      primaryText={familyName}
      secondaryText={secondLine}
      studioMessage={brief}
      enabled={familyName.trim().length > 0}
      disabledHint="Enter the name or family wording above before generating a concept."
      brief={{ kind: 'name-plate', style: motif.name, palette: palette.name, shape: shape.name, material: material.name, purpose: placement.name }}
    />
  </section>;
}
