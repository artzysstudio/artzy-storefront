import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Artzy World | Art, Story & Space",
  description: "Discover Artzy World—where Deepti J. Shah's handmade art, personal stories and future AR experiences come together.",
};

export default function ArtzyWorldPage() {
  return <>
    <Header />
    <main className="artzy-world-page">
      <section className="story-hero story-hero--world">
        <img className="story-hero__image" src="/images/artzy-world-hero-v2.webp" alt="An Artzy floral artwork moving from a painted studio piece to a framed home display and phone room preview" />
        <div className="story-hero__shade" aria-hidden="true" />
        <div className="story-hero__copy">
          <span className="world-eyebrow">Handmade · Personal · Imaginative</span>
          <h1>Welcome to<br/><em>Artzy World.</em></h1>
          <p>Discover art created by Deepti and the Artzy&apos;s Studio team, personalise it around your story, and preview selected pieces in your own space before deciding.</p>
          <div className="story-hero__actions">
            <a className="story-hero__primary" href="/artzy-world/preview/">Preview art in my room</a>
            <a className="story-hero__secondary" href="#journey">Understand how it works</a>
          </div>
          <div className="world-signature"><i aria-hidden="true">✿</i><span>From the studio<br/>to your space</span></div>
          <small>Artzy-style illustration · Preview features are separate from current ERP stock</small>
        </div>
      </section>

      <nav className="world-path-nav" aria-label="Artzy World page journey">
        <a href="#purpose"><b>01</b><span><small>Understand</small>Why Artzy World</span></a>
        <a href="#journey"><b>02</b><span><small>Discover</small>How it works</span></a>
        <a href="#ar-experience"><b>03</b><span><small>Preview</small>The AR vision</span></a>
      </nav>

      <section className="world-purpose" id="purpose">
        <header>
          <span className="world-eyebrow">Why Artzy World exists</span>
          <h2>Art should feel closer,<br/><em>more personal and more possible.</em></h2>
          <p>Artzy World brings together the parts of Artzy&apos;s Studio that make it different: original making, thoughtful customisation and technology that helps you choose with confidence.</p>
        </header>
        <div className="world-pillars">
          <article><b>01</b><i aria-hidden="true">✦</i><h3>Created here</h3><p>Hand-painted art and crafted objects developed by Deepti and the studio—not anonymous mass production.</p></article>
          <article><b>02</b><i aria-hidden="true">♡</i><h3>Shaped around you</h3><p>Colours, stories, spaces and occasions guide personal artworks, gifts and commissioned pieces.</p></article>
          <article><b>03</b><i aria-hidden="true">⌑</i><h3>Seen before you choose</h3><p>Our developing AR experience will help you understand scale, placement and mood inside your own room.</p></article>
        </div>
      </section>

      <section className="world-journey" id="journey" aria-label="The Artzy World journey">
        <div className="world-journey-heading"><span className="world-eyebrow">One connected journey</span><h2>Discover. Personalise.<br/>Place it in your world.</h2></div>
        <ol>
          <li><span>01</span><strong>Find your piece</strong><p>Explore handmade decor, gifts, original art and digital creations from the studio.</p></li>
          <li><span>02</span><strong>Make it meaningful</strong><p>Choose a ready piece or share a story, photograph, colour palette or creative brief.</p></li>
          <li><span>03</span><strong>Picture it clearly</strong><p>Upload your wall or choose a sample room, then compare size, placement, frame and colour mood.</p></li>
          <li><span>04</span><strong>Made and delivered</strong><p>The studio confirms the finish, timeline and delivery before your artwork begins its journey.</p></li>
        </ol>
      </section>

      <section className="world-ar" id="ar-experience">
        <figure className="world-ar-art"><img src="/assets/artzy-world-ar.webp" width="1536" height="1152" alt="Illustration showing a framed Artzy artwork previewed on a living room wall through a phone" /></figure>
        <div className="world-ar-copy">
          <span className="world-eyebrow">Next in Artzy World · AR</span>
          <h2>See the feeling<br/><em>before it arrives.</em></h2>
          <p>Choosing art online should not feel like guesswork. Artzy World lets you preview selected wall art in a ready room or on your own wall photo, then adjust its size, placement, frame and colour mood.</p>
          <ul>
            <li><i>01</i><span><strong>Choose an AR-ready piece</strong>Look for the preview option on supported products.</span></li>
            <li><i>02</i><span><strong>Point at your space</strong>Use your phone camera to view the wall, table or surface.</span></li>
            <li><i>03</i><span><strong>Decide with confidence</strong>Understand placement and visual mood before ordering.</span></li>
          </ul>
          <div className="world-coming-soon world-preview-live" role="status"><span aria-hidden="true">✿</span><div><strong>Interactive room preview is live</strong><small>Use the workspace below. Camera access is requested only when you choose your own wall photo.</small></div></div>
          <div className="world-actions"><a className="world-primary" href="/artzy-world/preview/">Open full room preview</a><Link className="world-secondary" href="/contact/">Discuss your space</Link></div>
        </div>
      </section>

      <section className="world-live-preview" id="live-preview" aria-labelledby="live-preview-title">
        <header>
          <div><span className="world-eyebrow">Artzy World · Interactive preview</span><h2 id="live-preview-title">Place art in<br/><em>your own world.</em></h2></div>
          <p>Open a comfortable full-page workspace to choose an available Artzy piece or an Artzy Muse direction, upload your wall and compare placement without working inside a small box.</p>
        </header>
        <div className="world-preview-launch">
          <span aria-hidden="true">✿</span>
          <div><strong>Full-page preview workspace</strong><small>ERP availability stays separate from Muse-made custom concepts.</small></div>
          <a className="world-primary" href="/artzy-world/preview/">Enter the preview</a>
        </div>
      </section>

      <section className="world-closing">
        <span className="world-eyebrow">The world we are building</span>
        <h2>Human creativity first.<br/><em>Technology in service of art.</em></h2>
        <p>Artzy World will keep growing—from handmade collections and custom gifting to digital art, commercial work and thoughtful ways to experience art before it reaches you.</p>
        <Link href="/about/">Meet Deepti and the studio <span aria-hidden="true">→</span></Link>
      </section>
    </main>
    <Footer />
  </>;
}
