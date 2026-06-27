# Artzy's Studio Frontend Implementation

We will build a production-quality ecommerce frontend for Artzy's Studio that meets all specified requirements, including excellent Core Web Vitals, SEO, Cloudflare deployment, and direct integration with the `erp.artzysstudio.in` backend.

## User Review Required

> [!IMPORTANT]
> **API Integration Strategy**: While I have the complete design provided by Claude, I still need the API documentation (or endpoints list) for `erp.artzysstudio.in`. **For this initial implementation, I will build the UI components and hook them up to a central API client file (`lib/api.ts`) using mock data that mimics an ecommerce payload.** Once the API specs are available, we can simply update this client without rewriting the UI components.

> [!NOTE]
> **Framework & Styling**: We will use **Next.js (App Router)** for this project to ensure optimal SEO and Core Web Vitals. As requested by the design file, we will use **Vanilla CSS** with a global CSS variable system (`index.css` / `globals.css`) for styling, strictly adhering to the "warm rose-clay" color palette provided.

## Proposed Architecture

### 1. Project Setup
- Initialize a Next.js App Router project configured for Cloudflare Pages (using `@cloudflare/next-on-pages`).
- Set up the workspace at `D:\Artzy's Studio\Website Claude & Antigravity`.

### 2. UI/UX Implementation (Vanilla CSS)
- **Global Styles**: Extract the CSS variables (`--logo-primary`, `--ivory`, etc.) and global resets from the provided HTML into `app/globals.css`.
- **Typography**: Configure `next/font/google` for `Cormorant Garamond` and `DM Sans` to ensure fast font loading and zero layout shift.
- **Component Architecture**: Break down the provided HTML into reusable React components (e.g., `Announcement`, `Navigation`, `Hero`, `GiftCategories`, `ArtworksGrid`, `Testimonials`, `Footer`).
- **Assets**: Implement Next.js `<Image>` component for all images with lazy loading and optimization.

### 3. State & API Management
- **API Client**: Create a unified HTTP client (`lib/api.ts`) pointing to `erp.artzysstudio.in`.
- **State Management**: Use React Context (or Zustand) to manage client-side state for the Cart and Gift Finder flows, syncing directly with the ERP.

## Verification Plan

### Automated Checks
- Next.js build verification for Cloudflare Edge compatibility.
- ESLint and TypeScript validation.

### Manual Verification
- Deploy to Cloudflare Pages (`demo.artzysstudio.in`).
- Run Google Lighthouse audits to ensure Core Web Vitals meet the "Excellent" standard.
- Verify pixel-perfect adherence to Claude's HTML/CSS mockup across mobile, tablet, and desktop viewports.
