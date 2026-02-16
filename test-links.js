const fs = require('fs');
const path = require('path');

const htmlFiles = [
    'index.html', 'about.html', 'msme.html',
    'experts.html', 'contact.html', 'privacy-policy.html',
    'terms-msme.html', 'terms-experts.html', 'usage-policy.html'
];

const linkPattern = /href="([^"]+)"/g;
const errors = [];

console.log("Starting Link Verification...");

htmlFiles.forEach(file => {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: source file not found: ${file}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const links = [...content.matchAll(linkPattern)].map(m => m[1]);

    links.forEach(link => {
        // Skip external links, anchors, mailto, tel, javascript
        if (link.startsWith('http') || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('javascript:')) return;

        // Remove anchors and query params
        const cleanLink = link.split('#')[0].split('?')[0];

        if (!cleanLink) return; // href="#" becomes empty string

        // Check if file exists relative to the current file
        // Since all html files are in root, simple check mostly works. 
        // But assets are relative.

        const absolutePath = path.resolve(cleanLink);

        if (!fs.existsSync(absolutePath)) {
            errors.push(`${file}: Broken link → ${link} (Resolved: ${absolutePath})`);
        }
    });
});

if (errors.length > 0) {
    console.log('❌ Broken links found:');
    errors.forEach(err => console.log(`  - ${err}`));
    process.exit(1);
} else {
    console.log('✅ All internal links are valid!');
}
