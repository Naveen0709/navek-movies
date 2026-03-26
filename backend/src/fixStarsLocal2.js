import fs from 'fs';

let content = fs.readFileSync("../frontend/src/data/starsData.js", "utf-8");

const fixes = {
    "Vijay": "https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjItZjNjNjBiYzZkMzNjXkEyXkFqcGdeQXVyMTUzNTgzNzM0._V1_.jpg",
    "Lee Jong-suk": "https://m.media-amazon.com/images/M/MV5BMTE1OTI4NjgxODNeQTJeQWpwZ15BbWU4MDk3MDk2MTkx._V1_.jpg"
};

for (const [name, img] of Object.entries(fixes)) {
    const regex = new RegExp(`https://via\\.placeholder\\.com/300x450\\.png\\?text=${encodeURIComponent(name).replace(/-/g, "\\-")}`, "g");
    content = content.replace(regex, img);
}

fs.writeFileSync("../frontend/src/data/starsData.js", content);
console.log("Fixed missing images 2.");
