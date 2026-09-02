import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  // Cloudflare Pages serves this project as a static export; there is no
  // Next.js image-optimizer server at /_next/image. Emit the original ERP
  // media URLs instead so product imagery loads directly from the studio CDN.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
