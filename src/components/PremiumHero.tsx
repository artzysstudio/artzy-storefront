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
        <Link className="handmade-hero__primary" href="/shop/">Shop handmade crafts <span aria-hidden="true">→</span></Link>
        <Link className="handmade-hero__secondary" href="/personalised">Create something personal</Link>
      </div>
      <div className="handmade-hero__trust" aria-label="Artzy's Studio promises"><span>Artist-led studio</span><i/> <span>Small-batch creations</span><i/> <span>Made in Pune</span></div>
    </div>
    <a className="handmade-hero__peek" href="#shop-by-category" aria-label="Continue to shop by category"><span>Discover the studio</span>↓</a>
    <style jsx>{`
      .handmade-hero{position:relative;min-height:clamp(500px,58svh,610px);display:grid;align-items:center;overflow:hidden;background:#f3e8dc;color:#3e302a}.handmade-hero__image{position:absolute;z-index:0;top:24px;right:24px;bottom:24px;width:56%;height:calc(100% - 48px);border-radius:6px;object-fit:cover;object-position:center;box-shadow:0 18px 48px rgba(73,52,40,.13)}.handmade-hero__shade{position:absolute;z-index:1;inset:0;background:linear-gradient(90deg,#f8f0e7 0%,#f8f0e7 39%,rgba(248,240,231,.9) 47%,rgba(248,240,231,.18) 64%,transparent 75%)}.handmade-hero__copy{position:relative;z-index:2;width:min(535px,43vw);margin-left:max(24px,calc((100vw - 1440px)/2 + 64px));padding:42px 0 56px}.handmade-hero__eyebrow{display:block;color:#a64b50;font-size:.62rem;font-weight:700;letter-spacing:.16em;line-height:1.5;text-transform:uppercase}.handmade-hero h1{max-width:510px;margin:14px 0 18px;font:400 clamp(3.05rem,4.5vw,4.9rem)/.91 var(--font-serif),Georgia,serif;letter-spacing:-.046em}.handmade-hero h1 em{color:#ae4e53;font-weight:400}.handmade-hero p{max-width:475px;margin:0;color:#69574e;font-size:clamp(.92rem,1vw,1.02rem);line-height:1.62}.handmade-hero__actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:23px}.handmade-hero__primary,.handmade-hero__secondary{min-height:43px;display:inline-flex;align-items:center;justify-content:center;padding:10px 17px;border-radius:999px;font-size:.72rem;font-weight:700;text-decoration:none}.handmade-hero__primary{gap:18px;background:#ad4f54;color:#fff;box-shadow:0 10px 22px #93424726}.handmade-hero__secondary{border:1px solid #ac5155;color:#934247;background:rgba(255,250,245,.75)}.handmade-hero__trust{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:26px;color:#755f55;font-size:.57rem;font-weight:650;letter-spacing:.08em;text-transform:uppercase}.handmade-hero__trust i{width:4px;height:4px;border-radius:50%;background:#b5575b}.handmade-hero__peek{position:absolute;z-index:3;left:50%;bottom:8px;display:grid;justify-items:center;gap:2px;color:#7c655b;font-size:.52rem;letter-spacing:.13em;text-decoration:none;text-transform:uppercase}.handmade-hero__peek::after{content:'';width:1px;height:11px;background:#a75c5e}@media(max-width:800px){.handmade-hero{min-height:calc(100svh - 105px);align-items:end}.handmade-hero__image{top:0;right:0;bottom:auto;width:100%;height:55%;border-radius:0;object-position:62% center;box-shadow:none}.handmade-hero__shade{background:linear-gradient(0deg,rgba(248,240,231,.995) 0%,rgba(248,240,231,.96) 44%,rgba(248,240,231,.12) 76%)}.handmade-hero__copy{width:auto;margin:0;padding:clamp(250px,46svh,420px) 20px 52px}.handmade-hero h1{font-size:clamp(2.75rem,12.5vw,4.45rem);line-height:.92}.handmade-hero p{font-size:.93rem}.handmade-hero__actions{align-items:stretch;flex-direction:column}.handmade-hero__primary,.handmade-hero__secondary{width:100%}.handmade-hero__trust{justify-content:center;gap:8px;margin-top:22px;font-size:.53rem}.handmade-hero__peek{display:none}}@media(max-width:370px){.handmade-hero__trust span:last-child,.handmade-hero__trust i:last-of-type{display:none}}@media(prefers-reduced-motion:no-preference){.handmade-hero__image{animation:hero-breathe 16s ease-in-out infinite alternate}@keyframes hero-breathe{to{transform:scale(1.008)}}}
    `}</style>
  </section>;
}
