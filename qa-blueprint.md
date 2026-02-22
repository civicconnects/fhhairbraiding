# Pre-Build QA Blueprint: F & H Hair Braiding

## 1. Test Scenario: The "Double-Queen" Collision (Concurrency)

* **Goal:** Prove that two clients cannot book the same 10:00 AM slot for Box Braids simultaneously.
* **Agent Instruction:** Create a script that fires 10 concurrent `POST` requests to the `/api/book` endpoint for a single `slot_id`.
* **Success Criteria:** D1 must return a `UNIQUE constraint failed` error for 9 requests and a `200 OK` for exactly 1.

## 2. Test Scenario: The "Ghost Payment" (Webhook Reliability)

* **Goal:** Ensure no appointment is confirmed without a verified Stripe signature.
* **Agent Instruction:** Send a mock webhook payload to the `/api/stripe-webhook` endpoint with an invalid `Stripe-Signature` header.
* **Success Criteria:** The system must return a `401 Unauthorized` and the `appointments` table status must remain `pending_deposit`.

## 3. Test Scenario: The "Mobile Speed Trap" (Performance)

* **Goal:** Maintain the "Anti-Gravity" sub-second load time on 4G networks.
* **Agent Instruction:** Run a Lighthouse CI audit on the Hero section using a "Mobile - Slow 4G" throttle profile.
* **Success Criteria:** Largest Contentful Paint (LCP) must be under 2.5 seconds. If higher, the agent must automatically trigger the Cloudflare Images WebP optimization pipeline.

---

## Pre-Build Risk Validation Matrix

| Agent Specialist | Test Case | Criticality | Assert Logic |
| --- | --- | --- | --- |
| **Security Agent** | Injection in `customer_name` | **High** | Sanitize all SQL inputs using D1's prepared statements. |
| **UX Auditor** | Sticky CTA Visibility | **Medium** | Ensure "Book Now" is visible on 320px width screens (iPhone SE). |
| **API Specialist** | Idempotency Check | **High** | Re-sending the same `stripe_session_id` should not create a duplicate DB entry. |

---

## How to Execute the Build

1. **Hand over the Master Implementation File** to your developer agent.
2. **Attach this QA Blueprint** and say: *"Do not consider any feature 'Done' until it passes the Assert Logic defined in this blueprint."*
3. **Run the Stress Test** once the API is deployed to the Cloudflare staging environment.
