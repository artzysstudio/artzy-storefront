'use client';

import { useMemo, useState } from 'react';
import AIConceptPreview from '@/components/AIConceptPreview';

type BuilderKind = 'caricature' | 'gift' | 'business' | 'personalised' | 'contact';

const OPTIONS: Record<BuilderKind, { title: string; purpose: string[]; style: string[]; output: string[] }> = {
  caricature: { title: 'Shape your caricature idea', purpose: ['Birthday portrait', 'Wedding or anniversary', 'Family and pet', 'Retirement or team tribute'], style: ['Warm watercolour', 'Playful editorial', 'Elegant minimal', 'Colourful story scene'], output: ['Digital file', 'Framed print', 'Canvas', 'Gift presentation'] },
  gift: { title: 'Imagine a custom gift direction', purpose: ['Wedding', 'Birthday', 'Housewarming', 'Festival', 'Team or client'], style: ['Botanical hand-painted', 'Indian folk inspired', 'Modern geometric', 'Quiet premium'], output: ['One keepsake', 'Gift box', 'Coordinated set', 'Bulk gifting direction'] },
  business: { title: 'Visualise a meaningful business direction', purpose: ['Corporate gifting', 'Office artwork', 'Hospitality or retail experience', 'Event or festive programme'], style: ['Modern geometric and brand-aware minimal', 'Contemporary Indian geometric', 'Warm botanical', 'Warli-inspired story', 'Madhubani-inspired festive'], output: ['Client-ready presentation concept', 'Coordinated gift-set direction', 'Wall-art series for a space', 'Complete space mood direction'] },
  personalised: { title: 'Imagine your personal piece', purpose: ['Portrait or memory', 'Home artwork', 'Occasion gift', 'Personal name plate'], style: ['Watercolour', 'Botanical', 'Modern abstract', 'Indian folk inspired'], output: ['Digital artwork', 'Framed print', 'Canvas', 'Hand-painted direction'] },
  contact: { title: 'Turn your first idea into a visual brief', purpose: ['Custom artwork', 'Personalised gift', 'Corporate project', 'Art for a space'], style: ['Let Deepti guide me', 'Warm botanical', 'Modern and calm', 'Rich Indian colour'], output: ['Concept image', 'Gift direction', 'Wall-art direction', 'Project mood'] },
};

