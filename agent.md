# Agentic Instruction Set: Anti-Gravity Build

## PHASE 1: PLANNING (Architecture)

- Implement a Headless architecture using Cloudflare Workers for all sensitive logic.
- Structure D1 database for atomic booking transactions.

## PHASE 2: ASSERT (QA Guardrails)

- WEBHOOKS: Must validate Stripe signatures before DB updates.
- CONCURRENCY: Use 'BEGIN TRANSACTION' in D1 to prevent double-booking.
- PERFORMANCE: LCP < 2.5s; auto-convert images to WebP.
- IDEMPOTENCY: Include Stripe idempotency keys for all payment requests.

## PHASE 3: CONSTRUCT (Component Standards)

- SEO: Every service page (/services/*) must have unique Schema.org markup.
- UI: Sticky "Book Now" CTA on all mobile viewports.
- UX: Live Instagram feed integration with error handling for API timeouts.
