'use client';

import { useEffect, useState } from 'react';

type SavedBrief = {
  painting?: string;
  room?: string;
  size?: string;
  frame?: string;
  theme?: string;
  wallDirection?: string;
  desiredFeeling?: string;
  vastuPreference?: string;
  openMuse?: boolean;
};

export default function ArtzyWorldBriefResume() {
  const [brief, setBrief] = useState<SavedBrief | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('artzy_world_custom_brief');
      if (saved) setBrief(JSON.parse(saved) as SavedBrief);
    } catch {
      localStorage.removeItem('artzy_world_custom_brief');
    }
  }, []);

  if (!brief) return null;

  const message = [
    'Namaste, I created an Artzy World custom-art brief.',
    brief.painting && `Inspiration: ${brief.painting}`,
    brief.room && `Room: ${brief.room}`,
    brief.size && `Preview size: ${brief.size}`,
    brief.frame && `Frame: ${brief.frame}`,
    brief.theme && `Colour mood: ${brief.theme}`,
    brief.vastuPreference === 'enabled' && brief.wallDirection
      ? `Optional Vastu direction: ${brief.wallDirection}; desired feeling: ${brief.desiredFeeling || 'not specified'}`
      : 'Optional Vastu guidance: not requested',
  ].filter(Boolean).join('\n');

  return <section id="artzy-world-brief" className="artzy-world-brief" aria-labelledby="artzy-world-brief-title">
    <div>
      <span>ARTZY WORLD BRIEF</span>
      <h2 id="artzy-world-brief-title">Your preview choices came with you.</h2>
      <p>You do not need to enter them again. Deepti&apos;s studio will confirm feasibility, final dimensions, price and delivery before making begins.</p>
    </div>
    <dl>
      <div><dt>Inspiration</dt><dd>{brief.painting || 'To be discussed'}</dd></div>
      <div><dt>Room</dt><dd>{brief.room || 'Not specified'}</dd></div>
      <div><dt>Preview choices</dt><dd>{[brief.size, brief.frame, brief.theme].filter(Boolean).join(' · ') || 'To be discussed'}</dd></div>
      <div><dt>Vastu-inspired guidance</dt><dd>{brief.vastuPreference === 'enabled' && brief.wallDirection ? `${brief.wallDirection} · ${brief.desiredFeeling || 'feeling not specified'}` : 'Not requested'}</dd></div>
    </dl>
    <div className="artzy-world-brief__actions">
      <a href={`https://wa.me/919158680722?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">Send brief to the studio</a>
      <a href="/artzy-world/preview/">Return to preview</a>
    </div>
    <style jsx>{`.artzy-world-brief{margin:clamp(55px,8vw,105px) auto;padding:clamp(24px,4vw,48px);width:min(1180px,calc(100% - 32px));display:grid;grid-template-columns:1fr 1fr;gap:34px;border:1px solid #ddcbbd;border-radius:24px;background:#fffaf4}.artzy-world-brief span{color:#a84d51;font-size:.66rem;font-weight:800;letter-spacing:.16em}.artzy-world-brief h2{margin:10px 0;font:400 clamp(2.2rem,4vw,3.8rem)/1 var(--font-serif),Georgia,serif}.artzy-world-brief p{color:#725e53;line-height:1.65}.artzy-world-brief dl{margin:0;display:grid;gap:1px}.artzy-world-brief dl div{padding:12px 14px;background:#f2e7dd}.artzy-world-brief dt{color:#9c474b;font-size:.66rem;font-weight:800;text-transform:uppercase}.artzy-world-brief dd{margin:5px 0 0;color:#49382f}.artzy-world-brief__actions{grid-column:1/-1;display:flex;gap:10px;flex-wrap:wrap}.artzy-world-brief__actions a{min-height:44px;display:inline-flex;align-items:center;padding:11px 17px;border:1px solid #a84d51;border-radius:99px;color:#954247;font-size:.76rem;font-weight:800;text-decoration:none}.artzy-world-brief__actions a:first-child{background:#a84d51;color:#fff}@media(max-width:700px){.artzy-world-brief{grid-template-columns:1fr}.artzy-world-brief__actions{grid-column:auto;display:grid}.artzy-world-brief__actions a{justify-content:center}}`}</style>
  </section>;
}
