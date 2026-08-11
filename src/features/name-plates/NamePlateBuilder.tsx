"use client";

import { useMemo, useState } from 'react';

const shapes = ['Classic rectangle', 'Gentle arch', 'Scalloped', 'Oval'];
const motifs = ['Botanical', 'Lotus', 'Warli', 'Geometric', 'Minimal'];
const palettes = [
  { name: 'Terracotta rose', slug: 'terracotta' },
  { name: 'Olive & gold', slug: 'olive' },
  { name: 'Indigo folk', slug: 'indigo' },
  { name: 'Warm monochrome', slug: 'monochrome' },
];
const sizes = ['Compact · 12 × 6 in', 'Standard · 16 × 8 in', 'Statement · 20 × 10 in'];
const mountings = ['Wall hooks / screws', 'Decorative hanging rope', 'Stand-off mounts'];

const motifMarks: Record<string, string> = {
  Botanical: '❧', Lotus: '✿', Warli: '△ ○ △', Geometric: '◇', Minimal: '•',
};

export default function NamePlateBuilder() {
  const [familyName, setFamilyName] = useState('The Shah Family');
  const [secondLine, setSecondLine] = useState('Welcome home');
  const [shape, setShape] = useState(shapes[0]);
  const [motif, setMotif] = useState(motifs[0]);
  const [palette, setPalette] = useState(palettes[0]);
  const [size, setSize] = useState(sizes[1]);
  const [mounting, setMounting] = useState(mountings[0]);

  const shapeClass = shape.toLowerCase().replaceAll(' ', '-');
  const brief = useMemo(() => [
    "Hello Artzy's Studio, I would like to enquire about a custom name plate.",
    `Main name: ${familyName || 'To be discussed'}`,
    `Second line: ${secondLine || 'None'}`,
    `Shape: ${shape}`,
    `Motif: ${motif}`,
    `Palette: ${palette.name}`,
    `Approximate size: ${size}`,
    `Mounting: ${mounting}`,
    'Please confirm design feasibility, material, final price and delivery time.',
  ].join('\n'), [familyName, secondLine, shape, motif, palette, size, mounting]);

  return <section className="plate-builder" id="name-plate-builder" aria-labelledby="plate-builder-title">
    <header className="plate-builder__heading"><div><span>Build your direction</span><h2 id="plate-builder-title">See the idea take shape.</h2></div><p>Choose a starting direction and enter the wording. This preview helps explain your preference; Deepti&apos;s studio confirms the final drawing, material, price and timeline before production.</p></header>
    <div className="plate-builder__workspace">
      <div className="plate-builder__preview-panel">
        <div className="plate-builder__wall">
          <div className={`live-name-plate live-name-plate--${shapeClass} live-name-plate--${palette.slug}`} aria-live="polite">
            <span className="live-name-plate__motif" aria-hidden="true">{motifMarks[motif]}</span>
            <strong>{familyName || 'Your name here'}</strong>
            <small>{secondLine || 'Your second line'}</small>
            <i aria-hidden="true">{motifMarks[motif]}</i>
          </div>
        </div>
        <div className="plate-preview-note"><span>Live design preview</span><small>Illustrative only · not an AR or production proof</small></div>
      </div>

      <form className="plate-builder__controls" onSubmit={(event) => event.preventDefault()}>
        <fieldset><legend>1 · Your wording</legend><div className="plate-input-grid"><label>Main name<input value={familyName} onChange={(e) => setFamilyName(e.target.value.slice(0, 36))} maxLength={36} placeholder="Family or home name"/></label><label>Second line <small>Optional</small><input value={secondLine} onChange={(e) => setSecondLine(e.target.value.slice(0, 42))} maxLength={42} placeholder="Flat number, welcome line or names"/></label></div><p className="plate-field-help">You may type English, Marathi, Hindi or another preferred script. The studio will check spelling with you before painting.</p></fieldset>
        <ChoiceField title="2 · Shape" options={shapes} value={shape} onChange={setShape}/>
        <ChoiceField title="3 · Art direction" options={motifs} value={motif} onChange={setMotif}/>
        <fieldset><legend>4 · Colour mood</legend><div className="plate-palette-options">{palettes.map((item) => <button type="button" className={palette.slug === item.slug ? 'selected' : ''} onClick={() => setPalette(item)} key={item.slug}><i className={`plate-swatch plate-swatch--${item.slug}`} aria-hidden="true"/><span>{item.name}</span></button>)}</div></fieldset>
        <div className="plate-select-grid"><label>Approximate size<select value={size} onChange={(e) => setSize(e.target.value)}>{sizes.map((item) => <option key={item}>{item}</option>)}</select></label><label>Mounting preference<select value={mounting} onChange={(e) => setMounting(e.target.value)}>{mountings.map((item) => <option key={item}>{item}</option>)}</select></label></div>
        <div className="plate-builder__actions"><a href={`https://wa.me/919158680722?text=${encodeURIComponent(brief)}`} target="_blank" rel="noreferrer">Send this brief on WhatsApp</a><button type="button" onClick={() => { setFamilyName('The Shah Family'); setSecondLine('Welcome home'); setShape(shapes[0]); setMotif(motifs[0]); setPalette(palettes[0]); setSize(sizes[1]); setMounting(mountings[0]); }}>Start again</button></div>
        <p className="plate-builder__assurance"><b>Before anything is made:</b> the studio confirms spelling, artwork, material, mounting, final price and realistic delivery time.</p>
      </form>
    </div>
  </section>;
}

function ChoiceField({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return <fieldset><legend>{title}</legend><div className="plate-choice-options">{options.map((option) => <button type="button" className={value === option ? 'selected' : ''} onClick={() => onChange(option)} key={option}>{option}</button>)}</div></fieldset>;
}
