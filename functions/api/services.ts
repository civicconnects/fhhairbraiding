export async function onRequestGet(context: any) {
    const { env } = context;

    try {
        const { results } = await env.DB.prepare(
            "SELECT id, slug, name, description, price, deposit_amount, duration_minutes, image_url FROM services ORDER BY name ASC"
        ).all();

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
