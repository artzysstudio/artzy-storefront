import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { api, PageSection } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const pageData = await api.pages.get(slug);
    if (!pageData) return { title: 'Page Not Found | Artzy\'s Studio' };
    return {
      title: pageData.seoMetadata?.title || `${pageData.title} | Artzy's Studio`,
      description: pageData.seoMetadata?.description,
      keywords: pageData.seoMetadata?.keywords,
      alternates: { canonical: `/${slug}/` },
      openGraph: {
        title: pageData.seoMetadata?.title || `${pageData.title} | Artzy's Studio`,
        description: pageData.seoMetadata?.description,
      }
    };
  } catch (e) {
    return { title: 'Page Not Found | Artzy\'s Studio' };
  }
}

export function generateStaticParams() {
  return [
    { slug: 'shipping-policy' },
    { slug: 'privacy-policy' },
    { slug: 'terms-and-conditions' },
    { slug: 'returns-policy' },
    { slug: 'customised-product-policy' },
    { slug: 'cancellation-policy' },
    { slug: 'ai-concept-disclosure' }
  ];
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageDef = await api.pages.get(slug);
  
  if (!pageDef) {
    return notFound();
  }

  // Simplified section renderer for dynamic text/marketing pages
  const renderSection = (section: PageSection) => {
    if (!section.isEnabled) return null;

    const { content, themeVariant, backgroundStyle } = section;
    const bgClass = backgroundStyle === 'solid' ? `bg-${themeVariant}` : '';

    switch (section.type) {
      case 'standard_text':
      case 'hero':
        const policyItems = Array.isArray(content.items)
          ? content.items as Array<{ heading?: string; paragraphs?: string[]; bullets?: string[] }>
          : [];
        return (
          <section key={section.id} className={`section container policy-page ${bgClass}`}>
            <header className="policy-page__header">
              <span>Customer information · Artzy&apos;s Studio</span>
              <h1>{content.title}</h1>
              {content.subtitle && <h4>{content.subtitle}</h4>}
              {content.body && <p>{content.body}</p>}
            </header>
            {policyItems.length > 0 && <div className="policy-page__content">
              {policyItems.map((item, index) => <article key={`${item.heading}-${index}`}>
                <h2>{item.heading}</h2>
                {item.paragraphs?.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                {item.bullets && <ul>{item.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}</ul>}
              </article>)}
            </div>}
          </section>
        );
      
      // We can easily expand this to handle galleries, contact forms, etc.
      
      default:
        return (
          <section key={section.id} className={`section container ${bgClass}`} style={{ textAlign: 'center' }}>
            <h2>{content.title}</h2>
            <p>{content.body}</p>
          </section>
        );
    }
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: '60vh', paddingTop: 'var(--spacing-xl)' }}>
        {pageDef.sections
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((section) => renderSection(section))}
      </main>
      <Footer />
    </>
  );
}
