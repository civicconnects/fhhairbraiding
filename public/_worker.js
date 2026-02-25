// _worker.js — Cloudflare Pages Advanced Mode Worker
// This file is served by Cloudflare Pages as the sole fetch handler.
// It routes /api/* requests and passes all other routes to the static assets.

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS headers for all API responses
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
            "Content-Type": "application/json"
        };

        // Handle preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        // ── Admin auth helper ────────────────────────────────────────────────
        // Accepts either ADMIN_PASSWORD (legacy/superadmin) or a valid token
        // (password_hash) from the admin_users table.
        const checkAdminAuth = async (req) => {
            const key = req.headers.get("X-Admin-Key");
            if (!key) return false;
            // 1. Legacy ADMIN_PASSWORD
            if (env.ADMIN_PASSWORD && key === env.ADMIN_PASSWORD) return true;
            // 2. D1 admin_users token check (token == password_hash)
            try {
                const { results } = await env.DB.prepare(
                    "SELECT id FROM admin_users WHERE password_hash = ?"
                ).bind(key).all();
                return results.length > 0;
            } catch (_) { return false; }
        };

        // ── POST /api/login ──────────────────────────────────────────────────
        if (url.pathname === "/api/login" && request.method === "POST") {
            try {
                const body = await request.json().catch(() => ({}));
                const { username, password } = body;

                // Hash the submitted password with SHA-256
                const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password || ""));
                const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

                // Check admin_users table
                if (env.DB && username) {
                    const { results } = await env.DB.prepare(
                        "SELECT id, username, role, password_hash FROM admin_users WHERE username = ? AND password_hash = ?"
                    ).bind(username.toLowerCase(), hashHex).all();

                    if (results.length > 0) {
                        // Return the password_hash as the session token — used as X-Admin-Key
                        return new Response(JSON.stringify({
                            success: true,
                            username: results[0].username,
                            role: results[0].role,
                            token: results[0].password_hash  // session token for subsequent API calls
                        }), { status: 200, headers: corsHeaders });
                    }
                }

                // Fallback: legacy ADMIN_PASSWORD header
                const adminKey = request.headers.get("X-Admin-Key");
                if (adminKey && env.ADMIN_PASSWORD && adminKey === env.ADMIN_PASSWORD) {
                    return new Response(JSON.stringify({ success: true, username: "admin", role: "superadmin", token: env.ADMIN_PASSWORD }), {
                        status: 200, headers: corsHeaders
                    });
                }

                return new Response(JSON.stringify({ error: "Invalid credentials." }), { status: 401, headers: corsHeaders });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
            }
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

        // ── GET /api/gallery?section=signature|portfolio ─────────────────────
        if (url.pathname === "/api/gallery" && request.method === "GET") {
            try {
                const section = url.searchParams.get("section");
                let results;
                if (section === "signature" || section === "portfolio") {
                    ({ results } = await env.DB.prepare(
                        "SELECT id, service_id, service_slug, image_url, section, uploaded_at FROM gallery_images WHERE section = ? AND visible = 1 ORDER BY uploaded_at DESC"
                    ).bind(section).all());
                } else {
                    ({ results } = await env.DB.prepare(
                        "SELECT id, service_id, service_slug, image_url, section, uploaded_at FROM gallery_images WHERE visible = 1 ORDER BY uploaded_at DESC"
                    ).all());
                }
                return new Response(JSON.stringify(results), {
                    status: 200, headers: corsHeaders
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), {
                    status: 500, headers: corsHeaders
                });
            }
        }

        // ── GET /api/admin/gallery (admin — returns all images with visible flag) ─
        if (url.pathname === "/api/admin/gallery" && request.method === "GET") {
            const adminKey = request.headers.get("X-Admin-Key");
            if (!(await checkAdminAuth(request))) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
            }
            try {
                const { results } = await env.DB.prepare(
                    "SELECT id, service_id, service_slug, image_url, section, visible, uploaded_at FROM gallery_images ORDER BY uploaded_at DESC"
                ).all();
                return new Response(JSON.stringify(results), { status: 200, headers: corsHeaders });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
            }
        }

        // ── PATCH /api/admin/gallery — toggle visible ────────────────────────
        if (url.pathname === "/api/admin/gallery" && request.method === "PATCH") {
            const adminKey = request.headers.get("X-Admin-Key");
            if (!(await checkAdminAuth(request))) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
            }
            try {
                const { id, visible } = await request.json();
                await env.DB.prepare("UPDATE gallery_images SET visible = ? WHERE id = ?").bind(visible ? 1 : 0, id).run();
                return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
            }
        }

        // ── DELETE /api/admin/gallery — remove from D1 + R2 ─────────────────
        if (url.pathname === "/api/admin/gallery" && request.method === "DELETE") {
            const adminKey = request.headers.get("X-Admin-Key");
            if (!(await checkAdminAuth(request))) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
            }
            try {
                const { id } = await request.json();
                // Get the image URL so we can extract the R2 key
                const { results } = await env.DB.prepare("SELECT image_url FROM gallery_images WHERE id = ?").bind(id).all();
                if (results.length > 0) {
                    const imageUrl = results[0].image_url;
                    // Extract filename from URL (last segment after final /)
                    const r2Key = imageUrl.split('/').pop();
                    if (r2Key) {
                        try { await env.BUCKET.delete(r2Key); } catch (_) { /* R2 delete best-effort */ }
                    }
                }
                await env.DB.prepare("DELETE FROM gallery_images WHERE id = ?").bind(id).run();
                return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
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


        // ── GET /api/availability ────────────────────────────────────────────
        // Returns all booked date+time pairs so CalendarPicker can mark slots as taken
        if (url.pathname === "/api/availability" && request.method === "GET") {
            try {
                const date = url.searchParams.get("date");
                let results;
                if (date) {
                    ({ results } = await env.DB.prepare(
                        "SELECT time FROM bookings WHERE date = ? AND status IN ('pending','confirmed')"
                    ).bind(date).all());
                    return new Response(JSON.stringify({ date, bookedTimes: results.map(r => r.time) }), {
                        status: 200, headers: corsHeaders
                    });
                } else {
                    ({ results } = await env.DB.prepare(
                        "SELECT date, time FROM bookings WHERE status IN ('pending','confirmed') AND date >= date('now') ORDER BY date, time"
                    ).all());
                    return new Response(JSON.stringify({ booked: results }), {
                        status: 200, headers: corsHeaders
                    });
                }
            } catch (e) {
                return new Response(JSON.stringify({ booked: [], bookedTimes: [] }), {
                    status: 200, headers: corsHeaders
                });
            }
        }

        // ── POST /api/book ───────────────────────────────────────────────────
        // Public booking endpoint — conflict-checks then inserts into bookings table
        if (url.pathname === "/api/book" && request.method === "POST") {
            try {
                const body = await request.json();
                const { clientName, clientPhone, clientEmail, serviceName, startTime } = body;

                if (!clientName || !clientPhone || !serviceName || !startTime) {
                    return new Response(JSON.stringify({ error: "Missing required fields." }), {
                        status: 400, headers: corsHeaders
                    });
                }

                const dt = new Date(startTime);
                const date = dt.toISOString().split('T')[0];
                const time = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                // Conflict check
                const { results: conflicts } = await env.DB.prepare(
                    "SELECT id FROM bookings WHERE date = ? AND time = ? AND status IN ('pending','confirmed')"
                ).bind(date, time).all();

                if (conflicts.length > 0) {
                    return new Response(JSON.stringify({ error: "This time slot is already taken. Please choose another time." }), {
                        status: 409, headers: corsHeaders
                    });
                }

                await env.DB.prepare(
                    "INSERT INTO bookings (customer_name, phone, email, service_type, date, time, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')"
                ).bind(clientName, clientPhone, clientEmail || '', serviceName, date, time).run();

                // ── Send notification emails via Resend ─────────────────────────
                if (env.RESEND_API_KEY) {
                    try {
                        // Fetch all notification emails from D1
                        let recipients = [];
                        try {
                            const { results: notifEmails } = await env.DB.prepare(
                                "SELECT email FROM notification_settings ORDER BY created_at ASC"
                            ).all();
                            recipients = notifEmails.map(r => r.email);
                        } catch (_) { }

                        // Fallback to OWNER_EMAIL env var if table is empty
                        if (recipients.length === 0 && env.OWNER_EMAIL) {
                            recipients = [env.OWNER_EMAIL];
                        }

                        if (recipients.length > 0) {
                            const emailHtml = `
                                <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#111;color:#fff;border-radius:12px">
                                    <h2 style="color:#f59e0b;margin-bottom:4px">📅 New Booking Request</h2>
                                    <p style="color:#aaa;margin-top:0">Submitted ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
                                    <hr style="border-color:#333;margin:16px 0"/>
                                    <table style="width:100%;border-collapse:collapse">
                                        <tr><td style="padding:8px 0;color:#aaa;width:120px">Name</td><td style="color:#fff;font-weight:bold">${clientName}</td></tr>
                                        <tr><td style="padding:8px 0;color:#aaa">Phone</td><td style="color:#fff">${clientPhone}</td></tr>
                                        <tr><td style="padding:8px 0;color:#aaa">Email</td><td style="color:#fff">${clientEmail || 'Not provided'}</td></tr>
                                        <tr><td style="padding:8px 0;color:#aaa">Service</td><td style="color:#fff">${serviceName}</td></tr>
                                        <tr><td style="padding:8px 0;color:#aaa">Date</td><td style="color:#f59e0b;font-weight:bold">${date}</td></tr>
                                        <tr><td style="padding:8px 0;color:#aaa">Time</td><td style="color:#f59e0b;font-weight:bold">${time}</td></tr>
                                    </table>
                                    <hr style="border-color:#333;margin:24px 0"/>
                                    <a href="https://fhhairbraiding.com/admin" style="display:inline-block;background:#f59e0b;color:#000;font-weight:bold;padding:14px 28px;border-radius:8px;text-decoration:none">
                                        ✅ Confirm or Cancel in Admin
                                    </a>
                                    <p style="color:#666;font-size:12px;margin-top:16px">F&H Hair Braiding · 543 N Wilson Rd, Suite D, Radcliff KY 40160</p>
                                </div>`;

                            await fetch("https://api.resend.com/emails", {
                                method: "POST",
                                headers: {
                                    "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    from: "bookings@fhhairbraiding.com",
                                    to: recipients,
                                    subject: `📅 New Booking — ${serviceName} on ${date} at ${time}`,
                                    html: emailHtml
                                })
                            });
                        }
                    } catch (_) { /* Email is optional — booking already saved */ }
                }

                return new Response(JSON.stringify({ status: "success", message: "Booking request received! Monica will confirm shortly." }), {
                    status: 201, headers: corsHeaders
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), {
                    status: 500, headers: corsHeaders
                });
            }
        }

        // ── GET /api/notifications (admin) ────────────────────────────────────
        if (url.pathname === "/api/notifications" && request.method === "GET") {
            const adminKey = request.headers.get("X-Admin-Key");
            if (!(await checkAdminAuth(request))) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
            }
            try {
                const { results } = await env.DB.prepare(
                    "SELECT id, email, label, created_at FROM notification_settings ORDER BY created_at ASC"
                ).all();
                return new Response(JSON.stringify(results), { status: 200, headers: corsHeaders });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
            }
        }

        // ── POST /api/notifications (admin) ───────────────────────────────────
        if (url.pathname === "/api/notifications" && request.method === "POST") {
            const adminKey = request.headers.get("X-Admin-Key");
            if (!(await checkAdminAuth(request))) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
            }
            try {
                const { email, label } = await request.json();
                if (!email || !email.includes("@")) {
                    return new Response(JSON.stringify({ error: "Valid email required." }), { status: 400, headers: corsHeaders });
                }
                await env.DB.prepare(
                    "INSERT OR IGNORE INTO notification_settings (email, label) VALUES (?, ?)"
                ).bind(email.toLowerCase().trim(), label || null).run();
                return new Response(JSON.stringify({ success: true }), { status: 201, headers: corsHeaders });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
            }
        }

        // ── DELETE /api/notifications (admin) ─────────────────────────────────
        if (url.pathname === "/api/notifications" && request.method === "DELETE") {
            const adminKey = request.headers.get("X-Admin-Key");
            if (!(await checkAdminAuth(request))) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
            }
            try {
                const { id } = await request.json();
                await env.DB.prepare("DELETE FROM notification_settings WHERE id = ?").bind(id).run();
                return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
            }
        }

        // ── GET /api/bookings (admin) ─────────────────────────────────────────
        if (url.pathname === "/api/bookings" && request.method === "GET") {
            const adminKey = request.headers.get("X-Admin-Key");
            if (!(await checkAdminAuth(request))) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
            }
            try {
                const status = url.searchParams.get("status");
                let results;
                if (status) {
                    ({ results } = await env.DB.prepare(
                        "SELECT * FROM bookings WHERE status = ? ORDER BY date ASC, time ASC"
                    ).bind(status).all());
                } else {
                    ({ results } = await env.DB.prepare(
                        "SELECT * FROM bookings ORDER BY date ASC, time ASC"
                    ).all());
                }
                return new Response(JSON.stringify(results), { status: 200, headers: corsHeaders });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
            }
        }

        // ── PATCH /api/bookings (admin) ───────────────────────────────────────
        if (url.pathname === "/api/bookings" && request.method === "PATCH") {
            const adminKey = request.headers.get("X-Admin-Key");
            if (!(await checkAdminAuth(request))) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
            }
            try {
                const { id, status } = await request.json();
                if (!id || !['pending', 'confirmed', 'cancelled'].includes(status)) {
                    return new Response(JSON.stringify({ error: "Invalid id or status" }), { status: 400, headers: corsHeaders });
                }
                await env.DB.prepare("UPDATE bookings SET status = ? WHERE id = ?").bind(status, id).run();
                return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
            }
        }

        // ── Serve static assets for all other routes ─────────────────────────
        return env.ASSETS.fetch(request);
    }
};
