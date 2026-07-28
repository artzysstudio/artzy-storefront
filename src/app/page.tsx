import CategoryExperience from '@/components/CategoryExperience';
import Header from '@/components/layout/Header';
          <CategoryExperience />
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ProductCard';
import ArtzyMuse from '@/components/muse/ArtzyMuse';
import { api, PageSection } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Home() {
  try {
    const pageDef = await api.pages.get('home');
    if (!pageDef) return notFound();

    // Fetching related entities for specific sections
    const products = await api.products.list();
    const giftCollections = await api.collections.listGifts();
    const testimonials = await api.testimonials.list();
    const instagramFeed = await api.instagram.listFeed();

    // Section renderer now heavily relies on the PageSection payload from ERP
    const renderSection = (section: PageSection) => {
      if (!section.isEnabled) return null;

      const { content, themeVariant, backgroundStyle } = section;
      // We can map themeVariants to CSS variables or classes, e.g., bg-sand, text-light etc.
      const bgClass = backgroundStyle === 'solid' ? `bg-${themeVariant}` : '';

      switch (section.type) {
        case 'hero':
          return (
            <section key={section.id} className={`section container ${bgClass}`} style={{ paddingTop: 'var(--spacing-md)' }}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>{content.title}</h1>
                <p style={{ margin: '0 auto' }}>{content.subtitle}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-md)' }}>
                {giftCollections.map((collection) => (
                  <div key={collection.id} style={{ textAlign: 'center' }}>
                    <div style={{ aspectRatio: '4/5', marginBottom: 'var(--spacing-sm)' }}>
                      <img src="/images/deepti_gifting.png" alt={collection.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h3>{collection.name}</h3>
                    <Link href={`/shop/${collection.id}`} style={{ borderBottom: '1px solid var(--text-main)' }}>Shop Now</Link>
                  </div>
                ))}
              </div>
            </section>
          );

        case 'featured_artworks':
          return (
            <section key={section.id} className={`section container ${bgClass}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-lg)' }}>
                <div>
                  <h4>{content.subtitle}</h4>
                  <h2>{content.title}</h2>
                </div>
                {content.ctaText && (
                  <Link href={content.ctaLink || '#'} style={{ borderBottom: '1px solid var(--text-main)', paddingBottom: '0.2rem' }}>
                    {content.ctaText}
                  </Link>
                )}
              </div>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );

        case 'meet_artist':
          return (
            <section key={section.id} className={`section container ${bgClass}`}>
              <div className="artisan-section">
                <div>
                  <img src="/images/deepti_portrait.png" alt="Artist Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '4/5' }} />
                </div>
                <div className="artisan-text">
                  <h4>{content.subtitle}</h4>
                  <h2>{content.title}</h2>
                  <p>{content.body}</p>
                  <br/>
                  {content.ctaText && (
                    <Link href={content.ctaLink || '#'} className="btn btn-solid">{content.ctaText}</Link>
                  )}
                </div>
              </div>
            </section>
          );

        case 'studio_process':
          return (
            <section key={section.id} className={`section ${bgClass}`} style={{ backgroundColor: backgroundStyle === 'solid' ? 'var(--bg-secondary)' : 'transparent' }}>
              <div className="container" style={{ textAlign: 'center' }}>
                <h2 style={{ marginBottom: 'var(--spacing-md)' }}>{content.title}</h2>
                <p style={{ margin: '0 auto var(--spacing-lg)' }}>{content.body}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <img src="/images/deepti_painting.png" alt="Process Shot 1" style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1' }} />
                  <img src="/images/deepti_painting.png" alt="Process Shot 2" style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1' }} />
                  <img src="/images/deepti_painting.png" alt="Process Shot 3" style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1' }} />
                </div>
              </div>
            </section>
          );

        case 'custom_journey':
          return (
            <section key={section.id} className={`section container ${bgClass}`}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h2>{content.title}</h2>
                <p style={{ margin: '0 auto' }}>{content.body}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-lg)', textAlign: 'center' }}>
                <div>
                  <h3 style={{ marginBottom: '1rem' }}>1. Consultation</h3>
                  <p>We discuss your vision, space, and color preferences.</p>
                </div>
                <div>
                  <h3 style={{ marginBottom: '1rem' }}>2. Creation</h3>
                  <p>I begin the process, sharing updates from the studio.</p>
                </div>
                <div>
                  <h3 style={{ marginBottom: '1rem' }}>3. Delivery</h3>
                  <p>Your custom artwork is carefully packaged and shipped.</p>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
                {content.ctaText && (
                  <Link href={content.ctaLink || '#'} className="btn btn-solid">{content.ctaText}</Link>
                )}
              </div>
            </section>
          );

        case 'corporate_gifting':
          return (
            <section key={section.id} className={`section container ${bgClass}`}>
              <div className="artisan-section">
                <div className="artisan-text">
                  <h4>{content.subtitle}</h4>
                  <h2>{content.title}</h2>
                  <p>{content.body}</p>
                  <br/>
                  {content.ctaText && (
                    <Link href={content.ctaLink || '#'} className="btn btn-solid">{content.ctaText}</Link>
                  )}
                </div>
                <div>
                  <img src="/images/deepti_gifting.png" alt="Corporate Gifting" style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '4/5' }} />
                </div>
              </div>
            </section>
          );

        case 'testimonials':
          return (
            <section key={section.id} className={`section ${bgClass}`} style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>{content.title}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
                  {testimonials.map((test) => (
                    <div key={test.id} style={{ background: 'var(--bg-color)', padding: '2rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <p style={{ color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '1rem' }}>"{test.text}"</p>
                      <p style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>— {test.author}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 'var(--spacing-lg)' }}>
                  <p style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', marginBottom: 'var(--spacing-md)' }}>Trusted By &amp; Featured In</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                    <img src="/images/deepti_portrait.png" alt="Client Logo" style={{ width: '120px', minHeight: '60px', height: '60px', objectFit: 'cover' }} />
                    <img src="/images/deepti_gifting.png" alt="Press Logo" style={{ width: '120px', minHeight: '60px', height: '60px', objectFit: 'cover' }} />
                    <img src="/images/deepti_painting.png" alt="Google Reviews" style={{ width: '120px', minHeight: '60px', height: '60px', objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            </section>
          );

        case 'instagram':
          return (
            <section key={section.id} className={`section container ${bgClass}`}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
                <h4>{content.subtitle}</h4>
                <h2>{content.title}</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {instagramFeed.map((post) => (
                  <img key={post.id} src="/images/deepti_painting.png" alt="Instagram Post" style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1' }} />
                ))}
              </div>
            </section>
          );

        case 'muse_ai':
          return (
            <section key={section.id} className={`section container ${bgClass}`} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <ArtzyMuse content={content} />
            </section>
          );

        default:
          return null;
      }
    };

    return (
      <>
        <Header />
        <main>
          {pageDef.sections
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((section) => renderSection(section))}
        </main>
        <Footer />
      </>
    );
  } catch (error: any) {
    return (
      <div style={{ padding: '40px', background: '#fff', color: '#000', fontFamily: 'monospace' }}>
        <h1>Diagnostic Error Page</h1>
        <p><strong>Error Message:</strong> {error.message}</p>
        <p><strong>Stack Trace:</strong></p>
        <pre>{error.stack}</pre>
        <p><strong>Stringified Error:</strong> {JSON.stringify(error, Object.getOwnPropertyNames(error))}</p>
      </div>
    );
  }
}
