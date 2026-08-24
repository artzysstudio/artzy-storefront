"use client";

import Link from 'next/link';

type Intent = { title: string; copy: string; href: string; image: string; cta: string };

export default function HomeIntentCards({ intents }: { intents: Intent[] }) {
  return <section className="intent-section" aria-labelledby="intent-heading">
    <header><span>Begin with what you need</span><h2 id="intent-heading">How can art become part of your story?</h2></header>
    <div className="intent-grid">
      {intents.map((intent, index) => <article key={intent.title}>
        <img src={intent.image} alt="" loading="lazy" />
        <div><b>0{index + 1}</b><h3>{intent.title}</h3><p>{intent.copy}</p><Link href={intent.href}>{intent.cta} <span aria-hidden="true">→</span></Link></div>
      </article>)}
    </div>
    <style jsx>{`
      .intent-section{padding:clamp(56px,8vw,110px) clamp(18px,5vw,72px);background:#fffaf5;color:#42342e}.intent-section>header{max-width:780px;margin:0 auto 38px;text-align:center}.intent-section>header span{color:#a64b50;font-size:.68rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase}.intent-section h2{margin:12px 0 0;font:400 clamp(2.4rem,5vw,4.8rem)/.98 var(--font-serif),Georgia,serif}.intent-grid{max-width:1400px;margin:auto;display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #decec3}.intent-grid article{min-width:0;border-right:1px solid #decec3;background:#f8efe6}.intent-grid article:last-child{border:0}.intent-grid img{width:100%;height:300px;display:block;object-fit:cover}.intent-grid article>div{padding:25px 25px 29px}.intent-grid b{color:#ad4f54;font-size:.66rem;letter-spacing:.12em}.intent-grid h3{margin:10px 0 8px;font:400 2rem/1 var(--font-serif),Georgia,serif}.intent-grid p{min-height:48px;margin:0 0 20px;color:#746159;font-size:.88rem;line-height:1.55}.intent-grid a{color:#943f45;font-size:.75rem;font-weight:700;text-decoration:none}.intent-grid a span{margin-left:8px}@media(max-width:760px){.intent-grid{grid-template-columns:1fr}.intent-grid article{display:grid;grid-template-columns:42% 1fr;border-right:0;border-bottom:1px solid #decec3}.intent-grid img{height:100%;min-height:230px}.intent-grid article>div{padding:22px 18px}.intent-grid h3{font-size:1.65rem}.intent-grid p{min-height:0}}@media(max-width:430px){.intent-grid article{grid-template-columns:1fr}.intent-grid img{height:220px;min-height:0}}
    `}</style>
  </section>;
}
