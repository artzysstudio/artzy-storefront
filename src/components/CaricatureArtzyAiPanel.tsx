'use client';

import type { CaricatureExaggeration } from '@/features/caricatures/config';

export type CaricatureSample = {
  assetId: string;
  jobId: string;
  previewUrl: string;
};

type Props = {
  photoPreview: string;
  prompt: string;
  onPromptChange: (value: string) => void;
  exaggeration: CaricatureExaggeration;
  onExaggerationChange: (value: CaricatureExaggeration) => void;
  samples: CaricatureSample[];
  selectedAssetId: string;
  remaining: number;
  busy: boolean;
  progress: string;
  generationReady: boolean;
  manual: boolean;
  onGenerate: () => void;
  onSelect: (sample: CaricatureSample) => void;
  onDelete: (sample: CaricatureSample) => void;
  onStudioGuide: () => void;
  onContinue: () => void;
};

export default function CaricatureArtzyAiPanel(props: Props) {
  const selected = props.samples.find(sample => sample.assetId === props.selectedAssetId) ?? props.samples.at(-1);
  const quotaText = props.remaining === 2 ? '2 free ArtzyAI samples available.' : props.remaining === 1 ? '1 free sample remaining.' : 'Your two free samples are complete.';

  return <section className="caricature-ai" aria-labelledby="caricature-ai-title">
    <header className="caricature-ai__header">
      <div><span>Powered by ArtzyAI · private concept preview</span><h3 id="caricature-ai-title">Create Your Caricature<br/><em>with ArtzyAI</em></h3></div>
      <div><p>Turn your photo and ideas into a personalised caricature concept.</p><strong className={`caricature-ai__quota ${props.remaining === 0 ? 'is-complete' : ''}`}>{quotaText}</strong></div>
    </header>

    <div className="caricature-ai__controls">
      <fieldset><legend>How playful should it feel?</legend><div className="caricature-ai__exaggeration">{(['soft','classic','funny'] as const).map(value => <button key={value} type="button" className={props.exaggeration === value ? 'is-selected' : ''} aria-pressed={props.exaggeration === value} onClick={() => props.onExaggerationChange(value)}><b>{value[0].toUpperCase() + value.slice(1)}</b><small>{value === 'soft' ? 'Gentle and flattering' : value === 'classic' ? 'Balanced caricature character' : 'More playful, always respectful'}</small></button>)}</div></fieldset>
      <label className="caricature-ai__prompt"><span>Your ArtzyAI direction <small>You can change this before generating</small></span><textarea rows={7} maxLength={1200} value={props.prompt} onChange={event => props.onPromptChange(event.target.value)} aria-describedby="caricature-ai-prompt-note"/><small id="caricature-ai-prompt-note">Written from the choices above—no need to enter your details again. Avoid adding private contact information.</small></label>
      <div className="caricature-ai__notices" aria-label="Important AI and photo notices"><p>AI samples are creative concepts and may not perfectly reproduce every facial detail.</p><p>Final artwork is reviewed and refined by Artzy Studio when you select artist finishing.</p><p>Your uploaded photo is used only for creating your requested concept.</p></div>
      {props.manual ? <p className="caricature-ai__message">This group needs direct studio composition. Your complete brief can still be sent for guidance.</p> : <button className="caricature-ai__generate" type="button" onClick={props.onGenerate} disabled={props.busy || !props.generationReady || props.remaining === 0}>{props.busy ? 'Creating your watermarked sample…' : props.samples.length ? 'Generate another sample' : 'Generate my first free sample'}</button>}
      {!props.generationReady && !props.manual && <p className="caricature-ai__consent-hint">Confirm the required photo-processing and ArtzyAI consent choices above before the first generation.</p>}
      {props.busy && <div className="caricature-ai__progress" role="status" aria-live="polite"><span/><b>{props.progress || 'Creating your ArtzyAI sample'}</b><small>This can take a little time. Please keep this page open.</small></div>}
    </div>

    {props.samples.length > 0 && <div className="caricature-ai__gallery" aria-live="polite">
      <div className="caricature-ai__sample-grid">{props.samples.map((sample, index) => <article className={props.selectedAssetId === sample.assetId ? 'is-selected' : ''} key={sample.assetId}><figure><img src={sample.previewUrl} alt={`Watermarked ArtzyAI caricature sample ${index + 1}`}/><figcaption>Sample {index + 1} · Powered by ArtzyAI</figcaption></figure><div><button type="button" onClick={() => props.onSelect(sample)}>{props.selectedAssetId === sample.assetId ? 'Concept selected' : 'Choose this concept'}</button><a href={sample.previewUrl} download={`artzyai-caricature-sample-${index + 1}.svg`}>Download preview</a><button type="button" onClick={() => props.onDelete(sample)}>Delete</button></div></article>)}</div>
      {selected && <section className="caricature-ai__compare" aria-labelledby="caricature-compare-title"><div><span>Original photograph</span><img src={props.photoPreview} alt="Customer reference photograph for comparison"/></div><b aria-hidden="true">→</b><div><span id="caricature-compare-title">Selected ArtzyAI concept</span><img src={selected.previewUrl} alt="Selected watermarked ArtzyAI caricature concept"/></div></section>}
      <div className="caricature-ai__gallery-actions"><button type="button" onClick={props.onGenerate} disabled={props.busy || props.remaining === 0}>Regenerate</button><a href="#caricature-ai-title">Change prompt</a><button type="button" onClick={() => selected && props.onSelect(selected)} disabled={!selected}>Choose this concept</button><button type="button" onClick={props.onStudioGuide}>Ask Artzy Studio to finish it</button></div>
    </div>}

    {props.remaining === 0 && <aside className="caricature-ai__guidance"><span>Artist finishing · gifting · printing · framing</span><h4>Want a better result? Let Artzy Studio guide you.</h4><p>Our artists can improve the likeness, composition, clothing, background and special details to create a beautiful caricature for gifting, printing or framing.</p><div><button type="button" onClick={props.onStudioGuide}>Ask Studio to Guide You</button><button type="button" onClick={props.onContinue} disabled={!selected}>Continue with This Concept</button></div></aside>}
  </section>;
}
