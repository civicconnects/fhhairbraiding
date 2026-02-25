export async function onRequestPost(context: any) {
    const { env, request } = context;

    // Accept either the legacy ADMIN_PASSWORD or a valid session token (password_hash from admin_users)
    const adminKey = request.headers.get("X-Admin-Key");
    let authorized = false;

    if (adminKey) {
        if (env.ADMIN_PASSWORD && adminKey === env.ADMIN_PASSWORD) {
            authorized = true;
        } else if (env.DB) {
            try {
                const { results } = await env.DB.prepare(
                    "SELECT id FROM admin_users WHERE password_hash = ?"
                ).bind(adminKey).all();
                authorized = results.length > 0;
            } catch (_) { }
        }
    }

    if (!authorized) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const serviceId = formData.get("serviceId") as string;
        const serviceSlug = formData.get("serviceSlug") as string;
        const section = (formData.get("section") as string) || "portfolio";

        if (!file) {
            return new Response(JSON.stringify({ error: "No file provided" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        if (!serviceId || !serviceSlug) {
            return new Response(JSON.stringify({ error: "serviceId and serviceSlug are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Unique timestamped filename to prevent overwrites
        const ext = file.name.split('.').pop();
        const baseName = serviceSlug.replace(/[^a-z0-9-]/gi, '-');
        const fileName = `${baseName}-${Date.now()}.${ext}`;

        await env.BUCKET.put(fileName, file.stream(), {
            httpMetadata: { contentType: file.type }
        });

        const newImageUrl = `https://images.fhhairbraiding.com/${fileName}`;

        // Insert into gallery_images table (section-aware, multi-image per service)
        await env.DB.prepare(
            "INSERT INTO gallery_images (service_id, service_slug, image_url, section, visible) VALUES (?, ?, ?, ?, 1)"
        ).bind(serviceId, serviceSlug, newImageUrl, section).run();

        // Also update main image_url on services table if section is 'signature'
        if (section === "signature") {
            await env.DB.prepare(
                "UPDATE services SET image_url = ? WHERE id = ?"
            ).bind(newImageUrl, serviceId).run();
        }

        return new Response(JSON.stringify({ url: newImageUrl, section, fileName }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
