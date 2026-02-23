import { getGoogleAuthToken } from './_googleAuth';

export async function onRequestPost(context: any) {
    const { request, env } = context;

    try {
        const body = await request.json() as any;
        const { clientName, clientPhone, clientEmail, serviceName, startTime, durationHours } = body;

        if (!clientName || !clientPhone || !serviceName || !startTime || !durationHours) {
            return new Response(JSON.stringify({ error: "Missing required booking details." }), { status: 400 });
        }

        const token = await getGoogleAuthToken(env);

        const startDate = new Date(startTime);
        const endDate = new Date(startDate.getTime() + (durationHours * 60 * 60 * 1000));

        const eventPayload = {
            summary: `Braiding Appt: ${clientName} - ${serviceName}`,
            description: `Service: ${serviceName}\nClient: ${clientName}\nPhone: ${clientPhone}\nEmail: ${clientEmail || 'N/A'}\n\nLead generated via FH-HairBraiding Authority Engine.`,
            start: {
                dateTime: startDate.toISOString(),
                timeZone: 'America/New_York',
            },
            end: {
                dateTime: endDate.toISOString(),
                timeZone: 'America/New_York',
            },
            // Optionally add client email as attendee if they provide it to auto-dispatch the invite
            attendees: clientEmail ? [{ email: clientEmail }] : [],
            reminders: {
                useDefault: true,
            }
        };

        const calResp = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.GOOGLE_CALENDAR_ID)}/events?sendUpdates=all`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventPayload)
        });

        const eventData = await calResp.json() as any;

        if (!calResp.ok) {
            return new Response(JSON.stringify({ error: eventData }), { status: 500 });
        }

        return new Response(JSON.stringify({
            status: "success",
            message: "Calendar invite dispatched!",
            eventId: eventData.id
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
