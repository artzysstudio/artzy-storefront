import PremiumHero from '@/components/PremiumHero';
import StudioSignature from '@/components/StudioSignature';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ProductCard';
import ArtzyMuse from '@/components/muse/ArtzyMuse';
import { isStorefrontInventoryProduct, type Product } from '@/lib/api';
import erpProductSnapshot from '@/data/erp-products.json';
import Link from 'next/link';
import HomeDiscovery from '@/components/HomeDiscovery';
import HomeGiftHamper from '@/components/HomeGiftHamper';
import CustomerStories from '@/components/CustomerStories';

const ARTZY_AI_ENABLED = false;

const freshStudioPriorities = [
  'Handpainted Wooden Mirror Frame',
  'Handpainted Wooden Medium Size Sarswati Frame',
  'Handpainted Candle Tealight Holder Set Of 2',
  'Bamboo Pen Stand',
  'Cozy Tea Time Essentials',
  'Hand-painted Spoon Stand of 3',
  'Hand-painted Wooden Key Holder Cabinet',
  'Wooden Hand-painted Warli design Round wall hager',
];

function getFreshERPProducts(): Product[] {
  const available = (erpProductSnapshot as Product[]).filter(isStorefrontInventoryProduct);
  const chosen: Product[] = [];
  for (const name of freshStudioPriorities) {
    const match = available.find((product) => product.name === name && !chosen.some((item) => item.id === product.id));
    if (match) chosen.push(match);
  }
  for (const product of available) {
    if (chosen.length >= 8) break;
    if (!chosen.some((item) => item.id === product.id)) chosen.push(product);
  }
  return chosen.slice(0, 8);
}

export default async function Home() {
  const products = getFreshERPProducts();

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
          <div className="product-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {products.length === 0 && <div className="home-products-unavailable" role="status">
            <h3>The next studio pieces are being prepared.</h3>
            <p>Current availability will appear here as soon as the live studio catalogue reconnects. For a specific piece, please ask the studio directly.</p>
            <a href="https://wa.me/919158680722">Ask the studio on WhatsApp →</a>
          </div>}
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
