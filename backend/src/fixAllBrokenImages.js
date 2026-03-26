import fs from 'fs';
import axios from 'axios';

const API_KEY = "eb46ebb646eea7183b734797b40cb202";

const run = async () => {
    let content = fs.readFileSync("../frontend/src/data/starsData.js", "utf-8");

    // Using regex to gather all names and their images
    const regex = /"name":\s*"([^"]+)",\s*"image":\s*"([^"]+)"/g;
    let match;
    const namesToFix = [];

    while ((match = regex.exec(content)) !== null) {
        const name = match[1];
        const image = match[2];

        // If image is a placeholder, or from amazon, or wiki, it might fail.
        if (image.includes('placeholder.com') || image.includes('amazon') || image.includes('wikimedia') || image.includes('null') || image === '') {
            namesToFix.push(name);
        }
    }

    console.log("Found " + namesToFix.length + " names to fix:", namesToFix);

    const EXACT_MATCH_IDS = {
        "Vijay": 91547,
        "Lee Jong-suk": 1095818,
        "Park Seo-joon": 1197825,
        "Lee Dong-wook": 1238592,
        "Nagarjuna": 149958,
        "Kim Soo-hyun": 137223,
        "Kim Tae-ri": 1517036,
        "Sunil": 180126,
        "Ali": 1283842,
        "Johnny Lever": 51700,
        "Kim Go-eun": 1274092,
        "Han So-hee": 2408304,
        "IU (Lee Ji-eun)": 1391501,
        "Park Shin-hye": 560241,
        "Jun Ji-hyun": 121543,
        "Song Hye-kyo": 119430
    };

    for (const name of namesToFix) {
        try {
            let personId = EXACT_MATCH_IDS[name];
            let imageUrl = null;

            if (!personId) {
                const searchRes = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(name)}`);
                const searchData = searchRes.data;
                if (searchData.results && searchData.results.length > 0) {
                    const sortedResults = searchData.results.sort((a, b) => b.popularity - a.popularity);
                    personId = sortedResults[0].id;
                    if (sortedResults[0].profile_path) {
                        imageUrl = `https://image.tmdb.org/t/p/w500${sortedResults[0].profile_path}`;
                    }
                }
            } else {
                const personRes = await axios.get(`https://api.themoviedb.org/3/person/${personId}?api_key=${API_KEY}`);
                if (personRes.data.profile_path) {
                    imageUrl = `https://image.tmdb.org/t/p/w500${personRes.data.profile_path}`;
                }
            }

            if (imageUrl) {
                console.log("Fixed", name, "with", imageUrl);
                const r = new RegExp(`"name":\\s*"${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",\\s*"image":\\s*"[^"]+"`);
                content = content.replace(r, `"name": "${name}",\n    "image": "${imageUrl}"`);
            } else {
                console.log("Could NOT find image for", name);
            }
        } catch (e) {
            console.error("Error on", name, e.message);
        }
    }

    fs.writeFileSync("../frontend/src/data/starsData.js", content);
    console.log("Done patching.");
}

run();
