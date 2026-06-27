# ERP Integration Guide

This document outlines the strict API contracts expected by the Next.js frontend from the Artzy's Studio ERP.

## The Golden Rule
The Next.js frontend is *dumb*. It only presents what the ERP tells it to present. It never calculates shipping, it never validates discount codes, and it never verifies Razorpay signatures on its own.

## Core API Endpoints

All endpoints assume the base URL defined in `NEXT_PUBLIC_ERP_API_URL`.

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
