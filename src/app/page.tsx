import type { Metadata } from 'next';
import PremiumHero from '@/components/PremiumHero';
import StudioSignature from '@/components/StudioSignature';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArtzyMuse from '@/components/muse/ArtzyMuse';
import Link from 'next/link';
import HomeDiscovery from '@/components/HomeDiscovery';
import HomeGiftHamper from '@/components/HomeGiftHamper';
import CustomerStories from '@/components/CustomerStories';
import FreshStudioProducts from '@/components/FreshStudioProducts';

const ARTZY_AI_ENABLED = false;

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function Home() {
  return (
    <>
      <Header />
      <main>
        <PremiumHero imageUrl="/images/homepage-handmade-hero.webp" />
        <HomeDiscovery />

        <section className="section container" aria-labelledby="fresh-from-studio">
          <div className="home-section-heading">
            <div>
              <h4>Fresh from the studio</h4>
              <h2 id="fresh-from-studio">Pieces with a pulse</h2>
              <p className="home-section-source">Available now from the studio</p>
            </div>
            <Link href="/shop">View all artwork →</Link>
          </div>
          <FreshStudioProducts />
        </section>

        <HomeGiftHamper />

        <CustomerStories />

        <section className="home-artist" aria-labelledby="meet-deepti-home">
          <img src="/images/deepti_portrait.jpg" alt="Artist Deepti J. Shah" loading="lazy" />
          <div>
            <span>Meet the artist</span>
            <h2 id="meet-deepti-home">Creativity that communicates beyond words.</h2>
            <p>Every Artzy creation begins with Deepti&apos;s eye for colour, emotion and everyday beauty. Her journey as a deaf visual artist has shaped a studio where creativity communicates beyond words.</p>
            <Link href="/about/">Meet Deepti and the studio <span aria-hidden="true">→</span></Link>
          </div>
        </section>

        <StudioSignature />

        {ARTZY_AI_ENABLED && <section className="section container home-muse">
          <ArtzyMuse content={{
            title: 'Imagine it in your space.',
            subtitle: 'ArtzyAI',
            body: 'Upload a room photo and explore how a selected piece could feel on your wall, table or desk.',
            ctaText: 'Try ArtzyAI',
            ctaLink: '/shop'
          }} />
        </section>}
      </main>
      <Footer />
    </>
  );
}
