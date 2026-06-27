# Disaster Recovery

This document outlines procedures for restoring Artzy's Studio in the event of a catastrophic failure.

## 1. Frontend Outage (Cloudflare / Next.js)
Because the frontend is a stateless Next.js edge application hosted on Cloudflare, it is highly resilient. However, if a bad deployment brings the site down:
- **Action:** Go to Cloudflare Pages Dashboard.
- **Resolution:** Click "Rollback" on the previous successful deployment. It takes seconds.

## 2. ERP / Backend Outage
The frontend strictly relies on `erp.artzysstudio.in`. If the ERP goes offline:
- The website will fail to fetch dynamic layouts and product data.
- **Action:** The Next.js API client (`fetchFromERP` in `api.ts`) contains an exponential backoff retry mechanism.
- **Resolution:** The frontend will attempt to reconnect multiple times. If it ultimately fails, it will serve a static fallback or display a graceful "We are currently experiencing heavy traffic" maintenance page. Focus all engineering efforts on restoring the ERP server.

## 3. Payment Gateway Failure
If Razorpay is experiencing downtime:
- **Action:** Update the ERP configuration to disable the Razorpay module.
- **Resolution:** The frontend will automatically hide the checkout options and display a "Checkout temporarily unavailable" message based on the ERP's payload.
