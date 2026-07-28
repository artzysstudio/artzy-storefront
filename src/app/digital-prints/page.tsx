import Link from 'next/link';

const styles = [
  ['Modern Art', 'Clean, expressive compositions created around your palette and space.'],
  ['Abstract', 'Layered colour, movement and mood translated into a statement artwork.'],
  ['Geometric', 'Structured forms and contemporary balance for modern interiors.'],
  ['Bespoke Concepts', 'Original visual directions developed from your story, brief or brand.'],
];

export default function DigitalPrintsPage() {
  return <main className="service-page">
    <section className="service-hero digital-hero">
      <div className="service-hero-copy"><span className="service-eyebrow">Made for your space</span><h1>Digital art, thoughtfully <em>made yours.</em></h1><p>From modern and abstract compositions to geometric designs, Deepti creates customised artwork that belongs naturally in your home, office or corporate environment.</p><div className="service-actions"><Link className="service-primary" href="/shop/?category=digital-prints">Shop Digital Prints</Link><Link className="service-secondary" href="/contact/">Request a Custom Design</Link></div></div>
      <div className="service-art-panel"><span>HOME DECOR</span><strong>Colour that completes the room.</strong><span>WORKSPACES</span><strong>Art that reflects your ambition.</strong><span>CORPORATE</span><strong>Creative visual stories for your brand.</strong></div>
    </section>
    <section className="service-section"><span className="service-eyebrow">What we can create</span><h2>One idea. Many artistic possibilities.</h2><div className="service-card-grid">{styles.map(([title, copy], i) => <article className="service-card" key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="service-split"><div><span className="service-eyebrow">Designed around you</span><h2>Your wall, palette and purpose lead the artwork.</h2></div><div className="service-list"><p><strong>For homes</strong> Living rooms, bedrooms, entrances and styled corners.</p><p><strong>For work</strong> Receptions, cabins, meeting rooms, cafés and hospitality spaces.</p><p><strong>For brands</strong> Bespoke colours, themes, sizes and multi-piece collections.</p></div></section>
    <section className="service-process"><span className="service-eyebrow">Simple custom workflow</span><h2>From your brief to a finished canvas.</h2><ol><li><strong>Share</strong><span>Your wall photo, size, colours and inspiration.</span></li><li><strong>Imagine</strong><span>Preview the direction with ArtzyAI.</span></li><li><strong>Create</strong><span>We develop and refine your artwork.</span></li><li><strong>Deliver</strong><span>Your print arrives ready for its new space.</span></li></ol><div className="service-actions center"><a className="service-primary" href="https://artzyai.artzysstudio.in/" target="_blank" rel="noreferrer">Try ArtzyAI</a><Link className="service-secondary" href="/contact/">Start Your Project</Link></div></section>
  </main>;
}
