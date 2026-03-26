import fs from 'fs';

const filepath = "../frontend/src/data/starsData.js";
let dt = fs.readFileSync(filepath, "utf8");

const badKeywords = ['placeholder.com', 'wikimedia', 'amazon', 'mXfofvKWaF30rNq2fW1rT0s4wzQ.jpg'];

// We will find all objects like { "name": "...", "image": "..." }
// and if "image" contains badKeywords, we remove the whole object.
const regex = /\{[^{}]*"name"\s*:\s*"[^"]+"\s*,\s*"image"\s*:\s*"([^"]+)"[^{}]*\}/g;

let match;
const toRemove = [];

while ((match = regex.exec(dt)) !== null) {
    const imgUrl = match[1];
    const fullMatch = match[0];
    for (const kw of badKeywords) {
        if (imgUrl.includes(kw) || imgUrl === 'null' || imgUrl === '') {
            toRemove.push(fullMatch);
            break;
        }
    }
}

for (const block of toRemove) {
    // replace block optionally followed by comma
    const escapeBlock = block.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const r = new RegExp(escapeBlock + '\\s*,?', 'g');
    dt = dt.replace(r, '');
}

// Clean up trailing commas
dt = dt.replace(/,\s*\]/g, '\n]');

fs.writeFileSync(filepath, dt, "utf8");
console.log("Deleted " + toRemove.length + " objects from starsData.js forever.");
