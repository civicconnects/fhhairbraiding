import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const services = [
    "Box Braids", "Bohemian Braids", "Knotless Braids", "Cornrows",
    "Passion Twists", "Faux Locs", "Senegalese Twists", "Lemonade Braids",
    "Fulani Braids", "Goddess Braids", "Micro Braids", "Crochet Braids",
    "Tribal Braids", "Spring Twists", "Jumbo Braids"
];

async function generateMdx() {
    const dir = path.join(process.cwd(), 'src', 'content', 'services');
    await fs.mkdir(dir, { recursive: true });

    for (const service of services) {
        const slug = service.toLowerCase().replace(/\s+/g, '-');
        const content = `---
title: "${service} in Radcliff KY & Fort Knox"
description: "Professional ${service} by F&H Hair Braiding. Secure your style with a $25 deposit."
slug: "${slug}"
keywords: "${service}, Hair Braiding Radcliff KY, Professional Braider Fort Knox"
---
# ${service}

Welcome to F&H Hair Braiding, the premier destination for **${service}** in the Radcliff, KY and Fort Knox area.

## Why Choose Our ${service}?

Our lead braiders specialize in flawless, tension-free ${service} that not only look stunning but protect your natural hair. With over 500+ crowns perfected this year, our social proof speaks for itself.

### The F&H Standard:
- **Tension-Free Technique:** We prioritize the health of your scalp.
- **Speed & Precision:** Get the crown you deserve without waiting in a salon chair all day.
- **Premium Quality:** We use only the best hair extensions for all ${service}.

![${service} - Hair Braiding Radcliff KY](/optimized-services/${slug}.jpg)

## Ready to Book?

*Only a few slots left this week!* Secure your style now for just a **$25 Deposit** through our integrated booking system.

<button className="book-now-btn">Secure My ${service}</button>
`;
        await fs.writeFile(path.join(dir, `${slug}.mdx`), content);
        console.log(`Generated ${slug}.mdx`);
    }
}

generateMdx().catch(console.error);
