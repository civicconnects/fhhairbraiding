import { getGoogleAuthToken } from './_googleAuth';

export async function onRequestGet(context: any) {
    const { env, request } = context;

    try {
        if (!env.GOOGLE_CLIENT_EMAIL || !env.GOOGLE_PRIVATE_KEY || !env.GOOGLE_CALENDAR_ID) {
            return new Response(JSON.stringify({ error: "Google Calendar secrets not configured." }), { status: 500 });
        }

        const url = new URL(request.url);
        // Default to finding availability for the next 14 days
        const start = url.searchParams.get('start') || new Date().toISOString();
        const endDay = new Date();
        endDay.setDate(endDay.getDate() + 14);
        const end = url.searchParams.get('end') || endDay.toISOString();

        const token = await getGoogleAuthToken(env);

        // Fetch freeBusy from Google Calendar
        const calResp = await fetch(`https://www.googleapis.com/calendar/v3/freeBusy`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                timeMin: start,
                timeMax: end,
                timeZone: 'America/New_York', // ET for Kentucky area
                items: [{ id: env.GOOGLE_CALENDAR_ID }]
            })
        });

        const freeBusyData = await calResp.json() as any;

        if (!calResp.ok) {
            return new Response(JSON.stringify({ error: freeBusyData }), { status: 500 });
        }

        const busySlots = freeBusyData.calendars[env.GOOGLE_CALENDAR_ID]?.busy || [];

        // Return the raw busy slots back to the frontend to calculate the open UI blocks
        return new Response(JSON.stringify({
            status: "success",
            timeMin: start,
            timeMax: end,
            busy: busySlots
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
