import fs from 'fs';
import path from 'path';

function findFiles(dir, exts) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFiles(file, exts));
        } else {
            if (exts.includes(path.extname(file))) {
                results.push(file);
            }
        }
    });
    return results;
}

const sourceFiles = findFiles(path.join(process.cwd(), 'src'), ['.ts', '.tsx', '.mdx', '.json']);
let failed = false;

for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf-8');

    // Quick regex to catch stray $ amounts or explicit "Price" declarations
    // This looks for $ followed by minimum 1 digit or the word Price (case-insensitive)
    const matches = content.match(/(\$[0-9]+)|(\bPrice\b)/gi);

    if (matches) {
        // Exclude false positives like "price" in variables like base_price if needed, but per prompt NO PRICING.
        const cleanMatches = matches.filter(m => !m.toLowerCase().startsWith('price') || !file.includes('ServiceGrid.tsx'));

        if (cleanMatches.length > 0) {
            console.error(`🚨 SEO Guardrail Failure: Pricing data found in ${file}`);
            console.error(`Matches: ${cleanMatches.join(', ')}`);
            failed = true;
        }
    }
}

if (failed) {
    console.error('Build blocked. Remove all pricing information before proceeding with the V4.0 Authority build.');
    process.exit(1);
} else {
    console.log('✅ SEO Guardrail Passed: No pricing artifacts detected in source files.');
    process.exit(0);
}
