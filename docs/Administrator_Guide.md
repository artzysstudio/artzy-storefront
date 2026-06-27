# Administrator Guide

This guide is for the core administrative team of Artzy's Studio.

## Architecture Overview
Artzy's Studio utilizes an **ERP-First Architecture**.
The frontend you see at `www.artzysstudio.in` is a "Headless" presentation layer built on Next.js. This means the frontend has *zero* business logic hardcoded into it. It relies entirely on the central ERP (`erp.artzysstudio.in`).

## Daily Operations

### 1. Inventory & Products
All inventory is managed through the ERP.
- To mark a product as "Sold Out", update its status in the ERP.
- To change a price, update it in the ERP.
The frontend caches data to remain incredibly fast, but will automatically revalidate in the background when you make changes.

### 2. The Homepage
The homepage is dynamic. You can control the order of sections, the background themes (Light, Dark, Sage, Sand), and the imagery directly from the ERP's Page Builder CMS.

### 3. Corporate Orders
When a customer clicks "Request Proposal" on a Corporate Gift item, the frontend fires a webhook to the ERP. You will find these leads in the ERP's CRM dashboard.

## Emergency Contacts
If the frontend displays a "500 Server Error" or "Unable to connect to ERP", check the ERP server status first. If the ERP is up but the website is failing, consult the Deployment Runbook.
