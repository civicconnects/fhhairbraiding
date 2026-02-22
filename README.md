# F & H Hair Braiding Sales Machine

## Architecture Overview

- **Deployment:** Cloudflare Pages (Global Edge).
- **Storage:** Cloudflare D1 for persistent booking data.
- **Logic:** Serverless Workers for payment reconciliation.

## Business Logic Guardrails

1. Deposits are mandatory ($25).
2. "Crown Club" Loyalty: Automated 20% discount on every 5th booking.
3. Local SEO: Target "Hair braiding Radcliff KY" in all metadata.

## QA Standards (Definition of Done)

- **Atomic Transactions:** All booking writes to Cloudflare D1 must use `BEGIN TRANSACTION` (or strict unique constraints) to prevent the "Double-Book" scenario.
- **Idempotency Keys:** Stripe requests must include an `idempotency_key` to prevent double-charging a client if they refresh the page during a slow connection.
- **Zero-Knowledge PII:** Ensure client phone numbers and addresses are handled via secure environment variables and never logged in plain text.

## Maintenance & Monitoring: The "Deadman Switch"

To prevent "silent" revenue loss, a "Reconciliation Cron Job" (Cloudflare Trigger) runs every 30 minutes. It:

1. Compares Stripe successful charges against DB entries.
2. Flags any discrepancies for the owner.
*(e.g., Stripe records a successful $25 payment, but the Cloudflare Worker failed to update the database).*
