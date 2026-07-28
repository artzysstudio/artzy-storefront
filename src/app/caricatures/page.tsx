import Link from 'next/link';

const occasions = [
  ['Personal Portraits', 'A lively portrait that celebrates personality, style and the details people remember.'],
  ['Couples & Families', 'Warm, playful compositions created from your favourite photographs and stories.'],
  ['Milestones', 'Birthdays, weddings, anniversaries, retirements and achievements made unforgettable.'],
  ['Corporate Gifts', 'Distinctive team, leadership and client gifts with thoughtful brand details.'],
];

export default function CaricaturesPage() {
  return <main className="service-page caricature-page">
    <section className="service-hero caricature-hero">
      <div className="service-hero-copy"><span className="service-eyebrow">Drawn from their story</span><h1>More than a portrait. <em>A moment with personality.</em></h1><p>Artzy&apos;s Studio turns photographs, memories and inside stories into expressive custom caricatures—created for people, milestones and gifts that deserve to feel personal.</p><div className="service-actions"><Link className="service-primary" href="/shop/?category=caricatures">Shop Caricatures</Link><Link className="service-secondary" href="/contact/">Create a Caricature</Link></div></div>
      <div className="service-art-panel"><span>PEOPLE</span><strong>Recognisable, expressive and full of character.</strong><span>STORIES</span><strong>Hobbies, professions and meaningful details included.</strong><span>GIFTS</span><strong>Made to surprise, delight and be remembered.</strong></div>
    </section>
    <section className="service-section"><span className="service-eyebrow">Made for every story</span><h2>Personalised beyond the face.</h2><div className="service-card-grid">{occasions.map(([title, copy], i) => <article className="service-card" key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="service-split"><div><span className="service-eyebrow">Your details matter</span><h2>Every element helps tell their story.</h2></div><div className="service-list"><p><strong>Choose the style</strong> Elegant, playful, minimal or richly detailed.</p><p><strong>Add their world</strong> Favourite objects, hobbies, profession, pets or memorable places.</p><p><strong>Select the finish</strong> Digital artwork, framed print, canvas or gifting presentation.</p></div></section>
    <section className="service-process"><span className="service-eyebrow">How it works</span><h2>A personal gift, made simple.</h2><ol><li><strong>Share</strong><span>Send clear photos and tell us the occasion.</span></li><li><strong>Describe</strong><span>Add personality, interests and special details.</span></li><li><strong>Approve</strong><span>Review the composition before final finishing.</span></li><li><strong>Gift</strong><span>Receive an artwork ready for the celebration.</span></li></ol><div className="service-actions center"><Link className="service-primary" href="/contact/">Start a Caricature</Link><Link className="service-secondary" href="/shop/?category=caricatures">View Options</Link></div></section>
  </main>;
}
