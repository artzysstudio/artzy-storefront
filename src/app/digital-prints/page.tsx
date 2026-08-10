import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const directions = [
  ['Modern & abstract', 'Colour-led compositions for living rooms, bedrooms and statement walls.'],
  ['Geometric & minimal', 'Balanced shapes, restrained palettes and contemporary visual rhythm.'],
  ['Caricatures from photos', 'Joyful portraits for couples, families, birthdays, weddings and teams.'],
  ['Commercial art', 'Custom artwork for offices, hospitality, gifting and brand-led spaces.'],
];

export default function DigitalPrintsPage() {
  return <>
    <Header />
    <main className="digital-page">
      <section className="story-hero story-hero--digital">
        <img className="story-hero__image" src="/images/digital-hero-v3.webp" alt="Modern abstract and geometric prints with a complete personalised couple caricature in an Artzy-style digital design workspace" />
        <div className="story-hero__shade" aria-hidden="true" />
        <div className="story-hero__copy digital-hero-copy">
          <span className="service-eyebrow">Digital art · prints · caricatures</span>
          <h1>Your idea, reimagined as <em>art.</em></h1>
          <p>Share a photograph, a room or a creative brief. Deepti&apos;s studio transforms it into modern wall art, a custom canvas print or a joyful personalised caricature.</p>
          <div className="digital-hero-tags" aria-label="Digital art services"><span>Abstract &amp; modern</span><span>Custom canvas prints</span><span>Caricatures from photos</span></div>
          <div className="story-hero__actions"><a className="story-hero__primary" href="#create">See what we create</a><Link className="story-hero__secondary" href="/contact/">Discuss your idea</Link></div>
          <small>Artzy-style illustration · Custom direction, format and price confirmed before production</small>
        </div>
      </section>

      <section className="digital-promise" aria-label="Service benefits">
        <span>Created to your brief</span><span>Preview before production</span><span>Digital file or physical print</span><span>Home &amp; commercial projects</span>
      </section>

      <section className="digital-create" id="create">
        <div className="digital-section-heading"><span className="service-eyebrow">Choose your creative path</span><h2>What would you like us to make?</h2><p>Two specialist services, each guided personally by the studio.</p></div>
        <div className="digital-path-grid">
          <article className="digital-path digital-path-print">
            <div className="digital-path-art" aria-hidden="true"><span className="art-frame frame-one"/><span className="art-frame frame-two"/><span className="art-frame frame-three"/></div>
            <div className="digital-path-copy"><span className="digital-path-number">01 · Digital prints &amp; wall art</span><h3>Art composed for your room.</h3><p>Tell us the wall size, palette and mood. We can develop modern, abstract, geometric or completely bespoke artwork for homes, offices and hospitality spaces.</p><ul><li>Custom colours, proportions and sizes</li><li>Fine-art paper or canvas options</li><li>Single statement pieces or coordinated sets</li><li>Print-ready digital artwork also available</li></ul><Link href="/shop/?category=digital-prints">Explore available prints <span>→</span></Link></div>
          </article>
          <article className="digital-path digital-path-caricature">
            <div className="digital-path-art caricature-scene" aria-hidden="true"><div className="portrait-card"><span className="portrait-head"/><span className="portrait-body"/><i>♥</i></div><div className="portrait-card second"><span className="portrait-head"/><span className="portrait-body"/><i>✦</i></div></div>
            <div className="digital-path-copy"><span className="digital-path-number">02 · Personalised caricatures</span><h3>Their personality, drawn with joy.</h3><p>Send clear photographs and tell us their story. We turn familiar expressions, hobbies and memorable details into an affectionate artwork made especially for the occasion.</p><ul><li>Individuals, couples, families and pets</li><li>Birthdays, weddings and anniversaries</li><li>Team, farewell and corporate tributes</li><li>Digital file, framed print or canvas</li></ul><Link href="/caricatures/">Discover caricatures <span>→</span></Link></div>
          </article>
        </div>
      </section>

      <section className="digital-directions"><div className="digital-section-heading"><span className="service-eyebrow">Creative directions</span><h2>A starting point—not a limit.</h2></div><div className="digital-direction-grid">{directions.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

      <section className="digital-formats"><div><span className="service-eyebrow">Choose the finish</span><h2>Made for how you want to use it.</h2><p>Final size, material, stock availability and delivery timing are confirmed by the studio before payment for a custom order.</p></div><div className="digital-format-list"><article><strong>Digital file</strong><span>High-resolution artwork for approved personal or commercial use.</span></article><article><strong>Fine-art print</strong><span>A refined paper finish suited to framing and gifting.</span></article><article><strong>Canvas print</strong><span>A ready-to-display choice for homes, offices and hospitality.</span></article><article><strong>Custom series</strong><span>Coordinated multi-piece art for larger walls and business spaces.</span></article></div></section>

      <section className="digital-process"><div className="digital-section-heading"><span className="service-eyebrow">A clear custom workflow</span><h2>From inspiration to finished artwork.</h2></div><ol><li><b>1</b><strong>Share</strong><span>Send photos, wall measurements, colours, occasion and budget.</span></li><li><b>2</b><strong>Direction</strong><span>The studio confirms style, format, price and expected timeline.</span></li><li><b>3</b><strong>Preview</strong><span>Review the concept and provide feedback before final production.</span></li><li><b>4</b><strong>Receive</strong><span>Get the approved digital file or your carefully finished physical print.</span></li></ol><div className="service-actions center"><Link className="service-primary" href="/contact/">Start a custom artwork</Link><a className="service-secondary" href="https://wa.me/919158680722" target="_blank" rel="noreferrer">Ask on WhatsApp</a></div></section>
    </main>
    <Footer />
  </>;
}
