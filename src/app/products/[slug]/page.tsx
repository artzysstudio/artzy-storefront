import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductPageClient from '@/components/ProductPageClient';
import erpProducts from '@/data/erp-products.json';
import { findProductBySlug, productPath, productSlug, storefrontCategoryLabel } from '@/lib/product-routing';
import { isStorefrontInventoryProduct, normalizeStorefrontProduct, type Product } from '@/lib/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.artzysstudio.in';
const products = (erpProducts as Product[]).map(normalizeStorefrontProduct).filter(isStorefrontInventoryProduct);

function productMetadata(product: Product) {
  const baseTitle = product.seo?.title || product.name;
  const duplicateTitle = products.some(
    (candidate) => candidate.id !== product.id && (candidate.seo?.title || candidate.name) === baseTitle,
  );
  const sourceDescription = (
    product.seo?.description
    || product.artworkStory
    || `${product.name}, created by Deepti J. Shah and Artzy's Studio.`
  ).replace(/\s+/g, ' ').trim();
  const excerpt = sourceDescription.length > 135
    ? `${sourceDescription.slice(0, 132).trimEnd()}…`
    : sourceDescription;

  return {
    title: duplicateTitle ? `${baseTitle} · ${product.sku}` : baseTitle,
    description: `${excerpt} SKU ${product.sku}.`,
  };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: productSlug(product) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = findProductBySlug(products, (await params).slug);
  if (!product) return { title: 'Product not found', robots: { index: false, follow: false } };
  const { title, description } = productMetadata(product);
  const canonical = productPath(product);
  const image = product.socialSharingImage || product.images[0];
  return {
    title,
    description,
    keywords: product.seo?.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      siteName: "Artzy's Studio",
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = findProductBySlug(products, (await params).slug);
  if (!product) notFound();
  const canonical = new URL(productPath(product), siteUrl).href;
  const categoryQuery = product.category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const { description } = productMetadata(product);
  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${canonical}#product`,
    name: product.name,
    description,
    image: product.images,
    sku: product.sku,
    brand: { '@type': 'Brand', name: "Artzy's Studio" },
    offers: {
      '@type': 'Offer',
      url: canonical,
      priceCurrency: 'INR',
      price,
      availability: product.availability === 'out_of_stock' || product.isSoldOut
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${siteUrl}/shop/` },
      { '@type': 'ListItem', position: 3, name: storefrontCategoryLabel(product.category), item: `${siteUrl}/shop/?category=${categoryQuery}` },
      { '@type': 'ListItem', position: 4, name: product.name, item: canonical },
    ],
  };

  return <>
    <Header />
    <main className="product-page">
      <nav className="product-breadcrumbs container" aria-label="Breadcrumb">
        <a href="/">Home</a><span aria-hidden="true">/</span><a href="/shop/">Shop</a><span aria-hidden="true">/</span><span>{storefrontCategoryLabel(product.category)}</span>
      </nav>
      <ProductPageClient initialProduct={product} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, '\\u003c') }} />
    </main>
    <Footer />
  </>;
}
