# Artzy's Studio SEO and conversion programme

Baseline: 5 September 2026. Production target: `https://www.artzysstudio.in/`.

## Phase 1 — audit

- The live sitemap returned 200 with 20 URLs. All tested public pages returned 200, declared a `www` canonical, supplied a description, and had one H1.
- `/account/` and `/checkout/` correctly declare `noindex,nofollow`.
- The sitemap incorrectly listed product modal query URLs whose canonical was `/shop/`. These have been removed pending real product routes.
- The embedded Artzy World preview is a customer workflow, not a search landing page. It is now `noindex,nofollow` and excluded from the sitemap.
- `http://artzysstudio.in/` and `https://artzysstudio.in/` redirect to the preferred HTTPS `www` origin. `http://www.artzysstudio.in/` still returns 200 and needs an account-level Cloudflare HTTPS redirect.
- No missing `alt` attributes were found in the server-rendered key-page sample. Product media still needs a full ERP/CDN asset and filename audit.

## Phase 2 — architecture and keywords

Primary commercial journeys remain Shop, Original Art, Gifts, Personalised, Name Plates, Digital Prints, Caricatures and For Business. Artzy World supports discovery and preview; About and Contact support trust and local intent.

The current product-modal architecture is the main constraint. A proposed stable pattern is `/products/{descriptive-slug}/` with one canonical parent URL and selectable colour/design variants. Do not migrate or redirect indexed URLs until Jaisal or Deepti approves a URL migration preview.

## Phase 3 — technical corrections

Completed in code:

- canonical-only XML sitemap with meaningful `lastmod`;
- removal of `/_next/` from robots blocking;
- crawlable account/checkout pages so their page-level noindex can be detected;
- workflow preview noindex;
- exact footer ownership and development credit;
- repeatable live SEO audit script at `scripts/seo-audit.mjs`.

Pending approval/account access: force HTTPS on `http://www`; submit refreshed sitemap in Search Console; inspect coverage and Core Web Vitals; decide stable product URL migration.

## Phase 4 — on-page map

| URL | Search intent | Primary theme | Action |
|---|---|---|---|
| `/` | brand/discovery | handmade art and meaningful gifts | Explore collections |
| `/shop/` | transactional | handcrafted home decor India | View products |
| `/original-art/` | transactional | original Indian paintings Pune | Explore art |
| `/gifts/` | commercial | personalised handmade gifts India | Find a gift |
| `/name-plates/` | commercial | custom hand-painted name plates | Build a name plate |
| `/digital-prints/` | commercial | custom digital painting from photo | Start a brief |
| `/caricatures/` | commercial | personalised caricature gifts | Create a caricature |
| `/for-business/` | B2B | corporate gifting and commercial art | Discuss a project |
| `/about/` | trust/local | Deepti J. Shah artist studio Pune | Meet the studio |

Product titles, claims and descriptions remain unchanged until approved. New product pages should use descriptive names, visible dimensions/material/availability, useful delivery information, and product-specific copy rather than templates.

## Phase 5 — structured data

Current pages expose Organization/LocalBusiness data. BreadcrumbList should accompany visible breadcrumbs on stable product and collection pages. Product/ProductGroup, Offer and variant data must only be emitted on a stable single-product page and must match visible ERP price, stock, SKU, images and variant names. Never create reviews or ratings that are not verified and visible.

## Phase 6 — image optimisation

Keep source images high quality, supply intrinsic dimensions and responsive candidates, preserve meaningful product alt text, and avoid keyword stuffing. Product media should use descriptive filenames when the CDN workflow permits it. An image sitemap becomes useful after stable product landing pages exist. AI concepts must remain clearly separated from stock/product photography and disclosed as AI concepts.

## Phase 7 — local SEO

The public Pune address, phone and studio identity are consistent in the footer and structured data. Google Business Profile categories, hours, map pin, photographs and review-response workflow require owner access and should be verified against the studio's current real-world operations before publication.

## Phase 8 — Merchant Center

Do not publish a feed yet. The blocking issue is the absence of stable canonical product URLs. After approval, map ERP fields to id, title, description, link, image_link, availability, price, condition, brand, shipping and variant group fields. Validate landing-page price/availability parity, broken CDN images, shipping settings and AI-media disclosures before enabling free listings.

## Phase 9 — measurement

Search Console and GA4 access was not available in the repository. Required checks: verify the `www` property, submit `/sitemap.xml`, inspect indexing/canonicals, review queries/pages/devices, configure ecommerce events (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`) and exclude sensitive ArtzyAI prompts or facial data. No tracking ID or consent configuration should be invented.

## Phase 10 — internal linking

Homepage and navigation should link directly to all principal commercial journeys. Collection/editorial copy should link contextually to related collections and approved products. Product pages should link to their parent collection, relevant policies and complementary products. Avoid linking to query-state modals as permanent search destinations.

## Phase 11 — 90-day content plan

Weeks 1–4: artist/studio story, choosing original art for Indian homes, handmade gift guide by budget, and custom name-plate planning. Weeks 5–8: Indian painting styles, wall-art sizing, corporate gifting lead times, and caring for handmade decor. Weeks 9–12: occasion gift guide, commissioning a portrait/caricature, Pune studio visit guide, and transparent AI-concept-to-artist workflow. Each article needs owner-approved facts, original studio imagery and links to the relevant commercial page.

## Phase 12 — performance and conversion

Priorities: optimise hero LCP images without close cropping, reserve media dimensions to prevent CLS, keep mobile controls touch-friendly, lazy-load below-fold galleries, avoid unused preloads, and keep Muse compact until opened. Measure field Core Web Vitals in Search Console and validate key journeys at 360, 390, 768 and desktop widths before each release.

## Phase 13 — governance and next approvals

Monthly: crawl URLs and images, validate structured data, reconcile ERP price/stock/media, review Search Console and Merchant diagnostics, and record released metadata/content. Quarterly: review search intent, thin pages, accessibility, mobile conversion and content performance.

Approval required before: stable product URL migration and redirects; new or materially changed product/brand claims; prices, shipping/returns/legal wording; Merchant Center publication; Google Business Profile changes; Search Console/GA4 account changes; removal of any known indexed public page.

## Acceptance status

Technical safe fixes are implemented. Full SEO activation is not honestly complete until stable product URLs are approved, Cloudflare forces HTTPS on the `www` HTTP host, and owner-authorised Search Console, Analytics, Business Profile and Merchant Center work is completed.
