import Image from 'next/image';
import Link from 'next/link';

const paths = [
  { title: 'Shop studio pieces', copy: 'Browse real, available hand-painted décor, useful art and gifts from the studio.', href: '/shop/', image: '/images/homepage-handmade-hero.webp', label: 'Ready to shop' },
  { title: 'Gifts & hampers', copy: 'Choose by person, occasion and budget, or build a thoughtful Artzy hamper.', href: '/gifts/', image: '/images/gift-packages-hero.webp', label: 'For someone special', featured: true },
  { title: 'Original art', copy: 'Discover original paintings and artist-led wall pieces for home and workspaces.', href: '/original-art/', image: '/assets/painting_1.png', label: 'One-of-one work' },
  { title: 'Name plates', copy: 'Explore Indian motifs, shapes and finishes, then prepare your own name-plate brief.', href: '/name-plates/', image: '/images/name-plates-hero-v2.webp', label: 'Make an entrance' },
  { title: 'Digital art & prints', copy: 'Plan modern, floral, geometric or Indian-inspired artwork for a particular space.', href: '/digital-prints/', image: '/images/digital-hero-v3.webp', label: 'Created for your brief' },
  { title: 'Caricatures', copy: 'Turn a favourite photograph into a personal portrait for gifting or celebration.', href: '/caricatures/', image: '/images/caricature-hero-v2.webp', label: 'From photo to character' },
  { title: 'For business', copy: 'Plan corporate gifts, commercial artwork and thoughtful pieces for teams or clients.', href: '/for-business/', image: '/images/business-hero-v2.webp', label: 'Projects & quantities' },
  { title: 'Artzy World', copy: 'Understand the studio journey and preview selected wall art in a room before enquiring.', href: '/artzy-world/', image: '/images/artzy-world-hero-v2.webp', label: 'Discover & preview' },
  { title: 'Meet Deepti', copy: 'Know the artist, the team and the human story behind Artzy’s Studio in Pune.', href: '/about/', image: '/images/deepti_portrait.jpg', label: 'Our studio story' },
];

export default function HomeDiscovery() {
  return <section id="shop-by-category" className="home-discovery" aria-labelledby="home-discovery-title">
    <header className="home-discovery__heading"><div><span>Choose what interests you</span><h2 id="home-discovery-title">Find your way into the studio.</h2></div><p>Shop something ready, make it personal, plan a gift or begin with an idea. Every path tells you clearly what happens next.</p></header>
    <div className="home-discovery__grid">
      {paths.map((path) => <Link className={`home-path${path.featured ? ' home-path--featured' : ''}`} href={path.href} key={path.title}>
        <div className="home-path__image"><Image src={path.image} alt="" fill sizes={path.featured ? '(max-width: 720px) 88vw, 44vw' : '(max-width: 720px) 72vw, 24vw'} /></div>
        <div className="home-path__copy"><small>{path.label}</small><h3>{path.title}</h3><p>{path.copy}</p><span>Explore <b aria-hidden="true">→</b></span></div>
      </Link>)}
    </div>
    <p className="home-discovery__hint">Swipe to explore more studio paths on mobile.</p>
  </section>;
}
