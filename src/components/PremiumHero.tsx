"use client";

import Link from "next/link";

export default function PremiumHero() {
  return (
    <section className="premium-hero" aria-labelledby="premium-hero-title">
      <div className="premium-hero__copy">
        <span className="premium-hero__eyebrow">The creative world of Deepti J. Shah</span>
        <h1 id="premium-hero-title">Art in every form.<br /><em>Made personal.</em></h1>
        <p>Discover hand-painted originals, digital art and prints, expressive caricatures and meaningful gifts—created for the people and spaces you love.</p>
        <div className="premium-hero__actions">
          <Link className="premium-hero__primary" href="/shop">Explore all art <span>→</span></Link>
          <Link className="premium-hero__secondary" href="/shop?category=personalised-gifts">Create something personal</Link>
        </div>
        <div className="premium-hero__proof" aria-label="Studio promises">
          <span><b>Artist-led</b><small>By Deepti</small></span><span><b>Physical & digital</b><small>More ways to create</small></span><span><b>Made for you</b><small>Personalisation available</small></span>
        </div>
      </div>
      <div className="premium-hero__visual">
        <img src="/assets/painting_1.png" alt="An original Artzy's Studio painting styled in a warm interior" />
        <div className="premium-hero__stamp" aria-hidden="true"><span>✦</span> artist made</div>
        <div className="premium-hero__card"><span>From Deepti&apos;s studio</span><strong>One creative studio. Many forms of art.</strong><Link href="/shop">Discover the collections →</Link></div>
      </div>
      <div className="premium-hero__ribbon" aria-hidden="true"><span>✦</span><i>HAND PAINTED</i><span>❋</span><i>DIGITAL ART</i><span>✦</span><i>CARICATURES</i><span>❋</span><i>MADE FOR YOU</i></div>
      <style jsx>{`
        .premium-hero{position:relative;display:grid;grid-template-columns:minmax(0,46%) minmax(0,54%);min-height:min(780px,calc(100svh - 120px));overflow:hidden;background:#f6eee4;color:#382c28}
        .premium-hero__copy{display:flex;flex-direction:column;justify-content:center;min-width:0;padding:clamp(54px,7vw,110px) clamp(24px,5vw,80px) 96px}.premium-hero__eyebrow{color:#a64e52;font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase}
        h1{margin:20px 0 24px;font-size:clamp(3.2rem,6.2vw,6.7rem);line-height:.92;letter-spacing:-.045em}h1 em{font-weight:400;color:#a64e52}p{max-width:560px;font-size:clamp(.98rem,1.25vw,1.15rem);line-height:1.7;color:#6d5d56}
        .premium-hero__actions{display:flex;align-items:center;gap:22px;flex-wrap:wrap;margin-top:32px}.premium-hero__primary{display:flex;align-items:center;justify-content:space-between;gap:32px;min-width:230px;padding:16px 18px;background:#a64e52;color:white;font-size:.82rem;font-weight:700;box-shadow:5px 5px 0 #dcb8ae}.premium-hero__secondary{padding-bottom:4px;border-bottom:1px solid #a64e52;font-size:.82rem}
        .premium-hero__proof{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:48px;padding-top:18px;border-top:1px solid #d8c9bd}.premium-hero__proof b,.premium-hero__proof small{display:block}.premium-hero__proof b{font-family:var(--font-serif),serif;font-size:1rem;font-weight:400}.premium-hero__proof small{margin-top:3px;color:#897770;font-size:.64rem;text-transform:uppercase;letter-spacing:.08em}
        .premium-hero__visual{position:relative;min-width:0;overflow:hidden;background:#d9c8ba}.premium-hero__visual>img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;transition:transform 1.2s ease}.premium-hero:hover .premium-hero__visual>img{transform:scale(1.018)}
        .premium-hero__stamp{position:absolute;top:24px;right:24px;width:98px;height:98px;border-radius:50%;display:grid;place-content:center;text-align:center;background:rgba(255,250,245,.9);color:#a64e52;font-size:.62rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;backdrop-filter:blur(8px)}.premium-hero__stamp span{display:block;font-size:1.25rem;margin-bottom:4px}
        .premium-hero__card{position:absolute;left:24px;right:24px;bottom:66px;max-width:390px;padding:20px 22px;background:rgba(253,248,241,.92);backdrop-filter:blur(10px)}.premium-hero__card span{color:#a64e52;font-size:.62rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase}.premium-hero__card strong{display:block;margin:7px 0;font-family:var(--font-serif),serif;font-size:1.35rem;font-weight:400}.premium-hero__card a{font-size:.76rem;border-bottom:1px solid #a64e52}
        .premium-hero__ribbon{position:absolute;left:0;right:0;bottom:0;height:42px;display:flex;align-items:center;justify-content:space-around;gap:22px;overflow:hidden;white-space:nowrap;background:#a64e52;color:#fff8f1;font-size:.62rem;letter-spacing:.16em}.premium-hero__ribbon i{font-style:normal}.premium-hero__ribbon span{font-size:1rem}
        @media(max-width:800px){.premium-hero{grid-template-columns:1fr;min-height:auto}.premium-hero__visual{grid-row:1;height:min(54svh,480px)}.premium-hero__copy{grid-row:2;padding:40px 20px 76px}h1{font-size:clamp(2.9rem,13vw,4.6rem);overflow-wrap:anywhere}p{font-size:.98rem}.premium-hero__stamp{top:14px;right:14px;width:78px;height:78px}.premium-hero__card{left:14px;right:14px;bottom:14px;max-width:none;padding:15px 16px}.premium-hero__card strong{font-size:1.1rem}.premium-hero__proof{margin-top:36px;gap:8px}.premium-hero__proof b{font-size:.88rem}.premium-hero__proof small{font-size:.55rem}.premium-hero__ribbon{height:38px}}
        @media(max-width:380px){.premium-hero__visual{height:360px}.premium-hero__copy{padding-inline:16px}.premium-hero__actions{align-items:stretch;flex-direction:column}.premium-hero__primary{width:100%;min-width:0}.premium-hero__secondary{width:max-content}.premium-hero__proof{grid-template-columns:1fr 1fr}.premium-hero__proof span:last-child{display:none}}@media(prefers-reduced-motion:reduce){.premium-hero__visual>img{transition:none}}
      `}</style>
    </section>
  );
}
