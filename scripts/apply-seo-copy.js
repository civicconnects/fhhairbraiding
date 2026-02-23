import fs from 'fs';
import path from 'path';

// Top 5 SEO Silo Copy Definitions
const copyUpdates = {
    'knotless-braids': {
        headline: "Seamless, Tension-Free Knotless Braids in Radcliff.",
        content: "Focus on scalp comfort and the natural look. Our knotless technique starts with your natural hair, ensuring zero tension on the follicle—perfect for those prioritizing hair growth and comfort."
    },
    'bohemian-braids': {
        headline: "Effortless Goddess & Bohemian Styles.",
        content: "Focus on the Signature Crowns look. We blend high-quality extensions with goddess curls to create a voluminous, ethereal look tailored to your face shape."
    },
    'box-braids': {
        headline: "Precision Box Braids: Classic, Clean, and Long-Lasting.",
        content: "Focus on parting and neatness. Our signature box braids are known for razor-sharp parts and consistent density, designed to last 6-8 weeks while protecting your natural hair."
    },
    'cornrows': {
        headline: "Expertly Crafted Cornrows & Feed-in Styles.",
        content: "Focus on symmetry. From simple straight backs to intricate patterns, our cornrow services emphasize symmetry and scalp health."
    },
    'ponytails-and-updos': {
        headline: "Sophisticated Braided Ponytails & High-Crown Styles.",
        content: "Focus on structural integrity. Perfect for events or daily elegance, our braided ponytails are secured for longevity without compromising comfort."
    }
};

const servicesJsonPath = path.join(process.cwd(), 'src', 'content', 'services.json');
let services = JSON.parse(fs.readFileSync(servicesJsonPath, 'utf-8'));

for (let i = 0; i < services.length; i++) {
    const s = services[i];
    if (copyUpdates[s.slug]) {
        s.description = copyUpdates[s.slug].content;
        console.log(`Updated services.json for ${s.slug}`);
    }
}

fs.writeFileSync(servicesJsonPath, JSON.stringify(services, null, 4), 'utf-8');

// Now update the MDX Files to ensure headline injection
const contentDir = path.join(process.cwd(), 'src', 'content', 'services');

for (const slug of Object.keys(copyUpdates)) {
    // Note: 'ponytails-and-updos' might not exist or might be named differently in MDX. Let's check if it exists.
    const mdxPath = path.join(contentDir, `${slug}.mdx`);
    if (fs.existsSync(mdxPath)) {
        let content = fs.readFileSync(mdxPath, 'utf-8');

        // We will replace the first H2 inside the MDX with the new headline, and the first text block with the new content
        const newText = `## ${copyUpdates[slug].headline}\n\n${copyUpdates[slug].content}\n\n`;

        // Let's just prepend it to the top of the MDX content underneath any imports or at the very beginning.
        // Actually, the MDX is usually straightforward markdown. Let's replace everything before the first '###' or list with the new copy.
        // To be safe, let's prepend it and leave the rest for context if it exists, but the prompt says to Paste this into your project notes and use them as the SEO-OPTIMIZED SILO COPY.
        // Let's replace the first paragraph.

        content = newText + content;
        fs.writeFileSync(mdxPath, content, 'utf-8');
        console.log(`Updated ${slug}.mdx`);
    } else {
        console.log(`Warning: ${slug}.mdx not found.`);
    }
}
