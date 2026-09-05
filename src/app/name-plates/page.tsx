import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArtDirectionMark from '@/components/ArtDirectionMark';
import NamePlateBuilder from '@/features/name-plates/NamePlateBuilder';
import NamePlateInspirationButton from '@/features/name-plates/NamePlateInspirationButton';
import type { ArtDirectionId } from '@/data/artDirections';

export const metadata: Metadata = {
  title: "Custom Hand-Painted Name Plates | Artzy's Studio",
  description: "Explore Artzy-style botanical, Warli-inspired, lotus and contemporary name-plate directions, then prepare a precise studio-review request.",
  alternates: { canonical: '/name-plates/' },
};

const directions: Array<{ slug: ArtDirectionId; title: string; copy: string; sample: string; shape: string; palette: string }> = [
  { slug: 'botanical', title: 'Botanical arch', copy: 'Flowing leaves and flowers for a warm, graceful entrance.', sample: 'Aarav', shape: 'gentle-arch', palette: 'terracotta' },
  { slug: 'warli', title: 'Warli-inspired welcome', copy: 'A story-led direction with rhythmic figures and a hand-painted border.', sample: 'Meera', shape: 'classic-rectangle', palette: 'monochrome' },
  { slug: 'lotus', title: 'Lotus scallop', copy: 'A soft ceremonial silhouette with a centred lotus motif.', sample: 'Anaya', shape: 'scalloped', palette: 'terracotta' },
  { slug: 'geometric', title: 'Modern geometry', copy: 'Balanced lines and restrained pattern for contemporary homes.', sample: 'Aarohi', shape: 'classic-rectangle', palette: 'indigo' },
  { slug: 'madhubani', title: 'Madhubani-inspired garden', copy: 'Dense floral detail inspired by Indian folk-art composition.', sample: 'The Patils', shape: 'classic-rectangle', palette: 'olive' },
  { slug: 'minimal', title: 'Quiet minimal', copy: 'Clean lettering, fine borders and a small signature motif.', sample: 'Shanti', shape: 'oval', palette: 'monochrome' },
];

const entranceIdeas = [
  { image: '/images/name-plate-aarav-meera.webp', title: 'Aarav & Meera', style: 'Botanical arch', note: 'A warm floral welcome for an apartment or villa entrance.', shape: 'gentle-arch', motif: 'botanical' as ArtDirectionId, palette: 'terracotta' },
  { image: '/images/name-plate-patils-warli.webp', title: 'The Patils', style: 'Warli-inspired rectangle', note: 'A rooted, story-led direction for a traditional doorway.', shape: 'classic-rectangle', motif: 'warli' as ArtDirectionId, palette: 'monochrome' },
  { image: '/images/name-plate-anaya-lotus.webp', title: 'Anaya', style: 'Lotus scallop', note: 'A soft ceremonial shape with graceful serif lettering.', shape: 'scalloped', motif: 'lotus' as ArtDirectionId, palette: 'terracotta' },
  { image: '/images/name-plate-shanti-geometric.webp', title: 'Shanti', style: 'Modern geometric', note: 'A clean indigo-and-wood direction for a contemporary home.', shape: 'classic-rectangle', motif: 'geometric' as ArtDirectionId, palette: 'indigo' },
];

