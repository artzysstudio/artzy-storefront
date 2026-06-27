# Artzy's Studio ERP API Contracts

This document outlines the JSON interfaces the Next.js frontend expects from `erp.artzysstudio.in`.

## 1. Product (PIM Schema)
**Endpoint:** `GET /api/products` and `GET /api/products/:id`

```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;           // Primary thumbnail (legacy)
  images?: string[];       // Gallery (WebP optimized)
  videoUrl?: string;
  isSoldOut?: boolean;
  
  // PIM / Discovery Fields
  artworkStory?: string;
  artistNotes?: string;
  medium?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  colorPalette?: string[];
  style?: string[];        // e.g. ["Abstract", "Contemporary"]
  occasion?: string[];     // e.g. ["Wedding", "Housewarming"]
  roomType?: string[];     // e.g. ["Living Room", "Office"]
  
  // Logistics & Care
  personalizationOptions?: string[];
  giftWrappingAvailable?: boolean;
  careInstructions?: string;
  availability?: string;
  leadTime?: string;
  
  // Relations & Meta
  relatedProducts?: string[];
  recommendedPairings?: string[];
  seoMetadata?: {
    title: string;
    description: string;
    keywords: string;
  };
}
```

## 2. Page Definition (CMS Schema)
**Endpoint:** `GET /api/pages/:slug`

```typescript
interface PageSection {
  id: string;
  type: 'hero' | 'featured_collection' | 'text_block' | 'testimonials' | 'artzy_muse' | 'newsletter';
  title?: string;
  subtitle?: string;
  body?: string;
  images?: string[];
  ctaText?: string;
  ctaLink?: string;
  themeVariant?: 'light' | 'dark' | 'sand' | 'terracotta';
  backgroundStyle?: 'solid' | 'transparent';
  metadata?: Record<string, any>;
}

interface PageDefinition {
  slug: string;
  title: string;
  sections: PageSection[];
  seoMetadata?: {
    title: string;
    description: string;
    keywords: string;
  };
}
```
