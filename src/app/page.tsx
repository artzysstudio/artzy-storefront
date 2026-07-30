import PremiumHero from '@/components/PremiumHero';
import CategoryExperience from '@/components/CategoryExperience';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ProductCard';
import ArtzyMuse from '@/components/muse/ArtzyMuse';
import { api } from '@/lib/api';
import Link from 'next/link';

const ARTZY_AI_ENABLED = false;

export default async function Home() {
  const products = await api.products.list();

  return (
    <>
      <Header />
      <main>
        <PremiumHero />
        <CategoryExperience />

        <section className="section container" aria-labelledby="fresh-from-studio">
          <div className="home-section-heading">
            <div>
              <h4>Fresh from the studio</h4>
              <h2 id="fresh-from-studio">Pieces with a pulse</h2>
            </div>
            <Link href="/shop">View all artwork →</Link>
          </div>
          <div className="product-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

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
