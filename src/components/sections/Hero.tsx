import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-l">
        <span className="sl">New Collection</span>
        <h1 className="hero-h">The <em>Earth</em><br />&amp; Canvas</h1>
        <p className="hero-b">
          Discover our latest collection of handcrafted clay pieces and textured canvas paintings. Designed to bring warmth and intention into your everyday spaces.
        </p>
        <div className="hero-act">
          <Link href="/shop" className="bp">Explore Collection</Link>
          <Link href="/personalized" className="bo">Commission Art</Link>
        </div>
        <div className="hero-meta">
          <div>
            <span className="hsn">140+</span>
            <span className="hsl">Unique Pieces</span>
          </div>
          <div>
            <span className="hsn">20+</span>
            <span className="hsl">Corporate Clients</span>
          </div>
        </div>
      </div>
      <div className="hero-r">
        <div className="hero-rbg"></div>
        <div className="hero-frame">
          <div className="hero-tag">Best Seller</div>
          <div className="hero-mat">
            <div className="hero-canvas">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="30" fill="rgba(255,255,255,0.15)"/>
                <path d="M20 80 Q 50 20 80 80" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </div>
          <div className="hero-ainfo">
            <div>
              <span className="hat">Textured Arch</span>
              <span className="hap">Canvas &amp; Clay</span>
            </div>
            <span className="hab">₹4,299</span>
          </div>
        </div>
      </div>
    </section>
  );
}
