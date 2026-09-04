# ERP Integration Guide

This document outlines the strict API contracts expected by the Next.js frontend from the Artzy's Studio ERP.

## The Golden Rule
The Next.js frontend is *dumb*. It only presents what the ERP tells it to present. It never calculates shipping, it never validates discount codes, and it never verifies Razorpay signatures on its own.

## Storefront exchange boundary

The browser uses same-origin `/api/storefront/*` routes. Cloudflare Pages
Functions authenticate to ERP with the encrypted `ERP_API_TOKEN`; the token is
never shipped to browser JavaScript. Published catalogue data flows from ERP to
the storefront, while shipping and payment requests flow from the storefront to
ERP for authoritative validation.

## Core API Endpoints

Server-side exchange endpoints use `ERP_API_BASE_URL`. Public page-copy fallbacks
may still use `NEXT_PUBLIC_ERP_API_URL`, but stock, prices, shipping and payment
must pass through the same-origin server proxy.

### `GET /api/health`
Used by `/api/storefront/status` to verify a real ERP connection rather than
only checking that environment variables exist.

### `GET /api/products/featured`
Returns the currently published product catalogue, including authoritative
price, stock, variants and media paths.

### `GET /api/categories`
Returns the ERP category hierarchy. Inline base64 category images are removed
at the storefront boundary; product imagery is served from
`media.artzysstudio.in`.

### `GET /api/page/:slug`
Returns the dynamic CMS layout for a given page.
- **Expected Payload:** An array of `PageSection` objects defining Hero banners, text, theme colors, and featured grids.

### `POST /api/commerce/shipping/calculate`
- **Body:** `{ items: Array, pincode: string }`
- **Returns:** `{ rate: number, provider: string }`

### `POST /api/commerce/payment/initiate`
- **Body:** `{ items: Array, amount: number, isGift: boolean, giftMessage?: string, coupon?: string }`
- **Returns:** `{ orderId: string }` (This must be a Razorpay order ID).

### `POST /api/commerce/payment/verify`
- **Body:** `{ razorpay_order_id: string, razorpay_signature: string }`
- **Returns:** `{ success: boolean, erpOrderId: string }`

### `GET /api/commerce/order/:id`
Returns the status of an order for the Handcrafted Timeline UI.
- **Returns:** `{ id, status, trackingNumber, courier, total }`

## Inventory & Webhooks
The ERP is responsible for automatically reserving inventory the moment `/initiate` is called, and releasing it if the payment fails or expires. The ERP is also solely responsible for firing WhatsApp and Email notifications.
