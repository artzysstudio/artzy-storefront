import Image from 'next/image';
import Link from 'next/link';

export default function HomeGiftHamper() {
  return <section className="home-hamper" aria-labelledby="home-hamper-title">
    <div className="home-hamper__image"><Image src="/images/gift-packages-hero.webp" alt="Artzy-style decorative gift packages, hand-painted pieces and message cards arranged for an Indian celebration" fill sizes="(max-width: 760px) 100vw, 54vw" /><span>Artzy-style gift illustration</span></div>
    <div className="home-hamper__copy"><span>Gift hampers, thoughtfully composed</span><h2 id="home-hamper-title">More than a box.<br/><em>A story in pieces.</em></h2><p>Tell us who it is for, the moment you are celebrating and your budget. The Gift Finder begins with available studio pieces, then helps you plan wrapping, a message and personal touches.</p>
      <ol><li><b>01</b><span><strong>Choose the moment</strong>Wedding, housewarming, birthday, festival, team or client gifting.</span></li><li><b>02</b><span><strong>Build around real pieces</strong>Selections are matched from current ERP stock wherever available.</span></li><li><b>03</b><span><strong>Confirm with the studio</strong>Final contents, custom work, price and delivery time are confirmed before order.</span></li></ol>
      <div className="home-hamper__actions"><Link href="/gifts/#gift-finder">Build a gift hamper</Link><a href="https://wa.me/919158680722?text=Namaste%2C%20I%20would%20like%20help%20planning%20an%20Artzy%20gift%20hamper." target="_blank" rel="noreferrer">Ask the studio</a></div>
    </div>
  </section>;
}