export default function NamePlatesPage() {
  return <><Header/><main className="name-plates-page">
    <section className="story-hero story-hero--name-plates">
      <Image className="story-hero__image" src="/images/name-plates-hero-v2.webp" alt="An Artzy-style Indian entrance with family and home name-plate examples" fill priority sizes="100vw"/>
      <div className="story-hero__shade" aria-hidden="true"/>
      <div className="story-hero__copy"><span>Hand-painted · personal · made for your entrance</span><h1>Let your entrance<br/><em>tell your story.</em></h1><p>Shape your family name, home name or welcome line into a considered Artzy direction, then send one precise brief for studio confirmation.</p><div className="story-hero__actions"><a className="story-hero__primary" href="#name-plate-builder">Design my name plate</a><a className="story-hero__secondary" href="#entrance-inspiration">Explore styles</a></div><strong className="plate-hero-trust">Live estimate · Optional ArtzyAI concept · Final design approved before painting</strong><small>Artzy-style illustration · Not stock or a production proof</small></div>
    </section>
    <div className="story-hero-strip"><span><b>Choose confidently</b>Placement, wording, design, material and size</span><span><b>See it update</b>Exact deterministic text and live estimate</span><span><b>Approve before making</b>Studio proof, final price and timeline</span></div>

    <section className="plate-entrance-gallery" id="entrance-inspiration" aria-labelledby="entrance-inspiration-title"><header><div><span>Imagine it at the entrance</span><h2 id="entrance-inspiration-title">Different homes.<br/><em>Different ways to say welcome.</em></h2></div><p>Compare complete entrance settings, then apply a shape, painting direction and palette directly to your builder.</p></header><div className="plate-entrance-grid">{entranceIdeas.map((idea, index) => <article key={idea.title}><figure><Image src={idea.image} alt={`${idea.title} ${idea.style} name plate shown at an Indian home entrance`} width={900} height={700} loading={index > 1 ? 'lazy' : 'eager'} sizes="(max-width: 700px) 90vw, 45vw"/><figcaption>AI entrance concept · inspiration only</figcaption></figure><div><span>0{index + 1} · {idea.style}</span><h3>{idea.title}</h3><p>{idea.note}</p><NamePlateInspirationButton shape={idea.shape} motif={idea.motif} palette={idea.palette} source={`${idea.title} · ${idea.style}`}>Start with this direction <b>→</b></NamePlateInspirationButton></div></article>)}</div><aside><div><strong>Need a different name, script or motif?</strong><small>Use the guided builder, then optionally generate a clearly labelled ArtzyAI concept for studio review.</small></div><a href="#name-plate-builder">Design my name plate</a><a href="https://wa.me/919158680722?text=Hello%20Artzy%27s%20Studio%2C%20I%20need%20help%20choosing%20a%20name%20plate%20direction." target="_blank" rel="noreferrer">Ask the studio</a></aside></section>

    <section className="plate-directions" id="plate-directions"><header><span>Design directions</span><h2>A starting point for<br/><em>your own welcome.</em></h2><p>These examples demonstrate visual direction—not ready-stock products or claims of traditional provenance.</p></header><div className="plate-direction-grid">{directions.map((direction, index) => <article key={direction.slug}><div className={`sample-plate sample-plate--${direction.slug}`} aria-hidden="true"><ArtDirectionMark direction={direction.slug} frame/><span className="sample-plate__copy"><b>{direction.sample}</b><small>WELCOME HOME</small></span></div><span>0{index + 1}</span><h3>{direction.title}</h3><p>{direction.copy}</p><NamePlateInspirationButton shape={direction.shape} motif={direction.slug} palette={direction.palette} source={direction.title}>Use this direction <b>→</b></NamePlateInspirationButton></article>)}</div></section>

    <NamePlateBuilder/>

    <section className="plate-before-order" id="plate-before-order"><header><span>Before the studio confirms</span><h2>Three small checks prevent<br/><em>an unsatisfying result.</em></h2><p>These details help the studio recommend the right proportion, base and fitting.</p></header><div><article><b>01</b><h3>Measure the available area</h3><p>Leave space for the handle, bell, door frame and opening movement.</p></article><article><b>02</b><h3>Take one straight photograph</h3><p>Stand directly in front in natural light and include the complete door or wall.</p></article><article><b>03</b><h3>Describe weather exposure</h3><p>Direct rain, harsh sun and an indoor corridor require different decisions.</p></article></div><aside><strong>Approved before making</strong><span>Exact spelling</span><span>Artwork direction</span><span>Dimensions and material</span><span>Mounting method</span><span>Final price and timeline</span></aside></section>

    <section className="plate-process"><div><span>What happens next</span><h2>Designed with you.<br/>Painted by the studio.</h2></div><ol><li><b>01</b><span><strong>Request</strong>Your saved builder configuration reaches the studio.</span></li><li><b>02</b><span><strong>Studio confirmation</strong>Material, dimensions, artwork, price and lead time are agreed.</span></li><li><b>03</b><span><strong>Proof approval</strong>You check exact spelling and approve the final direction.</span></li><li><b>04</b><span><strong>Making and delivery</strong>The finished plate is packed and dispatched with care.</span></li></ol><Link href="/contact?interest=name-plate">Need help? Talk to the studio →</Link></section>
  </main><Footer/></>;
}
