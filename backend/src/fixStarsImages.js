import fs from 'fs';

let content = fs.readFileSync("../frontend/src/data/starsData.js", "utf-8");

const actualImages = {
    "Vijay": "https://image.tmdb.org/t/p/w500/mXfofvKWaF30rNq2fW1rT0s4wzQ.jpg",
    "Lee Jong-suk": "https://image.tmdb.org/t/p/w500/eW73DbmKQrqb6xDC52oMbVehw6G.jpg",
    "Park Seo-joon": "https://image.tmdb.org/t/p/w500/8tA2S2d9JjWzY64Q0v3d8eK3xT8.jpg",
    "Lee Dong-wook": "https://image.tmdb.org/t/p/w500/vXTijFOceeVgjPLaSzVdVmGzklm.jpg",
    "Nagarjuna": "https://image.tmdb.org/t/p/w500/i42K59YZY2NbNfqxfo78YoFz6Bv.jpg"
};

// Also let's clean up any amazon/wikimedia links to these specific actors in case they got swapped earlier
// "image": "https://m.media-amazon...." to "image": "https://image.tmdb.org...."
// We'll iterate through all the actors and regex replace their whole image block if their name matches

Object.keys(actualImages).forEach(name => {
    const replacement = actualImages[name];
    const regex = new RegExp(`"name":\\s*"${name}",\\s*"image":\\s*"[^"]+"`, "g");
    content = content.replace(regex, `"name": "${name}",\n    "image": "${replacement}"`);
});

fs.writeFileSync("../frontend/src/data/starsData.js", content);
console.log("Images applied to starsData.js!");
