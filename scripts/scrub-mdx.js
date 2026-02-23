import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'src', 'content', 'services');

const mdxFiles = fs.readdirSync(contentDir).filter(file => file.endsWith('.mdx'));

for (const file of mdxFiles) {
    const filePath = path.join(contentDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Replace description string
    content = content.replace(/Secure your style with a \$25 deposit\./g, 'Inquire today to secure your preferred style date.');

    // Replace markdown bold booking string
    content = content.replace(/\*Only a few slots left this week!\* Secure your style now for just a \*\*\$25 Deposit\*\* through our integrated booking system\./g, '*High demand style!* Inquire today to check our studio availability and secure your slot.');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Scrubbed pricing from ${file}`);
}
console.log('Finished scrubbing MDX files.');
