"use client";

import { useMemo, useState } from 'react';

const purposes = [
  { id: 'home', label: 'Art for my home', note: 'A piece composed for a wall, room and colour mood.', needs: ['A straight room or wall photograph', 'Approximate wall width and height', 'Colours already present in the room'], suggestion: 'Canvas or framed fine-art print' },
  { id: 'gift', label: 'A personal gift', note: 'Story-led artwork for a person, couple or occasion.', needs: ['Clear reference photographs', 'Names, date and personal message', 'Occasion and required-by date'], suggestion: 'Framed print, canvas or digital file' },
  { id: 'caricature', label: 'A caricature', note: 'A joyful character portrait from photographs.', needs: ['2–4 clear face photographs per person', 'Hobbies, clothing and theme details', 'Number of people or pets'], suggestion: 'Digital file plus framed gift print' },
  { id: 'business', label: 'Art for a business', note: 'Custom work for offices, hospitality or brand spaces.', needs: ['Site photographs and wall measurements', 'Brand palette or interior mood board', 'Quantity, locations and installation needs'], suggestion: 'Coordinated canvas or framed series' },
  { id: 'file', label: 'A digital file', note: 'Custom artwork supplied for an approved personal or commercial use.', needs: ['Required pixel or print dimensions', 'Intended use and quantity', 'Reference images or creative brief'], suggestion: 'High-resolution approved digital file' },
  { id: 'unsure', label: 'Please guide me', note: 'Share what you know and let the studio recommend a path.', needs: ['The story, room or occasion', 'Any photograph or visual reference', 'Budget comfort and required date'], suggestion: 'Studio recommendation after brief review' },
];

const styles = [
  ['abstract', 'Abstract & modern', 'Colour, movement and atmosphere'],
  ['geometric', 'Geometric & minimal', 'Shape, balance and visual rhythm'],
  ['botanical', 'Botanical & floral', 'Contemporary nature-led artwork'],
  ['indian', 'Indian folk & heritage', 'Warli, Madhubani or requirement-led influence'],
  ['watercolour', 'Watercolour softness', 'Gentle, expressive and personal'],
  ['recommend', 'Recommend a style', 'Let Deepti choose from your brief'],
];

const outputs = [
  ['digital-file', 'Digital file', 'High-resolution file with confirmed usage'],
  ['fine-art-print', 'Fine-art paper print', 'Made for framing and gifting'],
  ['canvas', 'Canvas print', 'A ready-to-display wall-art finish'],
  ['framed', 'Framed print', 'Finished presentation for home or gifting'],
  ['series', 'Coordinated series', 'Two or more related pieces for a space'],
  ['recommend', 'Recommend a finish', 'Studio guidance based on size and use'],
];

const timelines = ['Flexible—quality first', 'Within 3–4 weeks', 'Within 2 weeks', 'Within 7 days—check feasibility'];
const sizes = ['Not sure yet', 'Small / gifting size', 'Medium wall piece', 'Large statement wall', 'Multi-piece or multiple locations'];

