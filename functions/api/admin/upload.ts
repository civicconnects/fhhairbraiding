export async function onRequestPost(context: any) {
    const { env, request } = context;

    const adminKey = request.headers.get("X-Admin-Key");
    const secretPassword = env.ADMIN_PASSWORD;

    if (!adminKey || !secretPassword || adminKey !== secretPassword) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const serviceId = formData.get("serviceId");

        if (!file) {
            return new Response(JSON.stringify({ error: "No file provided" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const fileName = `${Date.now()}-${file.name}`;
        await env.BRAIDS_BUCKET.put(fileName, file.stream());

        // Build the CDN public URL for the bucket
        const newImageUrl = `https://pub-${env.R2_PUBLIC_ID || "your-id"}.r2.dev/${fileName}`;

        if (serviceId) {
            await env.DB.prepare(
                "UPDATE services SET image_url = ? WHERE id = ?"
            ).bind(newImageUrl, serviceId).run();
        }

        return new Response(JSON.stringify({ url: newImageUrl }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
