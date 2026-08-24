# Artzy's Studio storefront audit — 24 August 2026

## Scope and architecture

- Framework: Next.js App Router, TypeScript, static export, React, Cloudflare Pages and Pages Functions.
- Inventory authority: Artzy ERP. The committed `erp-products.json` snapshot is the build-time continuity source; the browser refreshes through `/api/storefront/products`.
- Public product rule: valid ERP id/name, positive price and quantity, not sold out, available, and an `media.artzysstudio.in` product image.
- Payments: Razorpay initiation and verification are delegated to ERP server endpoints. The browser does not mark an order paid on its own.
- Customer state: cart, wishlist, recent items and authentication token are held in local storage; no Supabase integration or migration layer exists in this repository.
- AI: Artzy Muse and concept endpoints exist. Product recommendations remain constrained by the ERP eligibility rule; concepts must remain labelled separately from stock and production proofs.

## Baseline issues found before this upgrade

- `next lint` was no longer a valid command and the ESLint flat configuration was incompatible with the installed version.
- Next.js 15.0.3 generated a known security warning.
- Fake fallback data existed for a testimonial, Instagram posts and order tracking, including a random tracking number and invented order total.
- Products without ERP lead-time data displayed an invented 3–5 working-day dispatch statement.
- Homepage navigation did not match the requested six customer-oriented groups.
- No dedicated Original Art route existed.
- Staging metadata and robots behavior were not controlled by environment variables.
- Customer policy routes depended on ERP content and could return 404.
- Google-hosted fonts made builds depend on an external network request.

## Completed and verified

- Upgraded to Next.js 16.3.2 and stable React 19.2.4; production dependency audit reports zero vulnerabilities.
- Replaced the broken lint command with ESLint flat-config execution. Result: zero errors, 34 warnings.
- Removed fabricated testimonial, Instagram and order fallbacks.
- Added an explicit ERP order type and a truthful tracking-unavailable state.
- Replaced unsupported dispatch promises with studio/PIN-code confirmation language.
- Rebuilt homepage hierarchy around handmade art, real ERP product imagery, three customer intents and verified Deepti biography copy.
- Reworked navigation to Shop, Gifts, Original Art, Customise, Artzy World and Our Story. Product category links use the four categories present in the current ERP snapshot.
- Added `/original-art/`, scoped to the real Wall Art & Frames ERP category.
- Added active shop filter chips and Newest/Availability sorting; retained mobile drawer and progressive product loading.
- Added environment-aware canonical, robots and sitemap behavior. Preview remains noindex unless `NEXT_PUBLIC_SITE_INDEXABLE=true` is explicitly set.
- Added Organization/LocalBusiness JSON-LD from the verified studio contact and address.
- Added truthful fallback pages for shipping, returns/damage, customised products, cancellation, privacy, terms and AI concept disclosure.
- Added global focus visibility and reduced-motion behavior.
- Replaced Google font fetching with reliable local system font stacks.

## Verification evidence

- Production build: pass, 31 static pages generated.
- TypeScript: pass.
- Gift Finder unit tests: 8 passed, 0 failed.
- Caricature unit tests: 8 passed, 0 failed.
- Production dependency audit: 0 vulnerabilities.
- Route scan: 23 checked, 23 returned HTTP 200.
- Responsive bounds: 360×800, 390×844, 768×1024, 1366×768 and 1440×900; no horizontal document overflow and no broken images on the checked homepage.
- Shop browser check: 122 eligible ERP products, 4 real categories, 12 initially rendered, Wall Art filter returns 19 products.
- Mobile navigation: six groups present; active page highlight verified.

## Completed but awaiting configuration

- The live ERP `products/featured` endpoint returned HTTP 200 with an empty array during final verification, so the last verified ERP snapshot supplied the staging catalogue. This is a launch blocker: populate/fix the feed and verify current price and stock before making the official domain public.
- Policy text is conservative continuity copy and should be reviewed by Artzy's Studio before the official domain becomes indexable.
- `NEXT_PUBLIC_SITE_URL=https://www.artzysstudio.in` and `NEXT_PUBLIC_SITE_INDEXABLE=true` must only be enabled at approved launch.

## Not completed in this release

- No database or RLS work: the repository contains no Supabase/database schema.
- No live payment was placed. Payment success/failure/pending/retry and duplicate-payment scenarios require the ERP/Razorpay test environment.
- No private upload store, signed URL or retention job was added; existing commission forms must not be represented as secure private upload storage until a backend is configured.
- No verified reviews were available, so no review section was added.
- No old Wix or Take App URL export was supplied; external redirect mapping remains pending that inventory.
- Core Web Vitals require a representative deployed measurement; DOM/layout checks are not a substitute for field or throttled lab data.
- Full checkout and account tracking for arbitrary order paths is constrained by the current static-export architecture and requires a runtime route or ERP-hosted tracking endpoint.

## Redirect inventory

| Existing URL | Current handling | Recommendation |
| --- | --- | --- |
| `/personalized/` | Preserved compatibility alias | Keep until inbound-link data proves it is unused. |
| `/custom-corporate/` | Preserved route | Keep; navigation now points customers through Our Story/Business. |
| Old Wix URLs | Unknown | Export from Search Console/Wix before adding permanent redirects. |
| Old Take App URLs | Unknown | Export from Take App and analytics before adding permanent redirects. |

## Rollback

The preview is isolated on a non-production Cloudflare Pages branch. Roll back by deleting/ignoring that preview deployment or redeploying the previous preview commit. Production and the official domain are not changed by this release.
