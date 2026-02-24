// GET /api/bookings — returns all bookings (admin protected)
// POST /api/bookings — not used here; see /api/book for public booking submission

export async function onRequestGet(context: any) {
    const { env, request } = context;

    // Admin-only: require X-Admin-Key
    const adminKey = request.headers.get("X-Admin-Key");
    if (!adminKey || adminKey !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const url = new URL(request.url);
        const status = url.searchParams.get("status"); // optional filter

        let query: string;
        let params: any[];

        if (status) {
            query = `SELECT * FROM bookings WHERE status = ? ORDER BY date ASC, time ASC`;
            params = [status];
        } else {
            query = `SELECT * FROM bookings ORDER BY date ASC, time ASC`;
            params = [];
        }

        const stmt = env.DB.prepare(query);
        const bound = params.length > 0 ? stmt.bind(...params) : stmt;
        const { results } = await bound.all();

        return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// PATCH /api/bookings — update a booking status (admin protected)
export async function onRequestPatch(context: any) {
    const { env, request } = context;

    const adminKey = request.headers.get("X-Admin-Key");
    if (!adminKey || adminKey !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { id, status } = await request.json();
        if (!id || !['pending', 'confirmed', 'cancelled'].includes(status)) {
            return new Response(JSON.stringify({ error: "Invalid id or status" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        await env.DB.prepare("UPDATE bookings SET status = ? WHERE id = ?")
            .bind(status, id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
