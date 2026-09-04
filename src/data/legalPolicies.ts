import type { PageDefinition } from '@/lib/api';

type PolicyBlock = { heading: string; paragraphs?: string[]; bullets?: string[] };

const studioIdentity: PolicyBlock = {
  heading: 'Seller, support and grievances',
  paragraphs: ["Artzy's Studio operates from Ground Floor, Preetishilp Building, Lane No. 3, Plot No. 22, Prashant Society, Paud Road, Kothrud, Pune, Maharashtra 411038, India."],
  bullets: [
    'Email: artzysstudio@gmail.com',
    'Phone and WhatsApp: +91 91586 80722',
    'Grievance contact: Artzy’s Studio customer support at the address, email and phone above. Include your order or enquiry reference.',
  ],
};

const page = (slug: string, title: string, description: string, items: PolicyBlock[]): PageDefinition => ({
  slug,
  title,
  seoMetadata: { title: `${title} | Artzy's Studio`, description, keywords: [] },
  sections: [{
    id: `${slug}-content`,
    type: 'standard_text',
    isEnabled: true,
    sortOrder: 1,
    themeVariant: 'light',
    backgroundStyle: 'none',
    content: { title, body: description, items },
  }],
});

export const legalPolicyPages: Record<string, PageDefinition> = {
  'shipping-policy': page('shipping-policy', 'Shipping information', 'How processing, complimentary shipping, courier charges and delivery estimates work.', [
    studioIdentity,
    { heading: 'Where we deliver', paragraphs: ['We accept delivery requests within India where a suitable courier is available. Serviceability is checked by PIN code. Remote, restricted, fragile, oversized or high-risk destinations may require a different arrangement or studio confirmation.'] },
    { heading: 'Processing and dispatch', paragraphs: ['Ready-stock products are prepared after payment and stock verification. Personalised, made-to-order, original and commissioned work begins only after the studio confirms the brief, proof, price and production schedule.'], bullets: ['Processing or production time is separate from courier transit time.', 'An estimated date is not a guaranteed delivery date.', 'We will contact you if stock, approval, weather, courier service or another exceptional issue changes the estimate.'] },
    { heading: 'Complimentary shipping above ₹1,499', paragraphs: ['Complimentary standard shipping applies when the eligible merchandise subtotal after discounts is ₹1,499 or more and checkout confirms the offer. It applies to eligible retail deliveries within India.'], bullets: ['Oversized, unusually fragile, urgent, remote-area, bulk, corporate or specially commissioned orders may be excluded.', 'Express, urgent and special-handling upgrades remain chargeable.', 'Any exception is shown or confirmed before payment.'] },
    { heading: 'Charges, tracking and delivery', paragraphs: ['Below the threshold, shipping is calculated or confirmed using the items, packaging and PIN code. Tracking is shared when available. A failed delivery caused by an incorrect address, repeated unavailability or refusal may require a new delivery charge.'] },
    { heading: 'Damage or missing parcel', paragraphs: ['Photograph the unopened parcel, label, outer packaging and item if it arrives damaged or incomplete. Keep all packaging and contact the studio promptly so the courier claim can be assessed.'] },
    { heading: 'Last updated', paragraphs: ['4 September 2026. Shipping terms shown at checkout or in a studio quotation take priority for that order.'] },
  ]),
  'returns-policy': page('returns-policy', 'Returns and damage', 'Eligibility and the process for reporting damage, incorrect items, replacements and refunds.', [
    studioIdentity,
    { heading: 'Eligible standard-product returns', paragraphs: ['A standard, non-personalised product may be returned within 7 days of delivery when it is unused, undamaged and in its original packaging with all accessories, certificates and tags. Proof of purchase is required. Contact us before returning anything; an unapproved return may not be accepted.'] },
    { heading: 'Original artwork', paragraphs: ['An eligible, non-personalised original artwork return must be requested within 7 days of delivery. Because every original is unique, it must remain unused, unaltered and in its original condition and packaging. A return may be declined if the artwork or packaging was damaged after delivery.'] },
    { heading: 'Inspect your order', paragraphs: ['Inspect the parcel and item immediately. Report damage, defect, incompleteness or an incorrect product within 3 days of delivery. Include the order number, issue description, clear product and packaging photographs, and an unboxing video where reasonably available. Keep the item, label and packaging during review.'] },
    { heading: 'What may qualify', bullets: ['Transit damage.', 'A different product from the confirmed order.', 'A material manufacturing defect or customised item materially different from the approved written brief or proof.'] },
    { heading: 'Personalised and made-to-order work', paragraphs: ['Custom paintings, commissioned art, caricatures, name plates, custom names or photographs, special sizes, made-to-order hampers and customer-approved AI-assisted directions cannot normally be returned, exchanged or cancelled after production begins. We will still provide an appropriate correction, replacement or refund for verified damage, defect, wrong supply or a material difference from the approved design.'] },
    { heading: 'Digital products', paragraphs: ['A delivered or downloaded digital product cannot be returned for change of mind. Report an incorrect, corrupted or materially misdescribed file within 3 days; we will correct or replace it or provide an appropriate refund.'] },
    { heading: 'Items that cannot be returned', bullets: ['Gift cards or vouchers.', 'Products damaged by misuse, mishandling or improper care.', 'Items altered, installed or repaired by the customer or another party.', 'Items missing original packaging or components.', 'Clearly marked clearance or final-sale products, except where defective or incorrect.', 'Natural handmade or artistic variations.', 'Edible hamper items, except when damaged, expired or incorrect on delivery.'] },
    { heading: 'Assessment and exchanges', paragraphs: ['We may request more evidence or an authorised return. Depending on the verified circumstances, we may offer repair, correction, replacement, exchange, store credit or refund. Exchanges depend on availability; if a replacement is unavailable, an alternative requires your approval. Do not return an item until written instructions are provided.'] },
    { heading: 'Return shipping', paragraphs: ['For our error, transit damage, a defect or an incorrect item, we will arrange or reimburse reasonable return shipping. For an eligible change-of-mind return, the customer pays return shipping; original delivery and payment-processing charges may be non-refundable to the extent permitted by law. Returned artwork must be packed securely.'] },
    { heading: 'Refund timing', paragraphs: ['After an eligible return is received and inspected, we will confirm whether the refund is approved. An approved refund is normally initiated within 7 business days to the original payment method; the bank or provider may take longer to credit it. For Cash on Delivery, verified bank or UPI details may be requested securely. Statutory consumer rights remain unaffected.'] },
    { heading: 'How to request support', paragraphs: ['Contact the email or WhatsApp number above before sending anything back.'], bullets: ['Provide your full name and order number.', 'Use the registered phone number or email address.', 'Explain the requested cancellation, return, replacement or refund.', 'Attach supporting photographs or video where applicable.'] },
    { heading: 'Customer rights', paragraphs: ['Nothing in this policy excludes or limits a right or remedy available under the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020 or other applicable Indian law.'] },
    { heading: 'Last updated', paragraphs: ['4 September 2026. The confirmed order and applicable law govern each claim.'] },
  ]),
  'customised-product-policy': page('customised-product-policy', 'Customised products', 'Approval, production, variations and return conditions for personalised and commissioned work.', [
    studioIdentity,
    { heading: 'Before making begins', paragraphs: ['A website preview, builder estimate or AI concept is not a production order. The studio confirms wording, dimensions, material, artwork direction, price, tax, delivery charge and estimated schedule before production.'] },
    { heading: 'Customer responsibility', bullets: ['Check names, spelling, dates, language, dimensions, colours and delivery details.', 'Have permission to use every submitted photograph, logo, name or reference.', 'Reply promptly to proof requests; delayed approval can change the schedule.'] },
    { heading: 'Handmade variation', paragraphs: ['Small differences in brushwork, colour, texture, grain, placement and finish are part of handmade work and are not automatically defects. Screens may display colours differently.'] },
    { heading: 'Changes, cancellations and returns', paragraphs: ['Changes after approval may require a revised price and schedule and may not be possible after production starts. Custom work normally cannot be cancelled or returned for change of mind once work begins. Damage, defect and material-mismatch claims remain covered by the Returns and damage policy.'] },
    { heading: 'Last updated', paragraphs: ['4 September 2026. The final quotation and approved proof form part of the order terms.'] },
  ]),
  'cancellation-policy': page('cancellation-policy', 'Cancellation', 'When an order can be cancelled and how payment reversals are handled.', [
    studioIdentity,
    { heading: 'Requesting cancellation', paragraphs: ['Contact the studio immediately with the order reference. A request is accepted only when confirmed in writing.'] },
    { heading: 'Ready-stock orders', paragraphs: ['A ready-stock order may be cancellable before packing or courier handover. After dispatch, an eligible return must follow the Returns and damage policy.'] },
    { heading: 'Personalised and commissioned work', paragraphs: ['Cancellation is available only before design or production work begins. It may be unavailable after proof approval, material procurement or production. If a later cancellation is exceptionally accepted, reasonable design, artist time, non-recoverable material, payment-gateway or administrative costs may be deducted after informing you.'] },
    { heading: 'Cancellation by Artzy’s Studio', paragraphs: ['We may cancel because of product unavailability, an obvious pricing error, payment failure, delivery restriction or circumstances outside reasonable control. Any amount captured for a cancelled item will be refunded.'] },
    { heading: 'Failed or duplicate payments', paragraphs: ['Do not pay again while an order status is uncertain. Share the payment reference with us. Failed transactions follow the payment provider and applicable RBI timelines. A verified duplicate captured payment will be returned to the original method.'] },
    { heading: 'Last updated', paragraphs: ['4 September 2026. Statutory rights and payment-system rules continue to apply.'] },
  ]),
  'privacy-policy': page('privacy-policy', 'Privacy policy', 'How Artzy’s Studio collects, uses, shares, secures and removes customer information and creative uploads.', [
    studioIdentity,
    { heading: 'Information we collect', bullets: ['Contact, account, billing, delivery and order information.', 'Product choices, briefs, messages, approvals and support history.', 'Photographs, artwork references, room images and generated concepts you submit.', 'Necessary technical, security, consent and usage records, including a privacy-safe session or device identifier for abuse prevention and AI limits.', 'Payment status and transaction references; full card or UPI credentials are handled by the payment provider.'] },
    { heading: 'Why we use it', bullets: ['Provide accounts, quotations, orders, delivery and support.', 'Create requested previews, personalised work and proofs with required consent.', 'Protect the service, enforce generation limits and diagnose failures.', 'Meet legal, tax, accounting and consumer-grievance obligations.', 'Send optional marketing only where permitted.'] },
    { heading: 'Photographs and creative uploads', paragraphs: ['Uploads are used for the requested service and selected permissions. AI processing, extended retention, studio handoff, promotion and model training are separate choices where offered; optional promotion and training are off by default. Temporary previews use restricted storage and expiry controls. Material attached to an ERP enquiry may be retained for fulfilment, disputes and lawful records.'] },
    { heading: 'Who receives information', paragraphs: ['Only the minimum necessary information is shared.'], bullets: ['Artzy ERP and authentication services for catalogue, customer, enquiry and order records.', 'Razorpay and payment networks for payment and reconciliation.', 'Courier partners for delivery.', 'Cloudflare hosting, security, storage and ArtzyAI services for the website and requested creative tools.', 'Authorities or professional advisers where required by law or a legal claim.'] },
    { heading: 'Retention and your choices', paragraphs: ['Information is kept only as reasonably necessary for the purpose, active relationship, security, disputes and legal, accounting or tax duties. You may request access, correction or deletion; some records may need to be retained by law or for a live transaction. You may remove an upload before submission and decline optional processing.'] },
    { heading: 'Children, security and complaints', paragraphs: ['A parent or lawful guardian must authorise a child’s photograph. Do not upload another person’s image without permission. We use secure transport, access controls and restricted service credentials, but no online system is risk-free. Report privacy concerns using the grievance contact above and never send passwords, OTPs or complete payment credentials.'] },
    { heading: 'Last updated', paragraphs: ['4 September 2026. This notice is designed to support the Digital Personal Data Protection Act, 2023 and applicable phased rules as they come into force.'] },
  ]),
  'terms-and-conditions': page('terms-and-conditions', 'Terms and conditions', 'Terms governing catalogue purchases, custom work, payments, digital concepts and use of this website.', [
    studioIdentity,
    { heading: 'Using the storefront', paragraphs: ['By ordering or approving a custom request, you confirm that your details are accurate, you can legally contract and you accept the applicable product details, quotation and policies. Automated misuse, unauthorised copying and interference are prohibited.'] },
    { heading: 'Products, stock and pricing', paragraphs: ['ERP publication controls live availability, variants and stock. Adding to the bag does not reserve an item. Prices are in Indian rupees. An obvious technical or pricing error may be corrected before acceptance, with an option to reconfirm or cancel.'] },
    { heading: 'Order acceptance', paragraphs: ['An automated acknowledgement is not final acceptance. Acceptance occurs after payment, stock, serviceability and required custom approvals are confirmed. If an order cannot be fulfilled, we may decline or cancel it and arrange the applicable payment reversal.'] },
    { heading: 'Payments and customer safety', paragraphs: ['Payments use the configured provider. Never share an OTP, PIN or complete card credential with us. Failed, pending and duplicate cases follow the Cancellation policy and applicable RBI or provider processes.'] },
    { heading: 'Creative rights', paragraphs: ['Handmade variation follows the Customised products policy. Digital and commercial usage is limited to rights confirmed in writing. Artzy’s Studio retains rights in its branding, original artwork, website presentation and creative material unless specific commercial rights are granted.'] },
    { heading: 'Liability and events outside control', paragraphs: ['Nothing excludes rights or liability that cannot legally be excluded. To the extent permitted by law, we are not responsible for indirect loss or delay caused by events outside reasonable control, including courier disruption, natural events, network failure or government restriction.'] },
    { heading: 'Law and disputes', paragraphs: ['These terms are governed by Indian law. Contact the grievance channel first. Subject to mandatory consumer jurisdiction, courts and competent forums in Pune, Maharashtra have jurisdiction.'] },
    { heading: 'Last updated', paragraphs: ['4 September 2026. Product details, checkout confirmation and an accepted studio quotation form part of these terms.'] },
  ]),
  'ai-concept-disclosure': page('ai-concept-disclosure', 'AI concept disclosure', 'What an ArtzyAI preview means, how uploads are handled and when the studio becomes involved.', [
    studioIdentity,
    { heading: 'Concept, not stock or proof', paragraphs: ['Artzy Muse and ArtzyAI images are imaginative previews. They are not ERP stock, Deepti’s original artwork, a manufacturing guarantee, a production proof or a confirmed order. Every generated result is labelled as an AI concept.'] },
    { heading: 'What AI may get wrong', paragraphs: ['A concept may contain inaccurate facial details, text, proportions, materials, colours or objects. Names and final wording must be checked separately. Recognisable likeness is requested for caricatures but cannot be guaranteed by an automated sample. Sensitive traits are not intentionally exaggerated.'] },
    { heading: 'Consent and uploads', paragraphs: ['Generation begins only after required consent. You must have permission for each submitted image. Uploads follow the Privacy policy; retention, promotion and training choices remain separate.'] },
    { heading: 'Studio finishing', paragraphs: ['When you choose studio guidance, Artzy’s Studio reviews the brief and may refine likeness, composition, wording, materials and feasibility. Scope, price, revisions and delivery timing are confirmed before final work.'] },
    { heading: 'Last updated', paragraphs: ['4 September 2026. AI availability and sample limits may change to protect the service and manage generation costs.'] },
  ]),
};
