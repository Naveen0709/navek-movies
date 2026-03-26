import fs from 'fs';
import axios from 'axios';
const API_KEY = "eb46ebb646eea7183b734797b40cb202";

const ids = {
    "Vijay": 91547, // Thalapathy Joseph Vijay
    "Kim Soo-hyun": 137223,
    "Kim Tae-ri": 1517036,
    "Kim Go-eun": 1274092,
    "Sunil": 180126,
    "Ali": 1283842,
    "Johnny Lever": 51700,
    "Jun Ji-hyun": 121543,
    "Hyun Bin": 569036,
    "Park Seo-joon": 1197825
};

async function run() {
    let raw = fs.readFileSync("../frontend/src/data/starsData.js", "utf8");

    // We want to repair EVERYONE. 
    for (const [name, id] of Object.entries(ids)) {
        try {
            if (['Hyun Bin', 'Park Seo-joon', 'Jun Ji-hyun'].includes(name)) continue;

            const res = await axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`);
            if (res.data.profile_path) {
                const img = `https://image.tmdb.org/t/p/w500${res.data.profile_path}`;
                console.log("Found TMDB for", name, img);

                const reg = new RegExp(`"name":\\s*"${name}",\n\\s*"image":\\s*"[^"]*"`, "g");
                const reg2 = new RegExp(`"name":\\s*"${name}",\n\\s*\\n\\s*"image":\\s*"[^"]*"`, "g"); // in case of extra newline

                if (raw.match(reg)) {
                    raw = raw.replace(reg, `"name": "${name}",\n    "image": "${img}"`);
                    console.log("Updated", name);
                } else if (raw.match(reg2)) {
                    raw = raw.replace(reg2, `"name": "${name}",\n    "image": "${img}"`);
                    console.log("Updated", name);
                } else {
                    // It's possible the format in JSON looks slightly different, let's fix strictly manually via string splitting if we have to.
                    // But actually let's try a safer regex:
                    const safeReg = new RegExp(`"name"\\s*:\\s*"${name}"\\s*,\\s*"image"\\s*:\\s*"[^"]*"`, "g");
                    if (raw.match(safeReg)) {
                        raw = raw.replace(safeReg, `"name": "${name}", "image": "${img}"`);
                        console.log("Updated", name, "using safe RegExp");
                    } else {
                        console.log("Name not found in file (already deleted or different format):", name);
                    }
                }
            }
        } catch (e) { console.error("Error", name, e.message); }
    }

    fs.writeFileSync("../frontend/src/data/starsData.js", raw, "utf8");
    console.log("Fully fixed remaining images via TMDB profiles.");
}
run();
