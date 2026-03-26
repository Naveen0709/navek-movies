import axios from "axios";

const urls = [
    "https://image.tmdb.org/t/p/w500/go8GUz7poytTvm9P9HNHQ3T84N1.jpg", // Kriti
    "https://image.tmdb.org/t/p/w500/qaMDhXyAWBV3FXEGPavXoYwh3kb.jpg", // Bhumi
    "https://image.tmdb.org/t/p/w500/5KubBeb2DkNXoU4lzzBdWzqzzlM.jpg", // Nayanthara
    "https://image.tmdb.org/t/p/w500/fTdgSinsAitdujBBEUEA72GY0pv.jpg"  // Keerthy
];

const check = async () => {
    for (const url of urls) {
        try {
            const res = await axios.head(url);
            console.log(`${url} -> ${res.status}`);
        } catch (e) {
            console.error(`${url} -> FAILED: ${e.message}`);
        }
    }
};

check();
