# Deployment Runbook

This runbook defines the sequential deployment pipeline for `www.artzysstudio.in`.

## Target Environments
1. **Preview / Demo:** `demo.artzysstudio.in` (Auto-deploys on commit to `main`)
2. **UAT (User Acceptance Testing):** `uat.artzysstudio.in` (Deploys via manual tag)
3. **Production:** `www.artzysstudio.in` (Deploys via explicit promotion from UAT)

## Deployment Steps
1. Ensure all code is committed and pushed to the repository.
2. Cloudflare Pages will automatically build the Next.js application.
3. Check the Build Logs in Cloudflare for any warnings or errors.
4. Run the Lighthouse audit on the Preview URL.
5. If the Lighthouse scores are all $\ge$ 95, approve the UAT deployment.
6. Once business stakeholders sign off on UAT, promote the build to Production.

## Environment Variables
Ensure the following variables are strictly maintained in the production environment settings (do NOT commit these to the repo):
- `NEXT_PUBLIC_ERP_API_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
