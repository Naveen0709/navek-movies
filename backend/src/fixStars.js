import fs from "fs";
import axios from "axios";

const API_KEY = "eb46ebb646eea7183b734797b40cb202";

// Names that need specific fixing
const fixes = {
    "Kim Soo-hyun": "137223", // TMDB person ID
    "Park Seo-joon": "1197825",
    "Lee Dong-wook": "569038",
    "Nagarjuna": "104111", // Akkineni Nagarjuna
    "Kim Tae-ri": "1517036",
    "Kim Go-eun": "1274092",
    "Sunil": "180126",
    "Ali": "1283842", // comedian Ali Basha
    "Johnny Lever": "51700"
};

const run = async () => {
    try {
        let rawData = fs.readFileSync("../frontend/src/data/starsData.js", "utf-8");

        for (const [name, id] of Object.entries(fixes)) {
            console.log("Fixing", name, id);
            const res = await axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`);
            if (res.data && res.data.profile_path) {
                const imageUrl = `https://image.tmdb.org/t/p/w500${res.data.profile_path}`;

                // create a regex specifically for this person's placeholder link
                const placeholderRegex = new RegExp(`https://via\\.placeholder\\.com/300x450\\.png\\?text=${encodeURIComponent(name).replace(/-/g, "\\-")}`, "g");

                rawData = rawData.replace(placeholderRegex, imageUrl);
                console.log("Updated", name, "with", imageUrl);
            }
        }

        fs.writeFileSync("../frontend/src/data/starsData.js", rawData);
        console.log("Fix complete.");
    } catch (e) {
        console.error(e);
    }
};

run();
