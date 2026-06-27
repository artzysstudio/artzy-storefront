# Artzy's Studio QA Checklists

## 1. UX & Design Checklist
- [ ] **Mobile Responsiveness:** View the site on iPhone SE size (320px) up to 4K desktop. Ensure padding and font sizes scale smoothly (`clamp` CSS is working).
- [ ] **Typography:** Verify "Cormorant Garamond" is used for headings and "DM Sans" for body text.
- [ ] **Palette Consistency:** Check that no stray generic colors (pure red, pure blue) appear. Verify the usage of Warm Ivory, Cream, Sand, Terracotta, and Sage Green.
- [ ] **Empty States:** Log in to an empty account and verify empty Wishlist and Collections text instructs the user on what to do next.

## 2. E-Commerce Flow Verification
- [ ] **Smart Search:** Click search, type a generic term ("Blue" or "Wedding"), and verify results populate correctly from PIM mock data.
- [ ] **Shop Filters:** Go to `/shop`, click "Housewarming" under Occasions, and verify the product grid filters down instantly.
- [ ] **Artzy Muse Gift Finder:** Complete the Q1 & Q2 wizard flow and verify it recommends products or provides a fallback graceful message.
- [ ] **Context Sync:** Add an item to Cart and Wishlist, refresh the page, and ensure the state persists via `LocalStorage`.

## 3. SEO & Performance
- [ ] Run Lighthouse on the Homepage. (Target > 95 Performance, Accessibility, SEO).
- [ ] View Page Source on `/shop` and verify `<title>` and `<meta name="description">` are populated.
- [ ] Verify `https://artzysstudio.in/robots.txt` and `https://artzysstudio.in/sitemap.xml` routes resolve correctly.

## 4. ERP Integration Check
- [ ] Ensure `mockProducts` and `mockPages` inside `api.ts` are the *only* source of content on the site.
- [ ] Verify that temporarily modifying a mock string in `api.ts` immediately updates the frontend (verifying the Headless CMS loop).
