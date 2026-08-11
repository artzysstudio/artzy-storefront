import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NamePlateBuilder from '@/features/name-plates/NamePlateBuilder';
import ArtDirectionMark from '@/components/ArtDirectionMark';
import type { ArtDirectionId } from '@/data/artDirections';

export const metadata: Metadata = {
  title: "Custom Hand-Painted Name Plates | Artzy's Studio",
  description: "Explore Artzy-style botanical, Warli, lotus and contemporary name plate directions, then build a personalised enquiry for Deepti's Pune studio.",
};

const directions: Array<[ArtDirectionId, string, string, string]> = [
  ['botanical','Botanical arch','Flowing leaves and flowers for a warm, graceful entrance.','Aarav'],
  ['warli','Warli welcome','Story-led folk figures with a rhythmic hand-painted border.','Meera'],
  ['lotus','Lotus scallop','A soft ceremonial silhouette with a centred lotus motif.','Anaya'],
  ['geometric','Modern geometry','Balanced lines and restrained pattern for contemporary homes.','Aarohi'],
  ['madhubani','Madhubani garden','Dense floral detail inspired by Indian folk-art composition.','The Patils'],
  ['minimal','Quiet minimal','Clean lettering, fine borders and a small signature motif.','Shanti'],
];

export default function NamePlatesPage() {
  return <><Header/><main className="name-plates-page">
    <section className="story-hero story-hero--name-plates"><img className="story-hero__image" src="/images/name-plates-hero-v2.webp" alt="A complete Artzy-style Indian entrance with The Shah Family wall name plate and Aarav, Meera and Anaya standing name plate examples"/><div className="story-hero__shade" aria-hidden="true"/><div className="story-hero__copy"><span>Hand-painted · personal · made for your door</span><h1>Let your entrance<br/><em>tell your story.</em></h1><p>Begin with your family name, home name or welcome line. Choose an Artzy direction and shape it with the studio into a name plate that feels genuinely yours.</p><div className="story-hero__actions"><a className="story-hero__primary" href="#name-plate-builder">Build your name plate</a><a className="story-hero__secondary" href="#plate-directions">See design directions</a></div><small>Artzy-style illustration · Final design, material, price and timeline confirmed by the studio</small></div></section>
    <div className="story-hero-strip"><span><b>Choose a direction</b>Shape, motif and colour mood</span><span><b>Enter your wording</b>English or your preferred Indian script</span><span><b>Approve before making</b>Spelling, drawing, price and delivery</span></div>

    <section className="plate-directions" id="plate-directions"><header><span>Design directions</span><h2>A starting point for<br/><em>your own welcome.</em></h2><p>These named examples demonstrate shape and painting style—they are not ready-stock products. Choose a direction, then use the builder to see its design and estimated price.</p></header><div className="plate-direction-grid">{directions.map(([slug,title,copy,sampleName], index) => <article key={slug}><div className={`sample-plate sample-plate--${slug}`} aria-hidden="true"><ArtDirectionMark direction={slug} frame/><b>{sampleName}</b><small>WELCOME HOME</small></div><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><a href="#name-plate-builder">Use this direction <b>→</b></a></article>)}</div></section>

    <NamePlateBuilder/>

    <section className="plate-process"><div><span>What happens next</span><h2>Designed with you.<br/>Painted by the studio.</h2></div><ol><li><b>01</b><span><strong>Enquiry</strong>Send your builder brief, doorway photo and required date.</span></li><li><b>02</b><span><strong>Studio confirmation</strong>Material, dimensions, artwork, price and lead time are agreed.</span></li><li><b>03</b><span><strong>Design approval</strong>Check spelling and approve the final direction before painting.</span></li><li><b>04</b><span><strong>Making &amp; delivery</strong>Your name plate is hand-finished, packed and dispatched with care.</span></li></ol><div className="plate-ar-later"><span aria-hidden="true">⌑</span><div><strong>AR placement preview · planned for later</strong><small>The current builder is a design-direction preview. It does not use your camera or represent exact wall scale yet.</small></div></div><Link href="/contact?interest=name-plate">Need help? Talk to the studio →</Link></section>
  </main><Footer/></>;
}
