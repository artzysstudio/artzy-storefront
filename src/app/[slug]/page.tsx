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
    { slug: 'terms-and-conditions' }
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
        return (
          <section key={section.id} className={`section container ${bgClass}`} style={{ textAlign: 'center' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h1 style={{ marginBottom: 'var(--spacing-md)' }}>{content.title}</h1>
              {content.subtitle && <h4>{content.subtitle}</h4>}
              {content.body && <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{content.body}</p>}
            </div>
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
