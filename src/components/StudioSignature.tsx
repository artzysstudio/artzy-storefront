"use client";

import Link from "next/link";

export default function StudioSignature() {
  return (
    <section className="studio-signature" aria-labelledby="studio-signature-title">
      <div className="studio-signature__lead">
        <span>THE ARTZY DIFFERENCE</span>
        <h2 id="studio-signature-title">Not collected from elsewhere.<br /><em>Created from our own side.</em></h2>
      </div>
      <div className="studio-signature__story">
        <p>Artzy&apos;s Studio is the authored creative world of Deepti J. Shah. Deepti and her deaf artist team develop the idea, paint the surface, shape the craft, compose the digital artwork and assemble the final gift.</p>
        <p>That single studio voice can move from a one-of-one canvas to a caricature, a gift combination or a complete commercial art brief—without losing its personal character.</p>
        <div className="studio-signature__actions">
          <Link href="/about">Meet Deepti &amp; the studio →</Link>
          <Link href="/contact">Discuss a custom or commercial project →</Link>
        </div>
      </div>
      <div className="studio-signature__pillars">
        <article><b>01</b><strong>Our hands</strong><span>Painted objects, canvases and crafted gifts made in the studio.</span></article>
        <article><b>02</b><strong>Our digital eye</strong><span>Prints, modern art, caricatures and visual concepts made to your brief.</span></article>
        <article><b>03</b><strong>Your purpose</strong><span>Personal milestones, home décor, corporate gifting and commercial spaces.</span></article>
      </div>
      <style jsx>{`
        .studio-signature{padding:clamp(64px,8vw,112px) clamp(20px,6vw,92px);background:#43312c;color:#fff8f0}.studio-signature__lead,.studio-signature__story,.studio-signature__pillars{max-width:1400px;margin-inline:auto}.studio-signature__lead{display:grid;grid-template-columns:.55fr 1.45fr;gap:clamp(28px,5vw,80px);align-items:start}.studio-signature__lead>span{padding-top:12px;color:#e1aaa5;font-size:.68rem;font-weight:800;letter-spacing:.2em}.studio-signature h2{margin:0;font-size:clamp(2.7rem,5.7vw,6.2rem);font-weight:400;line-height:.92;letter-spacing:-.035em}.studio-signature h2 em{color:#d78b88;font-weight:400}.studio-signature__story{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,76px);margin-top:50px;padding-top:32px;border-top:1px solid rgba(255,255,255,.16)}.studio-signature__story p{color:#dfd1c8;font-size:clamp(.95rem,1.25vw,1.1rem);line-height:1.75}.studio-signature__actions{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:14px 32px}.studio-signature__actions a{padding-bottom:4px;border-bottom:1px solid #d78b88;color:#fff8f0;font-size:.84rem}.studio-signature__pillars{display:grid;grid-template-columns:repeat(3,1fr);margin-top:54px;border-top:1px solid rgba(255,255,255,.16);border-left:1px solid rgba(255,255,255,.16)}.studio-signature__pillars article{display:grid;gap:9px;min-height:190px;padding:28px;border-right:1px solid rgba(255,255,255,.16);border-bottom:1px solid rgba(255,255,255,.16)}.studio-signature__pillars b{color:#d78b88;font-size:.65rem;letter-spacing:.14em}.studio-signature__pillars strong{font:400 1.55rem/1.1 var(--font-serif),serif}.studio-signature__pillars span{color:#cdbeb6;font-size:.84rem;line-height:1.55}@media(max-width:720px){.studio-signature__lead,.studio-signature__story{grid-template-columns:1fr}.studio-signature__lead{gap:18px}.studio-signature__story{gap:18px;margin-top:34px}.studio-signature__pillars{grid-template-columns:1fr;margin-top:38px}.studio-signature__pillars article{min-height:0}.studio-signature__actions{grid-column:auto;display:grid}.studio-signature h2{font-size:clamp(2.55rem,12vw,4rem)}}
      `}</style>
    </section>
  );
}
