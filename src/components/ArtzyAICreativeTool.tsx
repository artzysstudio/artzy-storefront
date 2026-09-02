'use client';

import { useState } from 'react';
import { createCreativeJob, deleteCreativeAsset, waitForCreativeJob, type CreativeJobRequest, type CreativeState, type CreativeTool } from '@/lib/artzyai';

type Variant = 'personalised' | 'caricature' | 'namePlate' | 'digitalArt' | 'gift' | 'artzyWorld';
type Props = {
  variant: Variant;
  title: string;
  purpose: string;
  style: string;
  palette: string[];
  exactText?: string;
  secondaryText?: string;
  aspectRatio?: CreativeJobRequest['aspectRatio'];
  enabled?: boolean;
  disabledHint?: string;
  studioMessage: string;
};

const toolByVariant: Record<Variant, CreativeTool> = { personalised: 'custom_art', caricature: 'caricature', namePlate: 'name_plate', digitalArt: 'digital_art', gift: 'gift', artzyWorld: 'room_art' };
const approvedFallback: Record<Variant, string> = { personalised: 'botanical', caricature: 'watercolour', namePlate: 'botanical', digitalArt: 'abstract', gift: 'warm', artzyWorld: 'abstract' };

function approvedStyle(variant: Variant, style: string): string {
  const lowered = style.toLowerCase();
  const tokens = ['watercolour', 'cute cartoon', 'editorial', 'storybook', 'minimal line', 'festive indian', 'botanical', 'warli-inspired', 'madhubani-inspired', 'geometric', 'lotus', 'floral', 'rajasthani-inspired', 'abstract', 'landscape', 'still life', 'figurative', 'nature', 'animals', 'warm', 'festive', 'minimal', 'heritage', 'playful'];
  return tokens.find(token => lowered.includes(token)) || approvedFallback[variant];
}

export default function ArtzyAICreativeTool({ variant, title, purpose, style, palette, exactText = '', secondaryText = '', aspectRatio = '1:1', enabled = true, disabledHint = 'Complete the choices above first.', studioMessage }: Props) {
  const [state, setState] = useState<CreativeState>('introduction');
  const [progress, setProgress] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [assetId, setAssetId] = useState('');
  const [error, setError] = useState('');

  async function generate() {
    if (!enabled) return;
    setState('generating'); setError(''); setPreviewUrl('');
    try {
      const queued = await createCreativeJob({ sourceApp: 'artzy-storefront', tool: toolByVariant[variant], mode: 'preview', purpose: purpose.slice(0, 240), style: approvedStyle(variant, style), palette: palette.slice(0, 6), outputFormat: 'jpeg', aspectRatio, referenceAssetIds: [], customerTextOverlay: exactText, storefrontContext: { page: window.location.pathname, variant }, erpContext: {} });
      const completed = await waitForCreativeJob(queued.jobId, setProgress);
      if (completed.status === 'moderation_blocked') { setState('moderation_blocked'); setError(completed.customerMessage); return; }
      if (completed.status !== 'completed' || !completed.previewUrl || !completed.assetId) throw new Error(completed.customerMessage || 'The preview could not be created.');
      setPreviewUrl(completed.previewUrl); setAssetId(completed.assetId); setState('completed');
    } catch (reason) {
      const typed = reason as Error & { category?: string };
      setState(typed.category === 'credits_unavailable' ? 'credits_unavailable' : 'failed');
      setError(typed.message);
    }
  }

  async function remove() {
    if (assetId) await deleteCreativeAsset(assetId).catch(() => undefined);
    setPreviewUrl(''); setAssetId(''); setState('introduction');
  }

  async function share() {
    if (!previewUrl) return;
    const response = await fetch(previewUrl);
    const file = new File([await response.blob()], 'artzyai-concept.jpg', { type: 'image/jpeg' });
    if (navigator.share && navigator.canShare?.({ files: [file] })) await navigator.share({ title, text: 'ArtzyAI concept—not stock or a production proof.', files: [file] });
    else { const href = URL.createObjectURL(file); const anchor = document.createElement('a'); anchor.href = href; anchor.download = file.name; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(href), 1000); }
  }

  const whatsapp = `https://wa.me/919158680722?text=${encodeURIComponent(`${studioMessage}\n\nI created an ArtzyAI concept. Please confirm feasibility, final price and timeline. I will attach the downloaded concept separately.`)}`;
  return <section className="artzyai-tool" aria-labelledby={`artzyai-${variant}-title`}>
    <header className="artzyai-tool__intro"><span>Powered by ArtzyAI</span><h3 id={`artzyai-${variant}-title`}>{title}</h3><p>ArtzyAI helps you imagine the creative direction. Deepti and Artzy’s Studio confirm what can actually be made.</p><small>AI concept—not stock, completed artwork, Deepti’s final artwork or a production proof.</small></header>
    <div className="artzyai-tool__stage" aria-live="polite" aria-busy={state === 'generating'}>
      {!previewUrl && <div className="artzyai-tool__empty"><span aria-hidden="true">✿</span><strong>{state === 'generating' ? progress : 'Your imaginative direction appears here'}</strong><p>{state === 'generating' ? 'Please keep this page open while ArtzyAI prepares the concept.' : enabled ? 'Generate one clearly labelled concept from your completed choices.' : disabledHint}</p>{state !== 'generating' && <button type="button" onClick={generate} disabled={!enabled}>Imagine with ArtzyAI</button>}{error && <p className="artzyai-tool__error" role="alert">{error}</p>}</div>}
      {previewUrl && <><figure className="artzyai-tool__result"><img src={previewUrl} alt={`ArtzyAI-generated ${variant} concept based on the selected creative direction`}/>{exactText && <div className="artzyai-tool__wording"><strong>{exactText}</strong>{secondaryText && <small>{secondaryText}</small>}</div>}<figcaption>AI concept · not stock · not a production proof</figcaption></figure><div className="artzyai-tool__actions"><button type="button" onClick={share}>Save or share concept</button><button type="button" onClick={generate}>Try another direction</button><a href={whatsapp} target="_blank" rel="noreferrer">Send to Artzy’s Studio</a><button type="button" onClick={remove}>Delete concept</button></div></>}
    </div>
  </section>;
}
