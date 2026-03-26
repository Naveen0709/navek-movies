import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import AIMovie from "../models/AIMovie.js";

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

const fetchMovies = async (url) => {
    try {
        const response = await axios.get(`${url}&api_key=${API_KEY}&include_adult=false`);
        const results = response.data.results || [];

        const movies = [];
        for (const m of results) {
            if (!m.poster_path || !m.overview) continue;

            const genres = m.genre_ids.map(id => genresMap[id]).filter(Boolean).join(", ");
            const releaseYear = m.release_date ? m.release_date.split("-")[0] : "N/A";

            movies.push({
                title: m.title,
                poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                rating: m.vote_average.toFixed(1),
                year: releaseYear,
                genre: genres || "N/A",
                description: m.overview,
                language: m.original_language,
                popularity: m.popularity,
                voteCount: m.vote_count,
                tmdbId: m.id,
                keywords: "" // To be filled if needed
            });
        }
        return movies;
    } catch (err) {
        console.error("Fetch Error:", err.message);
        return [];
    }
};

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for AI Seeding...");

        // await AIMovie.deleteMany({}); // Optional: Wipe old data

        const categories = [
            "popular",
            "top_rated",
            "upcoming"
        ];

        let totalSeeded = 0;
        const TARGET_MOVIES = 2000; // Let's try for 2,000 to fulfill "large dataset" intent

        for (const cat of categories) {
            console.log(`🎬 Fetching ${cat} movies...`);
            for (let page = 1; page <= 40; page++) {
                const url = `https://api.themoviedb.org/3/movie/${cat}?page=${page}`;
                const movies = await fetchMovies(url);

                if (movies.length === 0) break;

                for (const movie of movies) {
                    try {
                        await AIMovie.findOneAndUpdate(
                            { tmdbId: movie.tmdbId },
                            movie,
                            { upsert: true, new: true }
                        );
                        totalSeeded++;
                    } catch (err) {
                        // Duplicate or error
                    }
                }

                if (totalSeeded % 100 === 0) {
                    console.log(`✅ Seeded so far: ${totalSeeded}`);
                }
                if (totalSeeded >= TARGET_MOVIES) break;
            }
            if (totalSeeded >= TARGET_MOVIES) break;
        }

        console.log(`🎉 SUCCESS: Seeded ${totalSeeded} movies for Cinematic AI.`);
        process.exit();
    } catch (err) {
        console.error("❌ Seed Error:", err);
        process.exit(1);
    }
};

seedDB();
