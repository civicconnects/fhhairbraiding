// POST /api/book — public booking endpoint
// Writes to D1 bookings table with conflict check.
// Optionally also creates a Google Calendar event if keys are present.

import { getGoogleAuthToken } from './_googleAuth';

export async function onRequestPost(context: any) {
    const { request, env } = context;

    try {
        const body = await request.json() as any;
        const { clientName, clientPhone, clientEmail, serviceName, startTime, durationHours } = body;

        if (!clientName || !clientPhone || !serviceName || !startTime) {
            return new Response(JSON.stringify({ error: "Missing required booking details." }), { status: 400 });
        }

        const dt = new Date(startTime);
        const date = dt.toISOString().split('T')[0];
        const time = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        // ── Conflict check in D1 ────────────────────────────────────────────
        const { results: conflicts } = await env.DB.prepare(
            "SELECT id FROM bookings WHERE date = ? AND time = ? AND status IN ('pending','confirmed')"
        ).bind(date, time).all();

        if (conflicts.length > 0) {
            return new Response(JSON.stringify({
                error: "This time slot is already taken. Please choose another time."
            }), { status: 409, headers: { 'Content-Type': 'application/json' } });
        }

        // ── Save booking to D1 ──────────────────────────────────────────────
        await env.DB.prepare(
            "INSERT INTO bookings (customer_name, phone, email, service_type, date, time, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')"
        ).bind(clientName, clientPhone, clientEmail || '', serviceName, date, time).run();

        // ── Optional: Google Calendar event (skip gracefully if keys missing) ──
        if (env.GOOGLE_CALENDAR_ID && env.GOOGLE_SERVICE_ACCOUNT_JSON) {
            try {
                const token = await getGoogleAuthToken(env);
                const startDate = new Date(startTime);
                const endDate = new Date(startDate.getTime() + ((durationHours || 4) * 60 * 60 * 1000));
                const eventPayload = {
                    summary: `Braiding Appt: ${clientName} - ${serviceName}`,
                    description: `Service: ${serviceName}\nClient: ${clientName}\nPhone: ${clientPhone}\nEmail: ${clientEmail || 'N/A'}`,
                    start: { dateTime: startDate.toISOString(), timeZone: 'America/New_York' },
                    end: { dateTime: endDate.toISOString(), timeZone: 'America/New_York' },
                    attendees: clientEmail ? [{ email: clientEmail }] : [],
                };
                await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.GOOGLE_CALENDAR_ID)}/events?sendUpdates=all`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(eventPayload)
                });
            } catch (_) { /* Calendar optional — D1 booking already saved */ }
        }

        return new Response(JSON.stringify({
            status: "success",
            message: "Booking request received! Monica will confirm shortly."
        }), { headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
