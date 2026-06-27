# API Reference

This document catalogs the complete internal API SDK (`src/lib/api.ts`) used by the Next.js frontend to communicate with the ERP backend.

## Base Configuration
- **Base URL:** Defined via `process.env.NEXT_PUBLIC_ERP_API_URL`
- **Retry Logic:** All internal API calls use an Exponential Backoff strategy with a maximum of 3 retries for resilience against temporary ERP unavailability.

## API Client Methods

### 1. Page & Layout Endpoints
```typescript
api.pages.get(slug: string): Promise<PageDefinition | null>
```
Fetches the dynamically configurable page layout, including all sections, theme variants, and specific copy.

### 2. Product Information Management (PIM)
```typescript
api.products.list(): Promise<Product[]>
api.products.get(id: string): Promise<Product | null>
```
Retrieves rich product definitions, including artwork stories, collection IDs, and 3D dimensions.

### 3. Collection Management
```typescript
api.collections.list(): Promise<Collection[]>
api.collections.get(slug: string): Promise<Collection | null>
```
Retrieves collection metadata for dynamic routing and merchandising logic.

### 4. Commerce & Checkout Flow
```typescript
api.commerce.calculateShipping(items: CartItem[], pincode: string): Promise<{ rate: number, provider: string }>
```
Calculates precise shipping rates via the ERP's Shiprocket integration.

```typescript
api.commerce.initiatePayment(items: CartItem[], amount: number): Promise<{ orderId: string }>
```
Creates the initial order in the ERP, reserving inventory, and returns the Razorpay `order_id`.

```typescript
api.commerce.verifyPayment(razorpayOrderId: string, razorpaySignature: string): Promise<{ success: boolean, erpOrderId: string }>
```
Passes the Razorpay success payload back to the ERP for cryptographic signature verification. Returns the final `ARTZY-XXXX` reference.

### 5. Post-Purchase Tracking
```typescript
api.commerce.getOrder(id: string): Promise<Order | null>
```
Retrieves the real-time fulfillment status of an order for mapping onto the handcrafted 8-step visual timeline.
