// GET /api/gallery?section=signature|portfolio
// Returns images from gallery_images table filtered by section
export async function onRequestGet(context: any) {
    const { env, request } = context;

    try {
        const url = new URL(request.url);
        const section = url.searchParams.get('section'); // 'signature' | 'portfolio' | null (all)

        let query: string;
        let params: any[];

        if (section && (section === 'signature' || section === 'portfolio')) {
            query = `SELECT id, service_id, service_slug, image_url, section, uploaded_at
                     FROM gallery_images WHERE section = ? ORDER BY uploaded_at DESC`;
            params = [section];
        } else {
            query = `SELECT id, service_id, service_slug, image_url, section, uploaded_at
                     FROM gallery_images ORDER BY uploaded_at DESC`;
            params = [];
        }

        const stmt = env.DB.prepare(query);
        const bound = params.length > 0 ? stmt.bind(...params) : stmt;
        const { results } = await bound.all();

        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
