# Artzy's Studio Frontend Architecture

The platform follows a headless, API-first architecture designed for maximum flexibility, Edge deployment on Cloudflare Pages, and centralized data management via the ERP (acting as a CMS and PIM).

## High-Level Architecture Diagram

```mermaid
graph TD
    subgraph Frontend [Next.js App Router (Cloudflare Edge)]
        UI[React Server & Client Components]
        CMS[Dynamic Page Builder - page.tsx]
        Context[Customer & Cart Contexts]
        Cache[ISR Caching Layer]
    end

    subgraph External Systems
        Analytics[Google Analytics / Segment DataLayer]
    end

    subgraph ERP [Artzy's Studio ERP - erp.artzysstudio.in]
        API[REST API Gateway]
        PIM[(Product Information Management)]
        CMSData[(Headless CMS Engine)]
        CRM[(Customer Data)]
    end

    UI -->|Analytics Events| Analytics
    CMS -->|Fetches Page Defs| Cache
    UI -->|Fetches Catalog| Cache
    Cache -->|Proxy / ISR (60s)| API
    API --> PIM
    API --> CMSData
    API --> CRM
    Context -->|Read/Write| LocalStorage((Browser LocalStorage))
    Context -.->|Phase 3D Future Sync| API
```

## Key Principles
1. **ERP-First**: `erp.artzysstudio.in` is the absolute single source of truth. The frontend does not hardcode any business data (prices, categories, collections, or static textual homepage content).
2. **Headless CMS Engine**: Pages are entirely dynamic. `src/app/page.tsx` and `src/app/[slug]/page.tsx` act as empty shells that ingest `PageDefinition` JSON payloads and map them to UI blocks.
3. **Intent-Driven Discovery**: The ERP acts as a PIM (Product Information Management) system, supplying rich fields (materials, occasions, colors, styles) to power fuzzy search and the Artzy Muse Gift Finder.
4. **Edge Reliability**: The `api.ts` utility features exponential backoff retry logic. Next.js ISR (Incremental Static Regeneration) ensures the site remains fast and resilient against ERP downtime.
