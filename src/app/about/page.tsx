"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const deeptiPhoto = "/images/deepti_portrait.png";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="about-page">
        <section className="about-hero">
          <div className="about-hero__portrait">
            <img
              src={deeptiPhoto}
              alt="Deepti J. Shah, founder and artist of Artzy’s Studio"
            />
            <span className="about-hero__seal" aria-hidden="true">
              <b>✦</b> Artist · Founder
            </span>
          </div>

          <div className="about-hero__copy">
            <span className="about-eyebrow">Meet the artist</span>
            <h1>
              Her art speaks
              <br />
              <em>beyond words.</em>
            </h1>
            <blockquote>
              “Art became her voice, expressing what words never could.”
            </blockquote>
            <p>
              Artzy’s Studio is the creative world of Deepti J. Shah—an
              established artist who has navigated life with hearing impairment
              since birth. Through colour, texture and thoughtful detail, she
              transforms silence into a deeply personal visual language.
            </p>
            <div className="about-actions">
              <Link href="/shop" className="about-primary">
                Explore Deepti’s work <span>→</span>
              </Link>
              <Link href="/personalized" className="about-secondary">
                Commission something personal
              </Link>
            </div>
          </div>
        </section>

        <section className="about-manifesto">
          <span className="about-eyebrow">The vision</span>
          <div>
            <h2>Silence is not empty. It is full of answers.</h2>
            <p>
              Deepti created Artzy’s Studio as a place of “visual silence”—a
              space where the noise of the world softens and hand-painted art
              can speak through every brushstroke, shadow and hue.
            </p>
          </div>
        </section>

        <section className="about-story">
          <div className="about-story__lead">
            <span>01</span>
            <h2>A studio built on expression.</h2>
          </div>
          <div className="about-story__body">
            <p>
              Artzy’s Studio is more than a place of creation. It is a bridge
              between silence and expression, founded on the belief that an
              artist’s perspective can turn perceived limitations into
              extraordinary creative depth.
            </p>
            <p>
              As a deaf-led enterprise, the studio champions visual
              storytelling and meaningful craftsmanship. Every purchase
              supports independent artistry and a movement that proves talent
              is seen, felt and understood—even when it is not heard.
            </p>
          </div>
        </section>

        <section className="about-practice">
          <div className="about-practice__heading">
            <span className="about-eyebrow">The practice</span>
            <h2>Made slowly.<br />Remembered deeply.</h2>
          </div>
          <div className="about-practice__grid">
            <article>
              <span>01</span>
              <h3>Original canvases</h3>
              <p>Bespoke paintings that capture the soul of a space.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Art for everyday life</h3>
              <p>Hand-painted objects that bring expression to walls, tables and desks.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Personalised stories</h3>
              <p>Portraits, caricatures and gifts shaped around identity and memory.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Purposeful gifting</h3>
              <p>Thoughtful artist-led keepsakes for people, teams and milestones.</p>
            </article>
          </div>
        </section>

        <section className="about-closing">
          <span>Artzy’s Studio · By Deepti J. Shah</span>
          <h2>Bring home a piece of her visual language.</h2>
          <Link href="/shop">Discover the collection →</Link>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        :global(.header){position:relative;top:auto;max-width:none;width:100%;margin:0;padding-inline:clamp(20px,4vw,72px)}
        .about-page{background:#fdf8f1;color:#3c2e2a;overflow:hidden}
        .about-hero{display:grid;grid-template-columns:minmax(0,52%) minmax(0,48%);min-height:760px;background:#f4eadf}
        .about-hero__portrait{position:relative;min-width:0;overflow:hidden}
        .about-hero__portrait img{width:100%;height:100%;object-fit:cover;object-position:center 28%;display:block;filter:saturate(.9)}
        .about-hero__seal{position:absolute;right:24px;bottom:24px;width:116px;height:116px;border-radius:50%;display:grid;place-content:center;text-align:center;background:rgba(255,250,245,.92);color:#a64e52;font-size:.64rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;backdrop-filter:blur(8px)}
        .about-hero__seal b{display:block;font-size:1.45rem;margin-bottom:5px}
        .about-hero__copy{display:flex;flex-direction:column;justify-content:center;min-width:0;padding:clamp(56px,7vw,110px)}
        .about-eyebrow{color:#a64e52;font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase}
        h1,h2,h3{font-family:var(--font-serif),serif;font-weight:400}
        h1{margin:18px 0 28px;font-size:clamp(3.6rem,6vw,6.6rem);line-height:.92;letter-spacing:-.045em}
        h1 em{color:#a64e52;font-weight:400}
        blockquote{margin:0 0 24px;padding:0 0 0 18px;border-left:2px solid #a64e52;font-family:var(--font-serif),serif;font-size:clamp(1.15rem,1.6vw,1.45rem);line-height:1.5;color:#55443e}
        .about-hero__copy>p{font-size:1.04rem;line-height:1.8;color:#75645d}
        .about-actions{display:flex;align-items:center;gap:24px;flex-wrap:wrap;margin-top:32px}
        .about-primary{display:flex;justify-content:space-between;gap:28px;min-width:230px;padding:16px 18px;background:#a64e52;color:white;font-size:.82rem;font-weight:700;box-shadow:5px 5px 0 #dcb8ae}
        .about-secondary{padding-bottom:4px;border-bottom:1px solid #a64e52;font-size:.82rem}
        .about-manifesto{display:grid;grid-template-columns:.35fr 1fr;gap:6vw;max-width:1280px;margin:0 auto;padding:120px 6vw;border-bottom:1px solid #ddcec3}
        .about-manifesto h2{max-width:900px;margin:0 0 28px;font-size:clamp(3rem,5.4vw,6rem);line-height:.98;color:#a64e52}
        .about-manifesto p{max-width:720px;font-size:1.08rem;line-height:1.85}
        .about-story{display:grid;grid-template-columns:1fr 1fr;gap:8vw;max-width:1280px;margin:0 auto;padding:110px 6vw}
        .about-story__lead span,.about-practice article>span{color:#a64e52;font-size:.7rem;font-weight:700;letter-spacing:.14em}
        .about-story h2{margin:20px 0 0;font-size:clamp(2.7rem,4.5vw,5rem);line-height:1}
        .about-story__body{padding-top:30px}
        .about-story__body p{margin-bottom:24px;font-size:1rem;line-height:1.9}
        .about-practice{padding:110px 6vw;background:#352a26;color:#fff8ef}
        .about-practice__heading{max-width:1280px;margin:0 auto 54px;display:flex;align-items:end;justify-content:space-between;gap:40px}
        .about-practice__heading .about-eyebrow{color:#df9ba0}
        .about-practice h2{margin:0;font-size:clamp(3rem,5vw,5.7rem);line-height:.95;color:#fff8ef}
        .about-practice__grid{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid rgba(255,255,255,.2);border-left:1px solid rgba(255,255,255,.2)}
        .about-practice article{min-width:0;padding:34px 24px 38px;border-right:1px solid rgba(255,255,255,.2);border-bottom:1px solid rgba(255,255,255,.2)}
        .about-practice article>span{color:#df9ba0}
        .about-practice h3{margin:46px 0 12px;font-size:1.5rem;color:#fff8ef}
        .about-practice p{font-size:.88rem;line-height:1.7;color:#cbbab2}
        .about-closing{display:flex;min-height:520px;padding:100px 6vw;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#ead7cc}
        .about-closing>span{color:#a64e52;font-size:.68rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase}
        .about-closing h2{max-width:900px;margin:24px 0 34px;font-size:clamp(3rem,6vw,6.5rem);line-height:.95}
        .about-closing a{padding-bottom:5px;border-bottom:1px solid #a64e52;font-weight:700}
        @media(max-width:850px){:global(.header){position:relative;top:auto}.about-page{overflow:visible}.about-hero{grid-template-columns:1fr;min-height:auto}.about-hero__portrait{height:min(68svh,640px)}.about-hero__copy{padding:56px 22px 70px}.about-manifesto,.about-story{grid-template-columns:1fr;gap:32px;padding:78px 22px}.about-manifesto{margin:0}.about-story{margin:0}.about-practice{padding:78px 22px}.about-practice__heading{display:block}.about-practice h2{margin-top:18px}.about-practice__grid{grid-template-columns:1fr 1fr}.about-closing{min-height:460px;padding:76px 22px}}
        @media(max-width:520px){.about-hero__portrait{height:520px}.about-hero__seal{right:14px;bottom:14px;width:92px;height:92px}h1{font-size:clamp(3.2rem,15vw,4.5rem)}.about-actions{align-items:stretch;flex-direction:column}.about-primary{width:100%;min-width:0}.about-secondary{width:max-content;max-width:100%}.about-practice__grid{grid-template-columns:1fr}.about-practice h3{margin-top:30px}.about-manifesto h2{font-size:3.1rem}}
      `}</style>
    </>
  );
}
