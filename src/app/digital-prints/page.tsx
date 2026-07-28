import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const styles = [
  ['Modern Art', 'Clean, expressive compositions created around your palette and space.'],
  ['Abstract', 'Layered colour, movement and mood translated into a statement artwork.'],
  ['Geometric', 'Structured forms and contemporary balance for modern interiors.'],
  ['Bespoke Concepts', 'Original visual directions developed from your story, brief or brand.'],
];

export default function DigitalPrintsPage() {
  return <>
    <Header />
    <main className="service-page">
    <section className="service-hero digital-hero">
      <div className="service-hero-copy"><span className="service-eyebrow">Made for your space</span><h1>Digital art, thoughtfully <em>made yours.</em></h1><p>From modern and abstract compositions to geometric designs, Deepti creates customised artwork that belongs naturally in your home, office or corporate environment.</p><div className="service-actions"><Link className="service-primary" href="/shop/?category=digital-prints">Shop Digital Prints</Link><Link className="service-secondary" href="/contact/">Request a Custom Design</Link></div></div>
      <div className="service-art-panel"><span>HOME DECOR</span><strong>Colour that completes the room.</strong><span>WORKSPACES</span><strong>Art that reflects your ambition.</strong><span>CORPORATE</span><strong>Creative visual stories for your brand.</strong></div>
    </section>

    <section className="example-gallery">
      <div className="gallery-heading"><div><span className="service-eyebrow">Explore the possibilities</span><h2>See what your custom print could become.</h2></div><span className="swipe-hint">Swipe to explore →</span></div>
      <div className="example-track">
        <article className="example-slide"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgMbRhfNPN2xkriSR1ZhA72LPDDWduQ8UwwVqrs1UwR-llRtelpAB0VkFHlt1JWfBMrquTocwRdo5KFTxrYae9tijWKGyaa5OZ50t3vbgtAfM5UKxO2gquvqhlpVCYlTJA9t5AKYSUZarH7GWl63OeodhE4m2bMsPe__huU0P310UKHxaw-dvnMOdJ-J3ZlIZOvjgjIH7G2WfIQREsuok5bVPC6NAhmnub4jodW2oMUnNf7jCzQie8qTZ1SwRJnFHp6xl-AJzDB8o" alt="Modern Statement digital print example" loading="lazy" /><div><span>Living room focal art</span><h3>Modern Statement</h3></div></article>
        <article className="example-slide"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuARR7gHoLXyGOMMX1Ydja5udxpR7o1iVi9YD5gFNACEl3oxqhLFzGzqLg2ZtWXhRnFEG1ZPIIOzPHkNBEZt6Sig78T5Cn60ZAjDMGz5m-8yzuV5hl7ZcvxB18PdKmVN0pJcpF2xZTzOBu1m3p9kgV-H7kDGGQ1hjmG_jkqejNhQMtm1ChAlS-RlGmSPgNoJdX0snCIO8I1lujI7e8SrhqqRShlylGzFzaPM1I57clmHdZ-IXbdcQXYTz5RDJa8d_L0-lyXJSsiw-4M" alt="Abstract Harmony digital print example" loading="lazy" /><div><span>Colour-led home décor</span><h3>Abstract Harmony</h3></div></article>
        <article className="example-slide"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9RZrNj3Q3j1XeSPBo9oy-vicmTiHHnlDBBHRjfszgiDNw70TBuvPEZAuAX-LjKmrgvKgpFJ_bJ7FDs0JYpzMJO3BBI-e35tY-DYvH0xiSAN40_N5CR_mTGqDgPhdFruIsjGLGlUPxm609AE_FypdSaq2X2XP9qkGS-BpWu4y-Wc3Y-xcAUipRtkJ7Lm357hnN1nx3-rCykbxM8X1jqgOLXSo_AA6D3berqSu_nh1WF9cGlnemhyxLCxR_4hSO6tIrQ2tHgwO7F_U" alt="Geometric Rhythm digital print example" loading="lazy" /><div><span>Contemporary office décor</span><h3>Geometric Rhythm</h3></div></article>
        <article className="example-slide"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh-lhyft-ELwAroQ-Nlu99XRvaIONhDljdYsHkMh1hdYbnEKPBqg3Njas3eEKAOeUHDTJqtdw9GVEy214yyCpOuVrX5FoHURy0Wb6NKGJLJ49-1UrxscZoPwY8QqMxJQj5T-8IgPHqfTccMwZDeYQy3kxRlX_rCV2NK4ep0k99mTqfH4b8jlWgYLSC7EYIybcMY-fgpOJw98KTIK44qVzqeCXglYwrAerLi7Vr9mRKxg00wE0OZl5hPikBhYtJmZ-vUsWQJ81b3fU" alt="Bespoke Brand Story digital print example" loading="lazy" /><div><span>Corporate and hospitality art</span><h3>Bespoke Brand Story</h3></div></article>
      </div>
    </section>
    <section className="service-section"><span className="service-eyebrow">What we can create</span><h2>One idea. Many artistic possibilities.</h2><div className="service-card-grid">{styles.map(([title, copy], i) => <article className="service-card" key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="service-split"><div><span className="service-eyebrow">Designed around you</span><h2>Your wall, palette and purpose lead the artwork.</h2></div><div className="service-list"><p><strong>For homes</strong> Living rooms, bedrooms, entrances and styled corners.</p><p><strong>For work</strong> Receptions, cabins, meeting rooms, cafés and hospitality spaces.</p><p><strong>For brands</strong> Bespoke colours, themes, sizes and multi-piece collections.</p></div></section>
    <section className="service-process"><span className="service-eyebrow">Simple custom workflow</span><h2>From your brief to a finished canvas.</h2><ol><li><strong>Share</strong><span>Your wall photo, size, colours and inspiration.</span></li><li><strong>Imagine</strong><span>Preview the direction with ArtzyAI.</span></li><li><strong>Create</strong><span>We develop and refine your artwork.</span></li><li><strong>Deliver</strong><span>Your print arrives ready for its new space.</span></li></ol><div className="service-actions center"><a className="service-primary" href="https://artzyai.artzysstudio.in/" target="_blank" rel="noreferrer">Try ArtzyAI</a><Link className="service-secondary" href="/contact/">Start Your Project</Link></div></section>
    </main>
    <Footer />
  </>;
}