export default function DigitalArtPlanner() {
  const [purposeId, setPurposeId] = useState('');
  const [styleId, setStyleId] = useState('');
  const [outputId, setOutputId] = useState('');
  const [size, setSize] = useState(sizes[0]);
  const [timeline, setTimeline] = useState(timelines[0]);
  const [brief, setBrief] = useState('');
  const [readiness, setReadiness] = useState({ references: false, dimensions: false, date: false });

  const purpose = purposes.find((item) => item.id === purposeId);
  const style = styles.find(([id]) => id === styleId);
  const output = outputs.find(([id]) => id === outputId);
  const completed = [purposeId, styleId, outputId].filter(Boolean).length;
  const readyCount = Object.values(readiness).filter(Boolean).length;
  const readyToSend = completed === 3;

  const message = useMemo(() => [
    "Hello Artzy's Studio, I would like guidance for a digital artwork.",
    `Purpose: ${purpose?.label ?? 'Please recommend'}`,
    `Style direction: ${style?.[1] ?? 'Please recommend'}`,
    `Preferred finish: ${output?.[1] ?? 'Please recommend'}`,
    `Approximate scale: ${size}`,
    `Required timing: ${timeline}`,
    `References ready: ${readiness.references ? 'Yes' : 'Not yet'}`,
    `Measurements / output size ready: ${readiness.dimensions ? 'Yes' : 'Not yet'}`,
    `Required date confirmed: ${readiness.date ? 'Yes' : 'Not yet'}`,
    `Brief: ${brief.trim() || 'I would like the studio to guide me.'}`,
    'Please confirm feasibility, required inputs, revisions, usage, final price and delivery timeline before production.',
  ].join('\n'), [purpose, style, output, size, timeline, readiness, brief]);

  return <section className="digital-planner" id="digital-planner" aria-labelledby="digital-planner-title">
    <header className="digital-planner__heading">
      <div><span>Guided digital art planner</span><h2 id="digital-planner-title">Start with your purpose.<br/><em>Leave with a clear brief.</em></h2></div>
      <div><p>No art terminology required. Make three simple choices and the page will tell you what the studio needs next.</p><div className="digital-planner__progress" aria-label={`${completed} of 3 essential choices complete`}><i style={{ width: `${(completed / 3) * 100}%` }}/><span>{completed}/3 essentials selected</span></div></div>
    </header>

    <div className="digital-planner__shell">
      <form className="digital-planner__form" onSubmit={(event) => event.preventDefault()}>
        <fieldset><legend><b>1</b><span>What is the artwork for?<small>Choose the closest purpose. “Please guide me” is always available.</small></span></legend><div className="digital-purpose-options">{purposes.map((item) => <button type="button" aria-pressed={purposeId === item.id} onClick={() => setPurposeId(item.id)} key={item.id}><i aria-hidden="true"/><span><strong>{item.label}</strong><small>{item.note}</small></span></button>)}</div></fieldset>
        <fieldset><legend><b>2</b><span>Which visual direction feels right?<small>This is a starting point, not a restriction.</small></span></legend><div className="digital-style-options">{styles.map(([id,label,note]) => <button type="button" aria-pressed={styleId === id} onClick={() => setStyleId(id)} key={id}><i className={`digital-style-mark digital-style-mark--${id}`} aria-hidden="true"/><span><strong>{label}</strong><small>{note}</small></span></button>)}</div></fieldset>
        <fieldset><legend><b>3</b><span>How would you like to receive it?<small>The studio confirms material, dimensions and availability.</small></span></legend><div className="digital-output-options">{outputs.map(([id,label,note]) => <button type="button" aria-pressed={outputId === id} onClick={() => setOutputId(id)} key={id}><i aria-hidden="true">{id === 'digital-file' ? '▣' : id === 'series' ? '▥' : '□'}</i><span><strong>{label}</strong><small>{note}</small></span></button>)}</div></fieldset>
        <fieldset><legend><b>4</b><span>Help us check feasibility<small>These details improve the first studio response.</small></span></legend><div className="digital-detail-grid"><label>Approximate scale<select value={size} onChange={(event) => setSize(event.target.value)}>{sizes.map((item) => <option key={item}>{item}</option>)}</select></label><label>Required timing<select value={timeline} onChange={(event) => setTimeline(event.target.value)}>{timelines.map((item) => <option key={item}>{item}</option>)}</select></label></div><label className="digital-brief-field">Tell us what you imagine <small>Optional</small><textarea value={brief} onChange={(event) => setBrief(event.target.value.slice(0, 420))} maxLength={420} rows={4} placeholder="Example: a warm abstract triptych for a beige living room, or a joyful anniversary caricature with travel details."/></label><div className="digital-readiness"><span>I already have:</span>{([['references','Photos / references'],['dimensions','Wall or output size'],['date','Required date']] as const).map(([key,label]) => <label key={key}><input type="checkbox" checked={readiness[key]} onChange={(event) => setReadiness({ ...readiness, [key]: event.target.checked })}/><span>{label}</span></label>)}</div></fieldset>
      </form>

      <aside className="digital-planner__summary" aria-live="polite">
        <span>Your studio-ready direction</span><h3>{purpose?.label ?? 'Choose what the artwork is for'}</h3><p>{purpose?.note ?? 'Your recommendation and preparation checklist will appear here.'}</p>
        <dl><div><dt>Style</dt><dd>{style?.[1] ?? 'Choose or ask us to recommend'}</dd></div><div><dt>Finish</dt><dd>{output?.[1] ?? 'Choose or ask us to recommend'}</dd></div><div><dt>Scale</dt><dd>{size}</dd></div><div><dt>Timing</dt><dd>{timeline}</dd></div></dl>
        <div className="digital-planner__needs"><strong>Prepare these if available</strong><ul>{(purpose?.needs ?? ['A photograph, room view or reference', 'How the artwork will be used', 'Your preferred date']).map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div className="digital-planner__recommendation"><small>Suggested starting finish</small><strong>{purpose?.suggestion ?? 'Studio recommendation after brief review'}</strong></div>
        <p className="digital-planner__status"><b>{readyCount}/3 supporting details ready.</b> Missing details will not stop your enquiry—the studio can guide you.</p>
        {readyToSend ? <a href={`https://wa.me/919158680722?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">Send this brief on WhatsApp <span>→</span></a> : <button type="button" disabled>Choose purpose, style and finish</button>}
        <small className="digital-planner__honesty">No payment or final order is created here. Feasibility, revisions, usage rights, material, price and timing are confirmed personally by the studio.</small>
      </aside>
    </div>
  </section>;
}
