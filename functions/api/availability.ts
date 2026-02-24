// GET /api/availability?date=YYYY-MM-DD
// Returns which time slots are already booked for that date (pending or confirmed)
// Used by CalendarPicker to gray out unavailable slots

export async function onRequestGet(context: any) {
    const { env, request } = context;

    try {
        const url = new URL(request.url);
        const date = url.searchParams.get('date');

        if (!date) {
            // No date param: return all booked date+time pairs for the next 14 days
            const { results } = await env.DB.prepare(
                "SELECT date, time FROM bookings WHERE status IN ('pending','confirmed') AND date >= date('now') ORDER BY date, time"
            ).all();
            return new Response(JSON.stringify({ booked: results }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { results } = await env.DB.prepare(
            "SELECT time FROM bookings WHERE date = ? AND status IN ('pending','confirmed')"
        ).bind(date).all();

        const bookedTimes = results.map((r: any) => r.time);

        return new Response(JSON.stringify({ date, bookedTimes }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        // Fallback: return empty (no block) so the UI still works if table doesn't exist yet
        return new Response(JSON.stringify({ booked: [], bookedTimes: [] }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
