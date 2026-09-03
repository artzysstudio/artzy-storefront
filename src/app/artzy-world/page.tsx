import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Artzy World | Preview Art in Your Room | Artzy's Studio",
  description: "See selected Artzy artwork in your own space. Upload a wall photo, compare approximate size, placement, frame and colour mood, then continue to the correct studio workflow.",
  alternates: { canonical: '/artzy-world/' },
  openGraph: {
    title: "Artzy World | Preview Art in Your Room",
    description: "See selected Artzy artwork in your own space before you choose.",
    url: '/artzy-world/',
  },
};

const experienceSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Artzy World',
  description: "Artzy's Studio room visualisation experience for selected artwork.",
  url: 'https://www.artzysstudio.in/artzy-world/',
  isPartOf: {
    '@type': 'WebSite',
    name: "Artzy's Studio",
    url: 'https://www.artzysstudio.in/',
  },
};

export default function ArtzyWorldPage() {
  return <>
    <Header />
    <main className="artzy-world-page artzy-world-focused">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(experienceSchema) }} />

      <nav className="world-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Artzy World</span>
      </nav>

      <section className="story-hero story-hero--world">
        <img className="story-hero__image" src="/images/artzy-world-hero-v2.webp" alt="Artzy floral artwork moving from the studio into a home wall preview" />
        <div className="story-hero__shade" aria-hidden="true" />
        <div className="story-hero__copy">
          <span className="world-eyebrow">Artzy World · Room visualisation</span>
          <h1>See selected Artzy artwork<br/><em>in your own space.</em></h1>
          <p>Upload a photograph of your wall or begin with a sample room. Compare approximate placement, size, frame and colour mood before you choose what happens next.</p>
          <div className="story-hero__actions">
            <a className="story-hero__primary" href="/artzy-world/preview/">Preview art in my room</a>
            <a className="story-hero__secondary" href="#how-it-works">How the preview works</a>
          </div>
          <div className="world-powered"><i aria-hidden="true">✿</i><span>Powered by <strong>ArtzyAI</strong><small>Part of the Artzy&apos;s Studio experience</small></span></div>
          <small>Visual placement is approximate. ERP remains authoritative for product, price, stock and dimensions.</small>
        </div>
      </section>

      <section className="world-purpose world-purpose--focused" id="how-it-works">
        <header>
          <span className="world-eyebrow">One focused experience</span>
          <h2>From a wall photograph<br/><em>to a clearer decision.</em></h2>
          <p>Artzy World is the studio&apos;s visualisation layer—not another catalogue or builder. It helps you understand a piece in context, then returns you to its existing product or custom-art journey.</p>
        </header>
        <ol className="world-five-steps">
          <li><b>01</b><div><h3>Select an art direction</h3><p>Choose available Artzy artwork from the studio ERP, or begin a custom wall-art direction.</p></div></li>
          <li><b>02</b><div><h3>Bring in your room</h3><p>Upload a clear wall photograph or use a carefully labelled sample room.</p></div></li>
          <li><b>03</b><div><h3>Adjust the view</h3><p>Compare approximate placement, size, frame and colour mood in one comfortable workspace.</p></div></li>
          <li><b>04</b><div><h3>Add optional guidance</h3><p>Choose room-aware recommendations and optional Vastu-inspired guidance within the same preview.</p></div></li>
          <li><b>05</b><div><h3>Continue in the right place</h3><p>Open the existing ERP product or carry your choices into the studio&apos;s custom-art workflow.</p></div></li>
        </ol>
      </section>

      <section className="world-ar world-ar--focused" id="room-preview">
        <figure className="world-ar-art"><img src="/assets/artzy-world-ar.webp" width="1536" height="1152" alt="A phone showing an Artzy floral artwork positioned on a living room wall" /></figure>
        <div className="world-ar-copy">
          <span className="world-eyebrow">Full-page room preview</span>
          <h2>Picture the scale.<br/><em>Keep the choice simple.</em></h2>
          <p>The workspace stays open and full-page, with no nested frame or second scrollbar. Your room and art choices remain together while you compare the view.</p>
          <div className="world-preview-promises">
            <article><b>Available studio artwork</b><p>See the ERP product, current price and stock status, then open its product page or add it to your bag.</p></article>
            <article><b>Custom wall-art direction</b><p>Carry room, palette, size, frame and optional Vastu preference into the existing custom hand-painted artwork workflow.</p></article>
          </div>
          <div className="world-coming-soon world-preview-live" role="status"><span aria-hidden="true">✿</span><div><strong>Interactive preview is ready</strong><small>Your uploaded wall photo stays in your browser during the preview.</small></div></div>
          <div className="world-actions"><a className="world-primary" href="/artzy-world/preview/">Open full room preview</a></div>
        </div>
      </section>

      <section className="world-scope" aria-labelledby="world-scope-title">
        <span className="world-eyebrow">A clear boundary</span>
        <h2 id="world-scope-title">Preview here.<br/><em>Create and shop in their proper places.</em></h2>
        <p>Caricatures, Digital Art &amp; Prints, Name Plates, Gifts and other personalised services keep their own dedicated pages. Artzy World will take you there only when it helps you continue—never show you a second version of the same builder.</p>
        <a href="/artzy-world/preview/">Start my room preview <span aria-hidden="true">→</span></a>
      </section>
    </main>
    <Footer />
  </>;
}
