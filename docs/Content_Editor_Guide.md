# Content Editor Guide

This guide provides instructions for updating the website content through the ERP CMS.

## The Headless Architecture
Because Artzy's Studio uses a headless architecture, you do not need to log into a "Website Admin Panel" (like WordPress) to change content. All content is managed directly within your ERP.

## Managing the Homepage
1. Go to the **Page Builder** module in the ERP.
2. Select the `home` page layout.
3. You will see a list of "Sections".
4. **Ordering:** Drag and drop the sections to change their order on the live website.
5. **Enabling/Disabling:** If you want to hide the "Corporate Gifting" section temporarily, simply toggle it off in the ERP. The Next.js frontend will instantly stop rendering it.
6. **Themes:** You can change the `themeVariant` (Light, Dark, Sage, Sand) for any section to keep the homepage feeling fresh without writing code.

## SEO Best Practices
For every Page and Product in the ERP, ensure you fill out the SEO Metadata fields:
- **Title:** Keep under 60 characters.
- **Description:** Keep under 160 characters. Make it compelling and include keywords like "handcrafted", "resin art", or "corporate gifting".
- **Keywords:** Add 3-5 highly relevant tags.
