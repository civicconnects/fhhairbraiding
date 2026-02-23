# Agentic Instruction Set: SEO Silo & Authority Build

## SYSTEM ACCESS & PERMISSIONS

- You have access to the local file system and the integrated terminal.
- You are permitted to use `wrangler` CLI for Cloudflare Pages deployment and D1 database management.
- You may access the browser for automated testing of SEO metadata and responsiveness.

## PHASE 1: PLANNING (Architecture)

- Implement a Headless architecture using Cloudflare Pages (Frontend) and Workers (Admin Logic).
- Structure the site using a **Hub-and-Spoke Silo Model**.
- Draft User Stories: Focus on "Service Education" and "Lead Generation" paths.

## PHASE 2: LAUNCH (Action Plan)

- Generate a 9-step build plan including:
  - Dynamic routing setup for 15+ service silos.
  - Cloudflare Images integration for "Signature Crowns" gallery.
  - Admin login logic for content management.

## PHASE 3: ASSERT (QA Guardrails)

- **SEO Sitemaps:** Every `/services/*` page must have unique meta-titles and LocalBusiness Schema.
- **Performance:** Mobile LCP must be < 2.0s; auto-convert images to WebP via Cloudflare.
- **No Pricing:** Programmatically verify that no "$" or "Price" strings exist in public-facing code.
- **Assertion:** Run a headless browser test to verify that the "Call/Text" button is sticky on mobile viewports.

## PHASE 4: CONSTRUCT (Component Standards)

- UI: Follow the "Clean Luxury" DNA (Reference: f-h-hair-braiding-staging.b12sites.com).
- UX: Implement a filterable "Signature Crowns" gallery.
- Admin: Build an `/admin` route with an image uploader and a markdown editor for silo descriptions.

## PHASE 5: EXECUTE (Deployment)

- Deploy to Cloudflare Pages.
- Generate and submit `sitemap.xml` to help index the service silos.
- Verify PWA manifest for offline-ready admin access.

## ERROR HANDLING PROTOCOL (THREE-STRIKES)

1. If a build step or terminal command fails, attempt to fix the code directly.
2. If it fails again, try an alternative architectural approach (e.g., swapping a library).
3. If it fails a third time, create a minimal test case and stop to ask the user for guidance.

## PHASE 3: ASSERT (QA Guardrails)

- CALENDAR: Verify the Google Calendar API connection returns a 200 status.
- SYNC: Ensure 'Busy' slots on the owner's calendar are programmatically disabled in the UI.
