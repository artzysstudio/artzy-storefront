# Cloudflare Pages Deployment Guide

Artzy's Studio is built on the Next.js App Router and optimized for Edge deployment via Cloudflare Pages.

## Prerequisites
1. Cloudflare account with a Pages project linked to your GitHub repository.
2. The `erp.artzysstudio.in` API is accessible from the internet.

## Configuration

In your Cloudflare Pages dashboard, set the following configuration:

- **Framework preset:** Next.js
- **Build command:** `npx @cloudflare/next-on-pages` (or `npm run build` depending on specific CF adapter implementation)
- **Build output directory:** `.vercel/output/static`

### Environment Variables
Configure the following in the Cloudflare Dashboard (Settings > Environment variables):

| Variable | Description |
|----------|-------------|
| `NODE_VERSION` | Set to `18` or `20` (whichever matches your local dev) |
| `NEXT_PUBLIC_ERP_URL` | `https://erp.artzysstudio.in/api` |
| `NEXT_PUBLIC_GA_ID` | (Future Phase) Google Analytics ID |

## Security & Headers
The `next.config.ts` handles standard CSP and security headers. Cloudflare caching is automatically respected via Next.js `revalidate` parameters in `api.ts`.

## Deployment Process
1. Push your code to the `main` or `rc1` branch on GitHub.
2. Cloudflare Pages will automatically trigger a build.
3. Verify the deployment at `demo.artzysstudio.in` (assuming you have mapped the custom domain in Cloudflare).
