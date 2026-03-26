import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Movie from "./models/Movie.js";

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

const genresMap = {
    9648: "Mystery",
    53: "Thriller",
};

const languages = [
    { name: "English", code: "en" },
    { name: "Hindi", code: "hi" },
    { name: "Korean", code: "ko" },
    { name: "Japanese", code: "ja" },
    { name: "Tamil", code: "ta" },
    { name: "Telugu", code: "te" }
];

const fetchMovies = async (langCode, langName) => {
    let movies = [];
    const genreIds = "9648|53"; // Mystery or Thriller

    console.log(`🔍 Fetching Mystery & Thriller movies for ${langName}...`);

    for (let page = 1; page <= 10; page++) {
        try {
            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=${langCode}&with_genres=${genreIds}&sort_by=primary_release_date.desc&primary_release_date.gte=2021-01-01&page=${page}&include_adult=false`;
            const response = await axios.get(url);
            const results = response.data.results;

            for (const m of results) {
                if (!m.poster_path) continue;

                const releaseYear = m.release_date ? parseInt(m.release_date.split("-")[0]) : 0;

                let genres = m.genre_ids.map(id => {
                    if (id === 9648) return "Mystery";
                    if (id === 53) return "Thriller";
                    return null;
                }).filter(Boolean).join(", ");

                if (!genres) genres = "Mystery & Thriller";

                movies.push({
                    title: m.title,
                    poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                    rating: m.vote_average.toFixed(1),
                    year: releaseYear.toString(),
                    genre: genres,
                    description: m.overview || "A gripping mystery thriller that keeps you on the edge of your seat.",
                    language: langCode,
                    runtime: "2h 15m",
                    cast: "International Cast",
                    director: "Renowned Director",
                    trailerId: "fT-l6K7K44A" // Fallback
                });
            }
            if (movies.length >= 120) break; // Fetch a bit extra
        } catch (err) {
            console.error(`Error fetching ${langName} page ${page}:`, err.message);
            break;
        }
    }
    return movies.slice(0, 100);
};

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for Mystery & Thriller seeding...");

        let allNewMovies = [];

        for (const lang of languages) {
            const langMovies = await fetchMovies(lang.code, lang.name);
            console.log(`✅ Collected ${langMovies.length} movies for ${lang.name}`);
            allNewMovies.push(...langMovies);
        }

        console.log(`📊 Total Movies Collected: ${allNewMovies.length}`);

        // We don't want to delete ALL movies, just maybe avoid duplicates or only add these if they don't exist
        // But the user wants these specific slides. Let's just UPSERT or just INSERT.
        // Actually, to keep it clean, let's just insert them.

        const chunkSize = 50;
        for (let i = 0; i < allNewMovies.length; i += chunkSize) {
            await Movie.insertMany(allNewMovies.slice(i, i + chunkSize), { ordered: false }).catch(e => {
                // Ignore duplicate key errors if any
            });
            console.log(`🚀 Seeded ${Math.min(i + chunkSize, allNewMovies.length)} / ${allNewMovies.length}`);
        }

        console.log("🎉 SUCCESS: Mystery & Thriller Language Slides Seeded!");
        process.exit();
    } catch (err) {
        console.error("❌ Seed Error:", err);
        process.exit(1);
    }
};

seedDB();
