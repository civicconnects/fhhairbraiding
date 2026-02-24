// _worker.js — Cloudflare Pages Advanced Mode Worker
// This file is served by Cloudflare Pages as the sole fetch handler.
// It routes /api/* requests and passes all other routes to the static assets.

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS headers for all API responses
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
            "Content-Type": "application/json"
        };

        // Handle preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        // ── POST /api/login ──────────────────────────────────────────────────
        if (url.pathname === "/api/login" && request.method === "POST") {
            const adminKey = request.headers.get("X-Admin-Key");
            const secret = env.ADMIN_PASSWORD;

            console.log("[/api/login] ADMIN_PASSWORD configured:", !!secret);

            if (!adminKey || !secret || adminKey !== secret) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), {
                    status: 401, headers: corsHeaders
                });
            }
            return new Response(JSON.stringify({ success: true }), {
                status: 200, headers: corsHeaders
            });
        }

        // ── GET /api/services ────────────────────────────────────────────────
        if (url.pathname === "/api/services" && request.method === "GET") {
            try {
                const { results } = await env.DB.prepare(
                    "SELECT id, slug, name, description, price, deposit_amount, duration_minutes, image_url FROM services ORDER BY name ASC"
                ).all();
                return new Response(JSON.stringify(results), {
                    status: 200, headers: corsHeaders
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), {
                    status: 500, headers: corsHeaders
                });
            }
        }

        // ── POST /api/admin/upload ───────────────────────────────────────────
        if (url.pathname === "/api/admin/upload" && request.method === "POST") {
            const adminKey = request.headers.get("X-Admin-Key");
            const secret = env.ADMIN_PASSWORD;

            if (!adminKey || !secret || adminKey !== secret) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), {
                    status: 401, headers: corsHeaders
                });
            }
            try {
                const formData = await request.formData();
                const file = formData.get("file");
                const serviceId = formData.get("serviceId");
                const serviceSlug = formData.get("serviceSlug") || serviceId;
                const section = formData.get("section") || "signature";

                if (!file) {
                    return new Response(JSON.stringify({ error: "No file provided" }), {
                        status: 400, headers: corsHeaders
                    });
                }

                // Unique timestamped filename to prevent overwrites
                const ext = file.name.split('.').pop();
                const baseName = String(serviceSlug).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
                const fileName = `${baseName}-${Date.now()}.${ext}`;

                await env.BUCKET.put(fileName, file.stream(), {
                    httpMetadata: { contentType: file.type }
                });
                const newImageUrl = `https://images.fhhairbraiding.com/${fileName}`;

                // Insert into gallery_images table (supports multiple images per service x section)
                await env.DB.prepare(
                    "INSERT INTO gallery_images (service_id, service_slug, image_url, section) VALUES (?, ?, ?, ?)"
                ).bind(serviceId, serviceSlug, newImageUrl, section).run();

                // Update main image_url on services only for 'signature' uploads
                if (section === "signature" && serviceId) {
                    await env.DB.prepare("UPDATE services SET image_url = ? WHERE id = ?")
                        .bind(newImageUrl, serviceId).run();
                }

                return new Response(JSON.stringify({ url: newImageUrl, section, fileName }), {
                    status: 200, headers: corsHeaders
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), {
                    status: 500, headers: corsHeaders
                });
            }
        }


        // ── Serve static assets for all other routes ─────────────────────────
        return env.ASSETS.fetch(request);
    }
};
