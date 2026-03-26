import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Movie from "./models/Movie.js";

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

const genresMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

const EXCLUDE_KEYWORDS = "15865|191062|156434|180540|1556|159392";

const fetchMoviesByLanguage = async (lang, langName, count = 100) => {
    let movies = [];
    let page = 1;

    while (movies.length < count && page <= 10) {
        try {
            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=${lang}&sort_by=popularity.desc&primary_release_date.gte=2020-01-01&include_adult=false&without_keywords=${EXCLUDE_KEYWORDS}&page=${page}`;
            const response = await axios.get(url);
            const results = response.data.results;

            if (!results || results.length === 0) break;

            for (const m of results) {
                if (!m.poster_path) continue;

                // Safety Checks
                const forbiddenWords = ["sex", "nude", "busty", "erotic", "uncut", "r-rated", "adult", "18+", "erotica", "girl friend", "sexual"];
                const textToCheck = (m.title + " " + m.overview).toLowerCase();
                if (forbiddenWords.some(word => textToCheck.includes(word))) continue;

                let genres = m.genre_ids.map(id => genresMap[id]).filter(Boolean).join(", ");

                // Get Trailer
                let trailerKey = "fT-l6K7K44A";
                try {
                    await new Promise(r => setTimeout(r, 50));
                    const vUrl = `https://api.themoviedb.org/3/movie/${m.id}/videos?api_key=${API_KEY}`;
                    const videoRes = await axios.get(vUrl);
                    const vids = videoRes.data.results || [];
                    const found = vids.find(v => v.site === "YouTube" && v.type === "Trailer") ||
                        vids.find(v => v.site === "YouTube" && v.type === "Teaser") ||
                        vids.find(v => v.site === "YouTube");
                    if (found) trailerKey = found.key;
                } catch (vErr) { }

                movies.push({
                    title: m.title,
                    poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                    rating: m.vote_average.toFixed(1) || "7.5",
                    year: m.release_date ? m.release_date.split("-")[0] : "2024",
                    genre: genres || "Drama",
                    description: m.overview || "A must-watch cinematic masterpiece.",
                    language: langName,
                    runtime: "2h 15m",
                    cast: "Top Cast",
                    director: "Renowned Director",
                    trailerId: trailerKey
                });

                if (movies.length >= count) break;
            }
            page++;
        } catch (err) {
            console.error(`Error fetching ${lang} page ${page}:`, err.message);
            break;
        }
    }
    return movies;
};

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for Language Slide Seeding...");

        const languages = [
            { name: "Tamil", code: "ta" },
            { name: "English", code: "en" },
            { name: "Korean", code: "ko" },
            { name: "Japanese", code: "ja" },
            { name: "Hindi", code: "hi" },
            { name: "Telugu", code: "te" }
        ];

        for (const lang of languages) {
            console.log(`🎬 Fetching 100 ${lang.name} movies...`);
            const movies = await fetchMoviesByLanguage(lang.code, lang.name, 100);

            // Upsert to avoid duplicates, but ensure we have 100
            for (const m of movies) {
                await Movie.findOneAndUpdate(
                    { title: m.title, language: m.language },
                    m,
                    { upsert: true, new: true }
                );
            }
            console.log(`✅ Seeded ${movies.length} ${lang.name} movies.`);
        }

        console.log("🎉 SUCCESS: Language sliders seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("❌ Seed Error:", err);
        process.exit(1);
    }
};

seedDB();
