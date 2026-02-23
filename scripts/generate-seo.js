import fs from 'fs';
import path from 'path';
const localServices = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'content', 'services.json'), 'utf-8'));

const baseUrl = 'https://fh-hairbraiding.pages.dev';

// Generate Sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    ${localServices.map(service => `
    <url>
        <loc>${baseUrl}/services/${service.slug}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    `).join('')}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap.trim());
console.log('✅ Generated sitemap.xml');

// Generate Robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robots);
console.log('✅ Generated robots.txt');
