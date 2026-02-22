// Cloudflare Images Delivery URL Generator
// Uses Cloudflare Images resizing and auto-WebP conversion.

export function getOptimizedImageUrl(
    imageId: string,
    variant: 'hero' | 'thumbnail' | 'gallery' = 'gallery'
): string {
    // Replace with actual Cloudflare account hash when deployed
    const accountHash = process.env.CF_IMAGE_ACCOUNT_HASH || "YOUR_ACCOUNT_HASH";

    // Example construct: https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/<VARIANT_NAME>
    return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`;
}
