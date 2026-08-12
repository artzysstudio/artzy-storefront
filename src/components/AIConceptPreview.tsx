"use client";

import { useState } from 'react';

type ConceptBrief = {
  kind: 'name-plate' | 'digital-art' | 'caricature' | 'gift' | 'business' | 'personalised';
  style: string;
  palette: string;
  shape?: string;
  material?: string;
  purpose?: string;
};

type Props = {
  brief: ConceptBrief;
  title: string;
  primaryText?: string;
  secondaryText?: string;
  studioMessage: string;
  enabled?: boolean;
  disabledHint?: string;
};

type PreviewResponse = { image?: string; label?: string; error?: string };

async function composedFile(imageUrl: string, primaryText: string, secondaryText: string): Promise<File> {
  const image = new Image();
  image.src = imageUrl;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas unavailable');
  context.drawImage(image, 0, 0);

  if (primaryText) {
    const width = canvas.width * .62;
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = 'rgba(255, 248, 239, .95)';
    context.shadowBlur = Math.max(4, Math.round(canvas.width * .009));
    context.shadowOffsetY = 1;
    context.fillStyle = '#49362f';
    context.font = `600 ${Math.max(26, Math.round(canvas.width * .052))}px Georgia, serif`;
    context.fillText(primaryText.slice(0, 36), x, y - canvas.height * .018, width * .9);
    if (secondaryText) {
      context.font = `600 ${Math.max(13, Math.round(canvas.width * .018))}px Arial, sans-serif`;
      context.fillText(secondaryText.toUpperCase().slice(0, 42), x, y + canvas.height * .055, width * .86);
    }
    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
  }

  const footerHeight = Math.max(28, canvas.height * .055);
  context.fillStyle = 'rgba(38, 29, 25, .78)';
  context.fillRect(0, canvas.height - footerHeight, canvas.width, footerHeight);
  context.fillStyle = '#fff';
  context.textAlign = 'left';
  context.font = `600 ${Math.max(12, Math.round(canvas.width * .016))}px Arial, sans-serif`;
  context.fillText('ARTZY MUSE · AI CONCEPT · NOT A PRODUCTION PROOF', canvas.width * .025, canvas.height * .975);

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Could not create image')), 'image/jpeg', .9));
  return new File([blob], 'artzy-muse-concept.jpg', { type: 'image/jpeg' });
}

export default function AIConceptPreview({ brief, title, primaryText = '', secondaryText = '', studioMessage, enabled = true, disabledHint = 'Complete the builder choices first.' }: Props) {
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState('');
  const hasWording = Boolean(primaryText.trim() || secondaryText.trim());

  const generate = async () => {
    if (!enabled) return;
    setStatus('loading');
    setError('');
    try {
      const response = await fetch('/api/muse/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief),
      });
      const result = await response.json() as PreviewResponse;
      if (!response.ok || !result.image) throw new Error(result.error || 'Preview unavailable');
      setImage(result.image);
      setStatus('ready');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Preview unavailable');
      setStatus('error');
    }
  };

  const share = async () => {
    if (!image) return;
    const file = await composedFile(image, primaryText, secondaryText);
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title, text: `${studioMessage}\nAI-generated concept, not a production proof.`, files: [file] });
      return;
    }
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <section className="ai-concept-preview" id="ai-preview" aria-labelledby="ai-concept-title">
    <div className="ai-concept-preview__intro"><span>Artzy Muse · imaginative preview</span><h3 id="ai-concept-title">Picture your completed idea<br/><em>before studio approval.</em></h3><p>Artzy Muse creates one imaginative concept from your selected direction. It helps you discuss the mood—it is not a photograph of stock, an exact production design or a promise of the final result.</p><ul><li>Uses your selected style, palette and format</li><li>Keeps exact wording readable as a separate overlay</li><li>Download or share with someone you love</li><li>Send the brief to Deepti for a real feasibility check</li></ul></div>
    <div className="ai-concept-preview__stage" aria-live="polite">
      {!image && <div className="ai-concept-preview__empty"><span aria-hidden="true">✿</span><strong>{status === 'loading' ? 'Artzy Muse is imagining…' : 'Your concept will appear here'}</strong><small>{status === 'loading' ? 'This can take several seconds. Please keep this page open.' : enabled ? 'Generate one clearly labelled AI concept from your completed choices.' : disabledHint}</small>{status !== 'loading' && <button type="button" onClick={generate} disabled={!enabled}>Generate imaginative preview</button>}{status === 'error' && <p role="alert">{error}</p>}</div>}
      {image && <><figure className={`ai-concept-preview__result ${hasWording ? 'has-wording' : 'is-art-only'}`}><img src={image} alt="AI-generated visual concept based on the selected Artzy brief"/>{hasWording && <div className="ai-concept-preview__wording">{primaryText.trim() && <strong>{primaryText}</strong>}{secondaryText.trim() && <small>{secondaryText}</small>}</div>}<figcaption>AI concept · not stock · not a production proof</figcaption></figure><div className="ai-concept-preview__actions"><button type="button" onClick={share}>Share or download image</button><a href={`https://wa.me/919158680722?text=${encodeURIComponent(`${studioMessage}\n\nI generated an Artzy Muse concept. I will attach the downloaded preview separately. Please confirm what is realistically possible.`)}`} target="_blank" rel="noreferrer">Ask the studio on WhatsApp</a><button type="button" onClick={generate}>Create another concept</button></div><small className="ai-concept-preview__handoff">WhatsApp links cannot pre-attach an image. Use “Share or download image” to send the concept to a loved one or attach it in your studio chat.</small></>}
    </div>
  </section>;
}
