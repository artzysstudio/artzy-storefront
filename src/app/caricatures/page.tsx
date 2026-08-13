import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CaricaturePhotoBuilder from '@/components/CaricaturePhotoBuilder';

const occasions = [
  ['Personal Portraits', 'A lively portrait that celebrates personality, style and the details people remember.'],
  ['Couples & Families', 'Warm, playful compositions created from your favourite photographs and stories.'],
  ['Milestones', 'Birthdays, weddings, anniversaries, retirements and achievements made unforgettable.'],
  ['Corporate Gifts', 'Distinctive team, leadership and client gifts with thoughtful brand details.'],
];

export default function CaricaturesPage() {
  return <><Header/><main className="service-page caricature-page">
    <nav className="creative-service-tabs" aria-label="Choose digital art or caricature service"><Link href="/digital-prints/">Digital Art &amp; Prints<small>Wall art, canvas and commercial work</small></Link><span aria-current="page">Caricatures<small>Upload a photo and build a portrait</small></span></nav>
    <section className="story-hero story-hero--caricature"><img className="story-hero__image" src="/images/caricature-hero-v2.webp" alt="Three complete personalised caricature examples beside their reference photographs in an Artzy-style studio"/><div className="story-hero__shade" aria-hidden="true"/><div className="story-hero__copy"><span>Drawn from their story</span><h1>More than a portrait.<br/><em>A moment with personality.</em></h1><p>Choose the caricature type, style and occasion, then upload one clear customer photograph. Artzy&apos;s Studio will manage the creative process.</p><div className="story-hero__actions"><a className="story-hero__primary" href="#caricature-builder">Choose &amp; upload photo</a><a className="story-hero__secondary" href="#caricature-examples">See how it works</a></div><small>No AI generation · the studio creates and confirms the final artwork</small></div></section>

    <section className="caricature-explainer" id="caricature-examples">
      <div className="caricature-explainer__copy"><span className="service-eyebrow">Photo → caricature</span><h2>Still recognisably them.<br/><em>Now full of story.</em></h2><p>A caricature keeps the familiar face, pose and personality from a photograph, then adds expressive illustration, colour and meaningful details. It works beautifully when an ordinary photo needs to become a memorable, display-worthy gift.</p><div className="caricature-benefits"><p><b>Personal</b><span>Built around their face, interests and occasion.</span></p><p><b>Simple to start</b><span>Choose the details and share one clear photograph.</span></p><p><b>Studio-managed</b><span>Artzy&apos;s Studio handles the creative direction and final finish.</span></p></div></div>
      <figure className="caricature-explainer__visual"><img src="/images/caricature-photo-to-art-demo.webp" alt="Reference photograph beside a matching watercolour caricature illustration"/><div><span>Reference photograph</span><span>Finished caricature direction</span></div><figcaption>Example shown to explain the service · final artwork is managed by Artzy&apos;s Studio</figcaption></figure>
    </section>

    <CaricaturePhotoBuilder/>
    <section className="service-section"><span className="service-eyebrow">Made for every story</span><h2>Personalised beyond the face.</h2><div className="service-card-grid">{occasions.map(([title, copy], i) => <article className="service-card" key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="service-split"><div><span className="service-eyebrow">Your details matter</span><h2>Every element helps tell their story.</h2></div><div className="service-list"><p><strong>Choose the style</strong> Elegant, playful, minimal or richly detailed.</p><p><strong>Add their world</strong> Favourite objects, hobbies, profession, pets or memorable places.</p><p><strong>Select the finish</strong> Digital artwork, framed print, canvas or gifting presentation.</p></div></section>
    <section className="service-process"><span className="service-eyebrow">How final production works</span><h2>A personal gift, made simple.</h2><ol><li><strong>Share</strong><span>Send clear photos and tell us the occasion.</span></li><li><strong>Describe</strong><span>Add personality, interests and special details.</span></li><li><strong>Approve</strong><span>Review the studio composition before final finishing.</span></li><li><strong>Gift</strong><span>Receive an artwork ready for the celebration.</span></li></ol><div className="service-actions center"><Link className="service-primary" href="/contact/">Start with the Studio</Link><Link className="service-secondary" href="/shop/?category=caricatures">View Available Options</Link></div></section>
  </main><Footer/></>;
}
