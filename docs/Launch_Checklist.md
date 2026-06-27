# Artzy's Studio: Version 1 Launch Checklist

This checklist contains the strict pass/fail criteria for launching Version 1 of the platform.

## 1. Integrations Validation
- [ ] **ERP API Connection:** `NEXT_PUBLIC_ERP_API_URL` is set to the production ERP URL.
- [ ] **Razorpay Payments:** `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set to Live Mode. Transactions complete without frontend errors.
- [ ] **Shiprocket Logistics:** ERP successfully returns live AWBs for orders, and the timeline UI reflects them.
- [ ] **Notification Webhooks:** ERP successfully sends WhatsApp and Email confirmations without frontend intervention.

## 2. Asset Integrity
- [ ] **Placeholders Removed:** No `_178255` AI-generated assets exist in the codebase.
- [ ] **Authentic Photography:** Deepti J. Shah's real portfolio, studio images, and product photography are successfully loading from the ERP CMS.
- [ ] **Corporate Imagery:** The Project Gallery displays real B2B installations.

## 3. End-to-End Customer Journeys
- [ ] **Guest Checkout:** User can complete checkout without creating an account.
- [ ] **Registered Checkout:** Address book is populated correctly.
- [ ] **Gifting Options:** Gift wrapping (+₹500), Hide Price, and Gift Messages are successfully verified in the ERP payload.
- [ ] **Coupons:** Discount codes are validated by the ERP and applied to the final total.
- [ ] **Corporate Request:** "Request Proposal" successfully fires the lead capture webhook.

## 4. Performance & Security
- [ ] **Lighthouse Scores:** Performance $\ge$ 95, Accessibility $\ge$ 95, Best Practices $\ge$ 95, SEO $\ge$ 95.
- [ ] **Content Security Policy (CSP):** Verified Razorpay popup is not blocked by headers.
- [ ] **SSL Configuration:** SSL is enforced via Cloudflare.

## 5. Deployment Stages
- [ ] **demo.artzysstudio.in:** Deployed & Verified.
- [ ] **Internal QA:** Tested by Artzy's team.
- [ ] **UAT:** User Acceptance Testing passed.
- [ ] **Production:** Deployed to `www.artzysstudio.in`.
