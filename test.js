const fs = require('fs');

const path = "e:/prime video/frontend/src/data/starsData.js";
let dt = fs.readFileSync(path, 'utf8');

const regex = /"name":\s*"Vijay",\s*"image":\s*"(.*?)"/g;
let match;
while ((match = regex.exec(dt)) !== null) {
    console.log("Found Vijay image:", match[1]);
}

const fixes = {
    "Vijay": "https://image.tmdb.org/t/p/w500/mXfofvKWaF30rNq2fW1rT0s4wzQ.jpg",
    "Lee Jong-suk": "https://image.tmdb.org/t/p/w500/eW73DbmKQrqb6xDC52oMbVehw6G.jpg",
    "Park Seo-joon": "https://image.tmdb.org/t/p/w500/8tA2S2d9JjWzY64Q0v3d8eK3xT8.jpg",
    "Lee Dong-wook": "https://image.tmdb.org/t/p/w500/vXTijFOceeVgjPLaSzVdVmGzklm.jpg",
    "Nagarjuna": "https://image.tmdb.org/t/p/w500/i42K59YZY2NbNfqxfo78YoFz6Bv.jpg"
};

for (const name in fixes) {
    const r = new RegExp(`"name":\\s*"${name}",\\s*"image":\\s*"[^"]*"`, 'g');
    dt = dt.replace(r, `"name": "${name}",\n    "image": "${fixes[name]}"`);
}

fs.writeFileSync(path, dt, 'utf8');
console.log("Updated images.");
