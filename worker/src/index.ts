/// <reference types="@cloudflare/workers-types" />
import Stripe from 'stripe';
import { verifyStripeSignature } from './stripe';

export interface Env {
    DB: D1Database;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    FRONTEND_URL: string;
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        const url = new URL(request.url);
        const origin = request.headers.get("Origin") || "*";

        // CORS Handling
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, stripe-signature",
                },
            });
        }

        const corsHeaders = {
            "Access-Control-Allow-Origin": origin,
            "Content-Type": "application/json",
        };

        // Initialize Stripe using Fetch HTTP Client for Cloudflare Workers
        const stripe = new Stripe(env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
            apiVersion: '2026-01-28.clover',
            httpClient: Stripe.createFetchHttpClient(),
        });

        // 1. Init Booking & Checkout Session
        if (url.pathname === "/api/bookings/init" && request.method === "POST") {
            try {
                const { slotId } = await request.json() as { slotId: string };
                if (!slotId) return new Response("Missing slotId", { status: 400, headers: corsHeaders });

                const userId = 'user_demo_123';
                const serviceId = 'srv_1'; // Box Braids
                const bookingId = `bk_${crypto.randomUUID()}`;

                // Create PENDING booking in D1. Strict UNIQUE(slot_id) prevents race conditions.
                try {
                    await env.DB.prepare(
                        `INSERT INTO bookings (id, user_id, service_id, slot_id, status) VALUES (?, ?, ?, ?, 'PENDING')`
                    ).bind(bookingId, userId, serviceId, slotId).run();
                } catch (dbError: any) {
                    // If a unique constraint fails, it means the slot is taken.
                    return new Response(JSON.stringify({ error: "Slot unavailable" }), { status: 409, headers: corsHeaders });
                }

                // Create Stripe Checkout Session for $25 Deposit
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'F&H Hair Braiding Deposit',
                                description: `Slot: ${slotId}`,
                            },
                            unit_amount: 2500, // $25.00
                        },
                        quantity: 1,
                    }],
                    mode: 'payment',
                    success_url: `${env.FRONTEND_URL || 'http://localhost:5173'}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${env.FRONTEND_URL || 'http://localhost:5173'}/?canceled=true`,
                    client_reference_id: bookingId,
                    metadata: {
                        bookingId: bookingId,
                        slotId: slotId,
                        userId: userId
                    },
                    expires_at: Math.floor(Date.now() / 1000) + (30 * 60) // Expires in 30 mins
                }, {
                    idempotencyKey: bookingId
                });

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
                        const bookingId = session.metadata?.bookingId;
                        const pi = session.payment_intent as string;

                        if (bookingId) {
                            await env.DB.prepare(
                                `UPDATE bookings SET status = 'CONFIRMED', stripe_payment_intent_id = ? WHERE id = ?`
                            ).bind(pi, bookingId).run();

                            const userId = session.metadata?.userId;
                            if (userId) {
                                // Upsert user and increment loyalty points
                                await env.DB.prepare(
                                    `INSERT INTO users (id, email, name, loyalty_points) VALUES (?, ?, ?, 1) 
                   ON CONFLICT(id) DO UPDATE SET loyalty_points = loyalty_points + 1`
                                ).bind(userId, session.customer_details?.email || 'demo@example.com', session.customer_details?.name || 'Demo User').run();
                            }
                        }
                        break;
                    }
                    case 'checkout.session.expired': {
                        const session = event.data.object as Stripe.Checkout.Session;
                        const bookingId = session.metadata?.bookingId;
                        if (bookingId) {
                            await env.DB.prepare(
                                `UPDATE bookings SET status = 'CANCELLED' WHERE id = ?`
                            ).bind(bookingId).run();
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
                `SELECT status FROM bookings WHERE slot_id = ? AND status IN ('PENDING', 'CONFIRMED')`
            ).bind(slotId).all();

            const status = results.length > 0 ? "BOOKED" : "AVAILABLE";
            return new Response(JSON.stringify({ id: slotId, status }), { status: 200, headers: corsHeaders });
        }

        return new Response("F&H Hair Braiding API is running. Direct D1 bindings functional.", { status: 200, headers: corsHeaders });
    },
};
