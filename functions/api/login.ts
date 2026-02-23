export async function onRequestPost(context: any) {
    const { env, request } = context;

    const adminKey = request.headers.get("X-Admin-Key");
    const secretPassword = env.ADMIN_PASSWORD;

    // Log whether the secret is loaded (masked for security)
    console.log("[login] ADMIN_PASSWORD set:", !!secretPassword);

    if (!adminKey || !secretPassword || adminKey !== secretPassword) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
