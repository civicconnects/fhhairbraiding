/// <reference types="@cloudflare/workers-types" />
import app from './index';

// Helper to verify Stripe webhook signature using Web Crypto API.
// Works natively in Cloudflare Workers edge environment.

const encoder = new TextEncoder();

export async function verifyStripeSignature(
    payload: string,
    signatureHeader: string,
    secret: string
): Promise<boolean> {
    try {
        const parts = signatureHeader.split(',').map((part) => part.split('='));
        const tPart = parts.find((p) => p[0] === 't');
        const v1Part = parts.find((p) => p[0] === 'v1');

        if (!tPart || !v1Part) return false;

        const timestamp = tPart[1];
        const signature = v1Part[1];

        const signedPayload = `${timestamp}.${payload}`;

        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );

        const sigBuf = hexToBuffer(signature);

        return await crypto.subtle.verify(
            'HMAC',
            key,
            sigBuf as unknown as BufferSource,
            encoder.encode(signedPayload)
        );
    } catch (err) {
        return false;
    }
}

function hexToBuffer(hex: string): Uint8Array {
    const bytes = new Uint8Array(Math.ceil(hex.length / 2));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}