export default function CreativeConceptBuilder({ kind }: { kind: BuilderKind }) {
  const config = OPTIONS[kind];
  const isBusiness = kind === 'business';
  const [purpose, setPurpose] = useState('');
  const [style, setStyle] = useState('');
  const [output, setOutput] = useState('');
  const [story, setStory] = useState('');
  const [audience, setAudience] = useState('');
  const [setting, setSetting] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [brandColours, setBrandColours] = useState('');
  const [mustInclude, setMustInclude] = useState('');
  const [budget, setBudget] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const ready = Boolean(purpose && style && output && (!isBusiness || (audience && setting && quantity > 0)));
  const message = useMemo(() => [
    'Namaste Artzy Studio,',
    '',
    `I would like your guidance for a ${purpose || 'personalised creation'}.`,
    `Creative direction: ${style || 'Please recommend'}`,
    `Preferred piece: ${output || 'Please recommend'}`,
    ...(isBusiness ? [
      `Organisation: ${organisation || 'Not specified'}`,
      `Audience: ${audience}`,
      `Setting: ${setting}`,
      `Quantity: ${quantity}`,
      `Brand colours: ${brandColours || 'Please recommend'}`,
      `Must include: ${mustInclude || 'Nothing mandatory'}`,
      `Budget: ${budget || 'To discuss'}`,
      `Required date: ${requiredDate || 'Flexible'}`,
    ] : []),
    `What matters to me: ${story.trim() || "I would appreciate Deepti's recommendation."}`,
    '',
    'I selected an ArtzyAI concept and will attach it here as a visual reference.',
    'Please advise the most suitable material and finish, final price, and delivery timeline.',
  ].join('\n'), [audience, brandColours, budget, isBusiness, mustInclude, organisation, output, purpose, quantity, requiredDate, setting, story, style]);

  const palette = (brandColours || 'warm terracotta, cream, muted rose and olive').split(',').map(value => value.trim()).filter(Boolean).join(', ');
  const conceptPurpose = isBusiness
    ? `${purpose}; ${audience}; ${setting}; ${quantity} pieces; ${output}; ${mustInclude || story || 'cohesive Artzy Studio direction'}`
    : `${purpose}. ${output}. ${story}`;

  return <section id={`${kind}-concept`} className={`creative-concept-builder${isBusiness ? ' creative-concept-builder--business' : ''}`} aria-labelledby={`${kind}-concept-title`}>
    <header><span>Artzy Muse · guided concept</span><h2 id={`${kind}-concept-title`}>{config.title}.<br/><em>Then make it real with the studio.</em></h2><p>{isBusiness ? 'Describe the purpose, people and place—not technical AI instructions. ArtzyAI uses the complete brief to create up to five useful directions before the studio develops the selected idea.' : 'Make three easy choices. Muse creates a clearly labelled inspiration image; Deepti’s studio confirms what can actually be created.'}</p></header>
    <div className="creative-concept-builder__choices">
      <label><b>1 · Purpose</b><select value={purpose} onChange={event => setPurpose(event.target.value)}><option value="">Choose the closest purpose</option>{config.purpose.map(item => <option key={item}>{item}</option>)}</select></label>
      <label><b>2 · Visual direction</b><select value={style} onChange={event => setStyle(event.target.value)}><option value="">Choose a direction</option>{config.style.map(item => <option key={item}>{item}</option>)}</select></label>
      <label><b>3 · Intended result</b><select value={output} onChange={event => setOutput(event.target.value)}><option value="">Choose what you want to see</option>{config.output.map(item => <option key={item}>{item}</option>)}</select></label>
      {isBusiness && <>
        <label><b>4 · Who should this connect with?</b><select value={audience} onChange={event => setAudience(event.target.value)}><option value="">Choose the audience</option><option>Employees or team members</option><option>Clients or business partners</option><option>Guests or customers</option><option>Leadership or dignitaries</option><option>Mixed audience</option></select></label>
        <label><b>5 · Where will it be experienced?</b><select value={setting} onChange={event => setSetting(event.target.value)}><option value="">Choose the setting</option><option>Gift presentation or hamper</option><option>Office or reception</option><option>Hospitality or retail interior</option><option>Stage, event or festive display</option><option>Digital presentation</option></select></label>
        <label><b>6 · Approximate quantity</b><input type="number" min="1" max="5000" value={quantity} onChange={event => setQuantity(Math.max(1, Number(event.target.value) || 1))}/></label>
        <label><b>Organisation or brand <small>optional</small></b><input maxLength={80} value={organisation} onChange={event => setOrganisation(event.target.value)} placeholder="Used only to shape this brief"/></label>
        <label><b>Brand or preferred colours <small>optional</small></b><input maxLength={100} value={brandColours} onChange={event => setBrandColours(event.target.value)} placeholder="Example: maroon, cream and warm gold"/></label>
        <label><b>Budget range <small>optional</small></b><input maxLength={80} value={budget} onChange={event => setBudget(event.target.value)} placeholder="Total or per piece"/></label>
        <label><b>Required date <small>optional</small></b><input type="date" value={requiredDate} onChange={event => setRequiredDate(event.target.value)}/></label>
        <label className="creative-concept-builder__wide"><b>Important object, motif or wording <small>optional</small></b><input maxLength={140} value={mustInclude} onChange={event => setMustInclude(event.target.value)} placeholder="Logo placement, Indian motif, product type or exact idea"/></label>
      </>}
      <label className="creative-concept-builder__story"><b>Your story or requirement <small>optional</small></b><textarea rows={3} maxLength={500} value={story} onChange={event => setStory(event.target.value)} placeholder={isBusiness ? 'Describe the feeling, context and what a successful result should communicate.' : 'Who it is for, room, occasion, colours, important details or quantity...'}/></label>
    </div>
    <AIConceptPreview title={`Artzy Muse · ${purpose || config.title}`} studioMessage={message} enabled={ready} disabledHint={isBusiness ? 'Choose the purpose, visual direction, intended result, audience and setting to unlock the first preview.' : 'Choose a purpose, visual feeling and intended result to unlock your preview.'} maxGenerations={isBusiness ? 5 : undefined} quotaKey={isBusiness ? 'business-project' : undefined} aspectRatio={isBusiness ? '3:2' : undefined} brief={{ kind: kind === 'contact' ? 'personalised' : kind, style: style || 'Artzy Studio recommendation', palette, purpose: conceptPurpose }}/>
  </section>;
}
