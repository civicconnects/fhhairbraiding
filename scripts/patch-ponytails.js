export const PonytailData = {
    id: "ponytails-updos",
    name: "Ponytails & Updos",
    slug: "ponytails-updos",
    description: "Sophisticated Braided Ponytails & High-Crown Styles. Focus on structural integrity. Perfect for events or daily elegance, our braided ponytails are secured for longevity without compromising comfort.",
    duration_minutes: 180,
    image_url: "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80&w=600"
};

import fs from 'fs';
import path from 'path';
const p = path.join(process.cwd(), 'src', 'content', 'services.json');
const d = JSON.parse(fs.readFileSync(p, 'utf-8'));
if (!d.some(x => x.slug === 'ponytails-updos')) {
    d.push(PonytailData);
    fs.writeFileSync(p, JSON.stringify(d, null, 4));
    console.log('Added ponytails to services.json');
}

const mdxPath = path.join(process.cwd(), 'src', 'content', 'services', 'ponytails-updos.mdx');
if (!fs.existsSync(mdxPath)) {
    fs.writeFileSync(mdxPath, `## Sophisticated Braided Ponytails & High-Crown Styles.\n\nFocus on structural integrity. Perfect for events or daily elegance, our braided ponytails are secured for longevity without compromising comfort.\n\n### The Process\nWe begin with a thorough wash and conditioning, followed by the careful construction of your high-crown masterpiece.`);
    console.log('Created ponytails-updos.mdx');
}
