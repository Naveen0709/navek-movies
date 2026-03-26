import fs from 'fs';

let content = fs.readFileSync("../frontend/src/data/starsData.js", "utf-8");

// We need to replace Vijay's image URL.
// The bad URL from before was mXfofvKWaF30rNq2fW1rT0s4wzQ.jpg
// The good URL for Joseph Vijay is y7UJa3TT9GTe8nXW0rLkNYeLiDu.jpg

const regex = /"name":\s*"Vijay",\s*"image":\s*"[^"]+"/g;
content = content.replace(regex, `"name": "Vijay",\n    "image": "https://image.tmdb.org/t/p/w500/y7UJa3TT9GTe8nXW0rLkNYeLiDu.jpg"`);

fs.writeFileSync("../frontend/src/data/starsData.js", content);
console.log("Updated Vijay's picture!");
