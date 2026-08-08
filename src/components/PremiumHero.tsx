"use client";

import Link from 'next/link';

export default function PremiumHero() {
  return <section className="handmade-hero" aria-labelledby="handmade-hero-title">
    <img className="handmade-hero__image" src="/images/homepage-handmade-hero.webp" alt="Hand-painted trays, coasters, organisers and home décor created at Artzy's Studio" />
    <div className="handmade-hero__shade" aria-hidden="true" />
    <div className="handmade-hero__copy">
      <span className="handmade-hero__eyebrow">Handmade in Pune · By Deepti J. Shah &amp; her artist team</span>
      <h1 id="handmade-hero-title">Everyday objects.<br/><em>Made into art.</em></h1>
      <p>Hand-painted home décor, useful art and meaningful gifts—created in our own studio, one piece at a time.</p>
      <div className="handmade-hero__actions">
        <Link className="handmade-hero__primary" href="/shop/?category=hand-painted-decor">Shop handmade crafts <span aria-hidden="true">→</span></Link>
        <Link className="handmade-hero__secondary" href="/personalised">Create something personal</Link>
      </div>
      <div className="handmade-hero__trust" aria-label="Artzy's Studio promises"><span>Artist-led studio</span><i/> <span>Small-batch creations</span><i/> <span>Made in Pune</span></div>
    </div>
    <a className="handmade-hero__peek" href="#shop-by-category" aria-label="Continue to shop by category"><span>Discover the studio</span>↓</a>
    <style jsx>{`
      .handmade-hero{position:relative;min-height:clamp(590px,76svh,780px);display:grid;align-items:center;overflow:hidden;background:#eee0d3;color:#3e302a}.handmade-hero__image,.handmade-hero__shade{position:absolute;inset:0;width:100%;height:100%}.handmade-hero__image{object-fit:cover;object-position:center right}.handmade-hero__shade{background:linear-gradient(90deg,rgba(248,240,231,.98) 0%,rgba(248,240,231,.93) 34%,rgba(248,240,231,.42) 53%,rgba(248,240,231,0) 72%)}.handmade-hero__copy{position:relative;z-index:1;width:min(650px,49vw);margin-left:max(24px,calc((100vw - 1440px)/2 + 64px));padding:70px 0 95px}.handmade-hero__eyebrow{display:block;color:#a64b50;font-size:.68rem;font-weight:700;letter-spacing:.17em;line-height:1.5;text-transform:uppercase}.handmade-hero h1{max-width:620px;margin:20px 0 24px;font:400 clamp(3.8rem,6.6vw,7.2rem)/.86 var(--font-serif),Georgia,serif;letter-spacing:-.055em}.handmade-hero h1 em{color:#ae4e53;font-weight:400}.handmade-hero p{max-width:555px;margin:0;color:#69574e;font-size:clamp(1rem,1.28vw,1.17rem);line-height:1.72}.handmade-hero__actions{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-top:32px}.handmade-hero__primary,.handmade-hero__secondary{min-height:50px;display:inline-flex;align-items:center;justify-content:center;padding:13px 20px;border-radius:999px;font-size:.78rem;font-weight:700;text-decoration:none}.handmade-hero__primary{gap:28px;background:#ad4f54;color:#fff;box-shadow:0 13px 27px #9342472c}.handmade-hero__secondary{border:1px solid #ac5155;color:#934247;background:rgba(255,250,245,.56)}.handmade-hero__trust{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:41px;color:#755f55;font-size:.65rem;font-weight:650;letter-spacing:.09em;text-transform:uppercase}.handmade-hero__trust i{width:4px;height:4px;border-radius:50%;background:#b5575b}.handmade-hero__peek{position:absolute;z-index:2;left:50%;bottom:14px;display:grid;justify-items:center;gap:4px;color:#7c655b;font-size:.57rem;letter-spacing:.14em;text-decoration:none;text-transform:uppercase}.handmade-hero__peek::after{content:'';width:1px;height:16px;background:#a75c5e}@media(max-width:800px){.handmade-hero{min-height:calc(100svh - 105px);align-items:end}.handmade-hero__image{object-position:66% center}.handmade-hero__shade{background:linear-gradient(0deg,rgba(248,240,231,.99) 0%,rgba(248,240,231,.95) 43%,rgba(248,240,231,.15) 76%)}.handmade-hero__copy{width:auto;margin:0;padding:clamp(250px,46svh,430px) 20px 64px}.handmade-hero h1{font-size:clamp(3.15rem,14vw,5.25rem);line-height:.89}.handmade-hero p{font-size:.96rem}.handmade-hero__actions{align-items:stretch;flex-direction:column}.handmade-hero__primary,.handmade-hero__secondary{width:100%}.handmade-hero__trust{justify-content:center;gap:8px;margin-top:28px;font-size:.56rem}.handmade-hero__peek{display:none}}@media(max-width:370px){.handmade-hero__trust span:last-child,.handmade-hero__trust i:last-of-type{display:none}}@media(prefers-reduced-motion:no-preference){.handmade-hero__image{animation:hero-breathe 14s ease-in-out infinite alternate}@keyframes hero-breathe{to{transform:scale(1.025)}}}
    `}</style>
  </section>;
}
