function str2ab(str: string): Uint8Array {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}

function base64urlEncode(source: Uint8Array): string {
    let base64 = btoa(String.fromCharCode(...source));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function stringToUint8Array(str: string) {
    return new TextEncoder().encode(str);
}

export async function getGoogleAuthToken(env: any): Promise<string> {
    const header = { alg: 'RS256', typ: 'JWT' };
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600;

    const payload = {
        iss: env.GOOGLE_CLIENT_EMAIL,
        scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
        aud: 'https://oauth2.googleapis.com/token',
        exp,
        iat,
    };

    const encodedHeader = base64urlEncode(stringToUint8Array(JSON.stringify(header)));
    const encodedPayload = base64urlEncode(stringToUint8Array(JSON.stringify(payload)));
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    // Clean and prep the PEM key securely stored in Cloudflare Secrets
    let privateKeyPEM = env.GOOGLE_PRIVATE_KEY;
    privateKeyPEM = privateKeyPEM.replace(/\\n/g, '\n');

    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";

    if (!privateKeyPEM.includes(pemHeader)) {
        throw new Error("Invalid GOOGLE_PRIVATE_KEY format. Must be a valid PEM file.");
    }

    const pemContents = privateKeyPEM.substring(
        privateKeyPEM.indexOf(pemHeader) + pemHeader.length,
        privateKeyPEM.indexOf(pemFooter)
    ).replace(/\s/g, '');

    const binaryDerString = atob(pemContents);
    const binaryDer = str2ab(binaryDerString);

    const cryptoKey = await crypto.subtle.importKey(
        'pkcs8',
        binaryDer,
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256',
        },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        stringToUint8Array(dataToSign)
    );

    const encodedSignature = base64urlEncode(new Uint8Array(signature));
    const token = `${dataToSign}.${encodedSignature}`;

    // Exchange JWT for Access Token via Google OAuth2
    const resp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`
    });

    const body = await resp.json() as any;
    if (!resp.ok) {
        throw new Error(`Google Auth Error: ${JSON.stringify(body)}`);
    }

    return body.access_token;
}
