import fs from 'fs';

let content = fs.readFileSync("../frontend/src/data/starsData.js", "utf-8");

const fixes = {
    "Lee Dong-wook": "https://m.media-amazon.com/images/M/MV5BMjA4NzUyNzkyMV5BMl5BanBnXkFtZTgwNTU0ODUwMDI@._V1_UY1200_CR88,0,630,1200_AL_.jpg",
    "Nagarjuna": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Akkineni_Nagarjuna_in_2018.jpg",
    "Kim Tae-ri": "https://upload.wikimedia.org/wikipedia/commons/e/e6/220718_Kim_Tae-ri.jpg",
    "Kim Go-eun": "https://m.media-amazon.com/images/M/MV5BNTVmZWQ4Y2ItZWRiYy00ZjkyLThhNTQtMmUxNTYxMjNjYjE1XkEyXkFqcGdeQXVyNDY5MTUyNjU@._V1_.jpg",
    "Sunil": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Sunil_Actor.jpg",
    "Ali": "https://upload.wikimedia.org/wikipedia/commons/5/52/Ali_Basha_Actor.jpg",
    "Johnny Lever": "https://upload.wikimedia.org/wikipedia/commons/8/87/Johnny_Lever_%28May_2011%29.jpg",
    "Kim Soo-hyun": "https://m.media-amazon.com/images/M/MV5BOTMyMjUwODYtOWRhNS00Y2NhLWI5NjQtMmRhMTgzNjIwNTkzXkEyXkFqcGdeQXVyMTE0MzQwMDk0._V1_.jpg",
    "Park Seo-joon": "https://m.media-amazon.com/images/M/MV5BMjIxYTY1NDQtMTAxNi00OTMzLTg4MWUtZDI2MjkyNmU5MTMwXkEyXkFqcGdeQXVyNDY5MTUyNjU@._V1_.jpg"
};

for (const [name, img] of Object.entries(fixes)) {
    const regex = new RegExp(`https://via\\.placeholder\\.com/300x450\\.png\\?text=${encodeURIComponent(name).replace(/-/g, "\\-")}`, "g");
    content = content.replace(regex, img);
}

fs.writeFileSync("../frontend/src/data/starsData.js", content);
console.log("Fixed missing images.");
