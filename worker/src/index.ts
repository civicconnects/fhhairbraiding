/// <reference types="@cloudflare/workers-types" />
import Stripe from 'stripe';
import { verifyStripeSignature } from './stripe';

export interface Env {
    DB: D1Database;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    FRONTEND_URL: string;
    BRAIDS_BUCKET: R2Bucket;
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        const url = new URL(request.url);
        const origin = request.headers.get("Origin") || "*";
        const corsHeaders = {
            "Access-Control-Allow-Origin": origin,
            "Content-Type": "application/json",
        };

        // CORS Handling
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    ...corsHeaders,
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, stripe-signature",
                },
            });
        }

        const stripe = new Stripe(env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
            apiVersion: '2026-01-28.clover',
            httpClient: Stripe.createFetchHttpClient(),
        });

        // Admin Upload Route (Requires Password)
        if (url.pathname === "/api/admin/upload" && request.method === "POST") {
            const adminKey = request.headers.get("X-Admin-Key");

            // We check the admin password provided by the frontend
            if (adminKey !== "your-secret-password") {
                return new Response(JSON.stringify({ error: "Unauthorized" }), {
                    status: 401,
                    headers: corsHeaders
                });
            }

            const formData = await request.formData();
            const file = formData.get("file") as File;

            if (!file) {
                return new Response(JSON.stringify({ error: "No file provided" }), {
                    status: 400,
                    headers: corsHeaders
                });
            }

            const fileName = `${Date.now()}-${file.name}`;

            await env.BRAIDS_BUCKET.put(fileName, file.stream());

            return new Response(JSON.stringify({ url: `https://pub-your-id.r2.dev/${fileName}` }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // 1. Init Booking & Checkout Session
        // Note: Changing endpoint to /api/book to match Master instructions if preferred, but existing code used /api/bookings/init
        if ((url.pathname === "/api/bookings/init" || url.pathname === "/api/book") && request.method === "POST") {
            try {
                // To support stress test script:
                const body = await request.json() as any;
                const slotId = body.slotId;
                if (!slotId) return new Response("Missing slotId", { status: 400, headers: corsHeaders });

                const customerName = body.customerName || `Demo Customer ${body.userId || ''}`;
                const customerEmail = body.customerEmail || 'demo@example.com';
                const customerPhone = body.customerPhone || '555-0199';

                // We try to insert into appointments. 
                // The UNIQUE(slot_id) constraint in the DB will automatically throw an error if another transaction already grabbed it.
                // This guarantees atomic locking!
                let appointmentId: number;
                try {
                    const result = await env.DB.prepare(
                        `INSERT INTO appointments (slot_id, customer_name, customer_email, customer_phone, status) VALUES (?, ?, ?, ?, 'pending_deposit') RETURNING id`
                    ).bind(slotId, customerName, customerEmail, customerPhone).first();
                    appointmentId = result?.id as number;
                } catch (dbError: any) {
                    // Unique constraint failed = slot already taken by another request concurrently
                    return new Response(JSON.stringify({ error: "Slot unavailable" }), { status: 409, headers: corsHeaders });
                }

                const bookingId = `appt_${appointmentId}`;

                // Create Stripe Checkout Session for $25 Deposit
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'F&H Hair Braiding Deposit',
                                description: `Slot ID: ${slotId}`,
                            },
                            unit_amount: 2500, // $25.00
                        },
                        quantity: 1,
                    }],
                    mode: 'payment',
                    success_url: `${env.FRONTEND_URL || 'http://localhost:5173'}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${env.FRONTEND_URL || 'http://localhost:5173'}/?canceled=true`,
                    client_reference_id: appointmentId.toString(),
                    metadata: {
                        appointmentId: appointmentId.toString(),
                        slotId: slotId.toString()
                    },
                    expires_at: Math.floor(Date.now() / 1000) + (30 * 60) // Expires in 30 mins
                }, {
                    idempotencyKey: bookingId
                });

                // Update appointment with stripe_session_id
                await env.DB.prepare(
                    `UPDATE appointments SET stripe_session_id = ? WHERE id = ?`
                ).bind(session.id, appointmentId).run();

                return new Response(JSON.stringify({ checkoutUrl: session.url }), { status: 200, headers: corsHeaders });
            } catch (err: any) {
                return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
            }
        }

        // 2. Stripe Webhook
        if (url.pathname === "/api/webhook" && request.method === "POST") {
            const signature = request.headers.get("stripe-signature");
            if (!signature) return new Response("No signature", { status: 400 });

            const bodyText = await request.text();

            const isValid = await verifyStripeSignature(bodyText, signature, env.STRIPE_WEBHOOK_SECRET);
            if (!isValid && env.STRIPE_WEBHOOK_SECRET && env.STRIPE_WEBHOOK_SECRET !== 'whsec_dummy') {
                return new Response("Invalid signature", { status: 400 });
            }

            let event: Stripe.Event;
            try {
                event = JSON.parse(bodyText);
            } catch (err) {
                return new Response("Invalid payload", { status: 400 });
            }

            try {
                switch (event.type) {
                    case 'checkout.session.completed': {
                        const session = event.data.object as Stripe.Checkout.Session;
                        const appointmentId = session.metadata?.appointmentId;
                        const slotId = session.metadata?.slotId;

                        // We use a BEGIN TRANSACTION equivalent by running multiple statements if needed,
                        // or just rely on sequential execution for the webhook
                        if (appointmentId && slotId) {
                            await env.DB.prepare(
                                `UPDATE appointments SET status = 'confirmed' WHERE id = ?`
                            ).bind(appointmentId).run();

                            // Optimistically lock/mark the slot as fully booked
                            // Also increment version
                            await env.DB.prepare(
                                `UPDATE availability_slots SET is_booked = 1, version = version + 1 WHERE id = ?`
                            ).bind(slotId).run();
                        }
                        break;
                    }
                    case 'checkout.session.expired': {
                        const session = event.data.object as Stripe.Checkout.Session;
                        const appointmentId = session.metadata?.appointmentId;
                        const slotId = session.metadata?.slotId;
                        if (appointmentId) {
                            // Free up the slot by deleting the appointment or marking as cancelled
                            // We delete it so the unique slot_id constraint is lifted
                            await env.DB.prepare(
                                `DELETE FROM appointments WHERE id = ?`
                            ).bind(appointmentId).run();
                        }
                        break;
                    }
                }
                return new Response(JSON.stringify({ received: true }), { status: 200, headers: corsHeaders });
            } catch (dbErr: any) {
                return new Response(JSON.stringify({ error: dbErr.message }), { status: 500, headers: corsHeaders });
            }
        }

        // 3. Get Slots check
        if (url.pathname.startsWith("/api/slots") && request.method === "GET") {
            const parts = url.pathname.split('/');
            const slotId = parts[parts.length - 1];

            const { results } = await env.DB.prepare(
                `SELECT status FROM appointments WHERE slot_id = ? AND status IN ('pending_deposit', 'confirmed')`
            ).bind(slotId).all();

            const status = results.length > 0 ? "BOOKED" : "AVAILABLE";
            return new Response(JSON.stringify({ id: slotId, status }), { status: 200, headers: corsHeaders });
        }

        return new Response("F&H Hair Braiding API is running. Direct D1 bindings functional.", { status: 200, headers: corsHeaders });
    },

    // Reconciliation Cron Job (The Deadman Switch)
    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
        // Fetch: Get all "Pending" appointments in D1 older than 30 minutes.
        // (Assuming created_at exists, or we just check all pending for this demo)
        const { results } = await env.DB.prepare(
            `SELECT id, slot_id, stripe_session_id FROM appointments WHERE status = 'pending_deposit'`
        ).all();

        if (results.length === 0) return;

        const stripe = new Stripe(env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
            apiVersion: '2026-01-28.clover',
            httpClient: Stripe.createFetchHttpClient(),
        });

        for (const appt of results as any[]) {
            if (!appt.stripe_session_id) continue;

            try {
                // Verify: Query the Stripe API using the session_id to check the actual status.
                const session = await stripe.checkout.sessions.retrieve(appt.stripe_session_id);

                // Reconcile: If Stripe says "Paid" but D1 says "Pending," update D1 to "Confirmed".
                if (session.payment_status === 'paid') {
                    console.log(`[RECONCILIATION] Discovered Ghost Payment for Appt ${appt.id}. Flagging as CONFIRMED.`);

                    await env.DB.prepare(
                        `UPDATE appointments SET status = 'confirmed' WHERE id = ?`
                    ).bind(appt.id).run();

                    await env.DB.prepare(
                        `UPDATE availability_slots SET is_booked = 1, version = version + 1 WHERE id = ?`
                    ).bind(appt.slot_id).run();

                    // Optional: Trigger confirmation SMS here via Twilio/custom endpoint...
                } else if (session.status === 'expired') {
                    // Cleanup expired sessions that webhooks missed
                    await env.DB.prepare(
                        `DELETE FROM appointments WHERE id = ?`
                    ).bind(appt.id).run();
                }
            } catch (err) {
                console.error(`Reconciliation failed for Appt ${appt.id}:`, err);
            }
        }
    }
};
