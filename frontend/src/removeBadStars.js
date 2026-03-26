const fs = require('fs');
const filepath = "e:/prime video/frontend/src/data/starsData.js";
let content = fs.readFileSync(filepath, 'utf8');

const badNames = ['Jun Ji-hyun', 'Hyun Bin', 'Park Seo-joon'];

for (const name of badNames) {
    const regex = new RegExp(`\\s*\\{\\s*"name":\\s*"${name}",\\s*"image":\\s*"[^"]*"\\s*\\},?`, 'g');
    content = content.replace(regex, '');
}

// Just to be sure there are no dangling trailing commas before array closing brackets like `, ]`
content = content.replace(/,\s*\]/g, '\n]');

fs.writeFileSync(filepath, content, 'utf8');
console.log("Removed bad names.");
